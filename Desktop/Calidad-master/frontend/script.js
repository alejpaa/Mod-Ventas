import { ParticleSystem } from './particles.js';

/**
 * TETRIS ENTERPRISE FRONTEND - TIME & LOGIC EDITION
 * -------------------------------------------------
 * Incluye: Cronómetro de precisión, Sistema de Puntuación Complejo (Combos),
 * Mecánica de Lock Delay (deslizamiento), Cuenta Regresiva y Efectos.
 */

// --- 1. CONFIGURACIÓN MAESTRA ---
const CONFIG = {
    API_URL: 'http://localhost:3000/api',
    BLOCK_SIZE: 30,
    // Tiempos en milisegundos
    DAS: 160,          // Delayed Auto Shift
    ARR: 10,           // Auto Repeat Rate
    LOCK_DELAY: 500,   // Tiempo antes de fijar pieza (para deslizar)
    MAX_LOCK_MOVES: 15,// Máximos movimientos permitidos en Lock Delay
    COLORS: [
        null,
        '#00f2ea', // I - Cyan
        '#f0f000', // O - Amarillo
        '#a000f0', // T - Morado
        '#00ff00', // S - Verde
        '#ff0050', // Z - Rojo
        '#0055ff', // J - Azul
        '#ffaa00'  // L - Naranja
    ]
};

const PIECES = 'ILJOTSZ';
const SHAPES = [
    [],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], 
    [[0, 0, 2], [2, 2, 2], [0, 0, 0]], 
    [[3, 0, 0], [3, 3, 3], [0, 0, 0]], 
    [[4, 4], [4, 4]], 
    [[0, 5, 0], [5, 5, 5], [0, 0, 0]], 
    [[0, 6, 6], [6, 6, 0], [0, 0, 0]], 
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];

const fx = new ParticleSystem('board');

// --- 2. CLASE: GESTOR DE TIEMPO (CRONÓMETRO) ---
class GameTimer {
    constructor() {
        this.startTime = 0;
        this.elapsed = 0;
        this.isRunning = false;
        this.pauseStart = 0;
    }

    start() {
        this.startTime = Date.now();
        this.elapsed = 0;
        this.isRunning = true;
        this.pauseStart = 0;
    }

    pause() {
        if (this.isRunning) {
            this.pauseStart = Date.now();
            this.isRunning = false;
        }
    }

    resume() {
        if (!this.isRunning && this.pauseStart > 0) {
            const pausedDuration = Date.now() - this.pauseStart;
            this.startTime += pausedDuration; // Ajustar tiempo inicio
            this.isRunning = true;
            this.pauseStart = 0;
        }
    }

    stop() {
        this.isRunning = false;
    }

    getTimeMs() {
        if (!this.isRunning) return this.elapsed;
        return Date.now() - this.startTime;
    }

    getTimeSeconds() {
        return Math.floor(this.getTimeMs() / 1000);
    }

    getFormatted() {
        const s = this.getTimeSeconds();
        const mins = Math.floor(s / 60).toString().padStart(2, '0');
        const secs = (s % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
}

// --- 3. CLASE: SISTEMA DE PUNTUACIÓN AVANZADO ---
class ScoreManager {
    constructor() {
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = -1; // -1 significa sin combo activo
        this.backToBack = false; // Si el último clear fue un Tetris
        this.breakdown = { singles:0, doubles:0, triples:0, tetris:0 };
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = -1;
        this.backToBack = false;
        this.breakdown = { singles:0, doubles:0, triples:0, tetris:0 };
    }

    addLines(count) {
        if (count === 0) {
            this.combo = -1; // Romper combo
            return;
        }

        // Actualizar contadores básicos
        this.lines += count;
        this.level = Math.floor(this.lines / 10) + 1;
        
        const types = ['singles', 'doubles', 'triples', 'tetris'];
        this.breakdown[types[count-1]]++;

        // Cálculo de Puntos Base
        let basePoints = [0, 100, 300, 500, 800][count];
        
        // Lógica Back-to-Back (Tetris seguido de Tetris)
        const isTetris = (count === 4);
        if (isTetris && this.backToBack) {
            basePoints = Math.floor(basePoints * 1.5); // Bonus x1.5
            console.log("🔥 BACK TO BACK TETRIS!");
        }
        this.backToBack = isTetris;

        // Lógica de Combos (Racha)
        this.combo++;
        const comboBonus = this.combo * 50 * this.level;
        
        // Sumar todo
        this.score += (basePoints * this.level) + comboBonus;
    }

    addSoftDrop() { this.score += 1; }
    addHardDrop(cells) { this.score += (cells * 2); }
}

// Instancias
const timer = new GameTimer();
const scorer = new ScoreManager();

// --- 4. ESTADO GLOBAL Y VARIABLES DE JUEGO ---
const state = {
    token: localStorage.getItem('tetris_token'),
    user: localStorage.getItem('tetris_user'),
    
    // Controles
    keys: JSON.parse(localStorage.getItem('tetris_keys_v2')) || { 
        left: 'KeyA', right: 'KeyD', down: 'ArrowDown', 
        drop: 'Space', rot: 'KeyH', hold: 'KeyC' 
    },
    
    board: Array(20).fill().map(() => Array(10).fill(0)),
    player: { pos: {x:0, y:0}, matrix: null },
    
    queue: [],
    holdPiece: null,
    canHold: true,
    
    // Estados de Bucle
    isRunning: false,
    isPaused: false,
    isCountingDown: false,
    
    // Variables de Tiempo y Física
    lastTime: 0,
    dropCounter: 0,
    lockCounter: 0,      // Tiempo acumulado tocando suelo
    lockMoveCounter: 0,  // Cantidad de movimientos en el suelo
    isTouchingGround: false
};

const ctx = document.getElementById('board').getContext('2d');
const nextCtx = document.getElementById('next').getContext('2d');
const holdCtx = document.getElementById('hold').getContext('2d');

// --- 5. CLIENTE API ---
const api = async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

    try {
        const res = await fetch(`${CONFIG.API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });
        return await res.json();
    } catch (err) {
        return { success: false, error: 'Error de conexión' };
    }
};

// --- 6. MOTOR FÍSICO (GAME ENGINE) ---

function createPiece(type) {
    return SHAPES[PIECES.indexOf(type) + 1].map(row => [...row]);
}

function resetPlayer() {
    while (state.queue.length < 3) {
        const randType = PIECES[Math.floor(Math.random() * PIECES.length)];
        state.queue.push(createPiece(randType));
    }
    
    state.player.matrix = state.queue.shift();
    state.player.pos.y = 0;
    state.player.pos.x = (10 - state.player.matrix[0].length) / 2 | 0;
    
    state.canHold = true;
    
    // Resetear variables de Lock Delay
    state.lockCounter = 0;
    state.lockMoveCounter = 0;
    state.isTouchingGround = false;

    if (collide(state.board, state.player)) {
        gameOver();
    }
    
    drawSidePanels();
}

function collide(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge() {
    state.player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                state.board[y + state.player.pos.y][x + state.player.pos.x] = value;
            }
        });
    });
}

// Sistema de Rotación con Wall Kicks
function rotate(dir) {
    const pos = state.player.pos.x;
    let offset = 1;
    const rotateMatrix = (matrix, direction) => {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (direction > 0) matrix.forEach(row => row.reverse());
        else matrix.reverse();
    };

    rotateMatrix(state.player.matrix, dir);

    while (collide(state.board, state.player)) {
        state.player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > state.player.matrix[0].length) {
            rotateMatrix(state.player.matrix, -dir);
            state.player.pos.x = pos;
            return;
        }
    }
    
    // Si rota mientras toca el suelo, resetear Lock Timer (si no excedió movimientos)
    if (state.isTouchingGround) resetLockTimer();
}

function resetLockTimer() {
    if (state.lockMoveCounter < CONFIG.MAX_LOCK_MOVES) {
        state.lockCounter = 0;
        state.lockMoveCounter++;
    }
}

function sweep() {
    let rowCount = 0;
    outer: for (let y = state.board.length - 1; y > 0; --y) {
        for (let x = 0; x < state.board[y].length; ++x) {
            if (state.board[y][x] === 0) continue outer;
        }
        
        for (let x = 0; x < 10; x++) fx.explode(x, y, CONFIG.COLORS[state.board[y][x]]);
        
        const row = state.board.splice(y, 1)[0].fill(0);
        state.board.unshift(row);
        ++y;
        rowCount++;
    }

    // Usar el ScoreManager para calcular puntos complejos
    scorer.addLines(rowCount);
    updateStatsUI();
}

/**
 * --- 7. BUCLE DE JUEGO CON LOCK DELAY ---
 */
function update(time = 0) {
    if (!state.isRunning || state.isCountingDown) {
        requestAnimationFrame(update);
        return;
    }
    
    const deltaTime = time - state.lastTime;
    state.lastTime = time;
    
    if (!state.isPaused) {
        state.dropCounter += deltaTime;
        const speed = Math.max(100, 1000 - ((scorer.level - 1) * 100));

        // Verificar si toca el suelo (Predicción)
        state.player.pos.y++;
        state.isTouchingGround = collide(state.board, state.player);
        state.player.pos.y--;

        if (state.isTouchingGround) {
            // Mecánica de Lock Delay
            state.lockCounter += deltaTime;
            
            // Si pasa el tiempo límite O el usuario fuerza caída (dropCounter alto)
            if (state.lockCounter >= CONFIG.LOCK_DELAY || state.dropCounter > speed) {
                lockPiece();
            }
        } else {
            // Caída normal en el aire
            if (state.dropCounter > speed) {
                playerDrop();
            }
        }
    }

    draw();
    fx.update();
    requestAnimationFrame(update);
}

function lockPiece() {
    merge();
    resetPlayer();
    sweep();
    updateStatsUI();
    state.dropCounter = 0;
    state.lockCounter = 0;
}

function playerDrop() {
    state.player.pos.y++;
    if (collide(state.board, state.player)) {
        state.player.pos.y--;
        // No fijamos aquí, dejamos que el Lock Delay se encargue en el siguiente frame
        state.isTouchingGround = true;
    } else {
        state.dropCounter = 0;
    }
}

// --- 8. RENDERIZADO ---
function drawBlock(ctx, x, y, color, size = CONFIG.BLOCK_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeRect(x * size, y * size, size, size);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(x * size, y * size, size, 4);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 300, 600);

    state.board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) drawBlock(ctx, x, y, CONFIG.COLORS[value]);
        });
    });

    if (state.player.matrix && !state.isPaused) {
        // Ghost
        const ghost = { pos: { ...state.player.pos }, matrix: state.player.matrix };
        while (!collide(state.board, ghost)) ghost.pos.y++;
        ghost.pos.y--;
        
        ghost.matrix.forEach((row, y) => row.forEach((v, x) => {
            if (v) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.fillRect((ghost.pos.x + x) * CONFIG.BLOCK_SIZE, (ghost.pos.y + y) * CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.strokeRect((ghost.pos.x + x) * CONFIG.BLOCK_SIZE, (ghost.pos.y + y) * CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
            }
        }));

        // Player
        state.player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) drawBlock(ctx, x + state.player.pos.x, y + state.player.pos.y, CONFIG.COLORS[value]);
            });
        });
    }
}

function drawSidePanels() {
    [nextCtx, holdCtx].forEach(c => c.clearRect(0,0,100,300));
    state.queue.forEach((piece, idx) => {
        const offsetY = idx * 4;
        piece.forEach((row, y) => row.forEach((v, x) => {
            if(v) drawBlock(nextCtx, x + 1, y + 1 + offsetY, CONFIG.COLORS[v], 20);
        }));
    });
    if (state.holdPiece) {
        state.holdPiece.forEach((row, y) => row.forEach((v, x) => {
            if(v) drawBlock(holdCtx, x + 1, y + 1, CONFIG.COLORS[v], 20);
        }));
    }
}

// --- 9. INTERFAZ Y CUENTA REGRESIVA ---
function startCountdown(callback) {
    state.isCountingDown = true;
    const overlay = document.getElementById('pause-overlay');
    overlay.classList.remove('hidden');
    let count = 3;
    
    const interval = setInterval(() => {
        overlay.innerText = count > 0 ? count : '¡YA!';
        if (count < 0) {
            clearInterval(interval);
            overlay.classList.add('hidden');
            overlay.innerText = 'PAUSA'; // Reset texto
            state.isCountingDown = false;
            callback();
        }
        count--;
    }, 600);
}

function initGame() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    document.getElementById('user-display').innerText = state.user;
    
    // Reset Completo
    state.board.forEach(r => r.fill(0));
    scorer.reset();
    timer.stop();
    state.queue = []; 
    state.holdPiece = null;
    fx.clear();

    // Iniciar Secuencia
    startCountdown(() => {
        resetPlayer();
        state.isRunning = true;
        state.isPaused = false;
        timer.start();
        updateStatsUI();
        // Loop de actualización de tiempo (1s)
        setInterval(() => {
            if(state.isRunning && !state.isPaused) updateStatsUI();
        }, 1000);
    });

    update();
}

async function gameOver() {
    state.isRunning = false;
    timer.stop();
    
    const gameData = {
        score: scorer.score,
        lines: scorer.lines,
        level: scorer.level,
        time: timer.getTimeSeconds(), // Tiempo real de la clase GameTimer
        breakdown: scorer.breakdown
    };
    
    await api('/stats', 'POST', gameData);
    
    document.getElementById('modal-over').classList.remove('hidden');
    document.getElementById('final-score').innerText = scorer.score;
    
    renderBars(scorer.breakdown);
}

function renderBars(breakdown) {
    const total = Object.values(breakdown).reduce((a,b)=>a+b, 0) || 1;
    const bars = document.getElementById('bars');
    bars.innerHTML = '';
    const labels = { singles: '1 Línea', doubles: '2 Líneas', triples: '3 Líneas', tetris: 'TETRIS' };
    
    Object.entries(breakdown).forEach(([key, val]) => {
        const percent = (val / total) * 100;
        bars.innerHTML += `
            <div class="bar-row">
                <span class="bar-label">${labels[key]}</span>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
                <span class="bar-value">${val}</span>
            </div>
        `;
    });
}

function updateStatsUI() {
    document.getElementById('score').innerText = scorer.score.toLocaleString();
    document.getElementById('lines').innerText = scorer.lines;
    document.getElementById('level').innerText = scorer.level;
    
    // Calcular LPM usando el tiempo real del Timer
    const mins = timer.getTimeSeconds() / 60;
    const lpm = mins > 0 ? Math.floor(scorer.lines / mins) : 0;
    
    // Nota: En el HTML anterior el ID era 'lpm', si quieres mostrar el tiempo
    // habría que agregar un elemento <span id="time">, por ahora usamos LPM
    document.getElementById('lpm').innerText = lpm + " (" + timer.getFormatted() + ")";
}

// --- 10. INPUTS ---
document.addEventListener('keydown', e => {
    if (!document.getElementById('modal-cfg').classList.contains('hidden')) return;
    if (!state.isRunning || state.isPaused || state.isCountingDown) return;
    
    const code = e.code;
    const map = state.keys;

    if (code === map.left) {
        state.player.pos.x--;
        if (collide(state.board, state.player)) state.player.pos.x++;
        else resetLockTimer(); // Moverse resetea el lock
    } 
    else if (code === map.right) {
        state.player.pos.x++;
        if (collide(state.board, state.player)) state.player.pos.x--;
        else resetLockTimer();
    } 
    else if (code === map.down) {
        playerDrop();
        scorer.addSoftDrop();
    } 
    else if (code === map.rot) {
        rotate(1);
    } 
    else if (code === map.drop) {
        let dropped = 0;
        while (!collide(state.board, state.player)) {
            state.player.pos.y++;
            dropped++;
        }
        state.player.pos.y--;
        scorer.addHardDrop(dropped);
        lockPiece(); // Hard Drop bloquea inmediatamente
    } 
    else if (code === map.hold) {
        if (!state.canHold) return;
        const currentMatrix = state.player.matrix;
        if (state.holdPiece) {
            state.player.matrix = state.holdPiece;
            state.holdPiece = currentMatrix;
            state.player.pos = { x: 3, y: 0 };
        } else {
            state.holdPiece = currentMatrix;
            resetPlayer();
        }
        state.canHold = false;
        drawSidePanels();
    }
});

// --- 11. EVENTOS ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('u-in').value;
    const p = document.getElementById('p-in').value;
    
    const res = await api('/auth/login', 'POST', { username: u, password: p });
    
    if (res.success) {
        state.token = res.data.token;
        state.user = res.data.username;
        localStorage.setItem('tetris_token', state.token);
        localStorage.setItem('tetris_user', state.user);
        initGame();
    } else {
        alert(res.error || 'Error al ingresar');
    }
});

document.getElementById('btn-reg').onclick = async (e) => {
    e.preventDefault();
    const u = document.getElementById('u-in').value;
    const p = document.getElementById('p-in').value;
    const res = await api('/auth/register', 'POST', { username: u, password: p });
    if(res.success) alert('Registro exitoso.'); else alert(res.error);
};

document.getElementById('btn-retry').onclick = () => {
    document.getElementById('modal-over').classList.add('hidden');
    initGame();
};

document.getElementById('btn-logout').onclick = () => {
    localStorage.clear();
    location.reload();
};

document.getElementById('btn-settings').onclick = () => {
    state.isPaused = true;
    timer.pause();
    document.getElementById('modal-cfg').classList.remove('hidden');
    
    const keyLabels = { left: 'IZQUIERDA', right: 'DERECHA', down: 'CAÍDA SUAVE', drop: 'CAÍDA FUERTE', rot: 'ROTAR', hold: 'SOSTENER' };
    const list = document.getElementById('cfg-list');
    list.innerHTML = '';
    
    Object.entries(state.keys).forEach(([action, code]) => {
        const div = document.createElement('div');
        div.className = 'key-item';
        div.innerHTML = `<span>${keyLabels[action]}</span> <b>${code.replace('Key','')}</b>`;
        div.onclick = () => {
            div.innerHTML = `<span>${keyLabels[action]}</span> <b>...</b>`;
            div.classList.add('listening');
            const handler = (ev) => {
                state.keys[action] = ev.code;
                localStorage.setItem('tetris_keys_v2', JSON.stringify(state.keys));
                api('/user/settings', 'PUT', { keyMap: state.keys });
                document.removeEventListener('keydown', handler);
                document.getElementById('btn-settings').click();
            };
            document.addEventListener('keydown', handler);
        };
        list.appendChild(div);
    });
};

document.getElementById('btn-cfg-close').onclick = () => {
    document.getElementById('modal-cfg').classList.add('hidden');
    state.isPaused = false;
    timer.resume();
};

document.getElementById('btn-rank').onclick = async () => {
    const res = await api('/leaderboard');
    if (res.success) {
        let msg = "🏆 TOP 15 GLOBAL 🏆\n\n";
        res.data.forEach((r, i) => {
            msg += `#${i+1} ${r.username} - ${r.score.toLocaleString()} pts (Nvl ${r.level_reached})\n`;
        });
        alert(msg);
    }
};

if (state.token) initGame();