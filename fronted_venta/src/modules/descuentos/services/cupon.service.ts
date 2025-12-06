import type { 
    CrearCuponRequest, 
    CuponResponse,
    CrearCuponLoteRequest // Nuevo DTO importado
} from '../types/cupon.types';
import { API_BASE_URL } from '../../../config/api.config';

// La ruta del controlador es /api/admin/cupones.
// Como API_BASE_URL ya contiene '/api', 
// solo necesitamos el resto de la ruta.
const CUPON_API_PATH = '/admin/cupones';
const CUPON_API_URL = `${API_BASE_URL}${CUPON_API_PATH}`; // Esto resulta en .../api/admin/cupones


// --------------------------------------------------------
// 1. CREAR CUPONES EN LOTE (REEMPLAZA A crearCupon)
// --------------------------------------------------------
export const crearCuponesEnLote = async (request: CrearCuponLoteRequest): Promise<CuponResponse[]> => {
    // No es necesario modificar usosMaximos aquí, el backend lo forzará a 1.
    
    const response = await fetch(CUPON_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // TODO: Agrega aquí cualquier token de autenticación (ej. 'Authorization': `Bearer ${token}`)
        },
        body: JSON.stringify(request),
    });

    // Manejo de errores 400 (BAD REQUEST) desde el backend
    if (!response.ok) {
        let errorMessage = `Error al crear el lote de cupones (HTTP ${response.status})`;
        
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.mensaje || errorMessage;
        } catch (e) {
            // Ignorar si la respuesta no es JSON
        }
        
        throw new Error(errorMessage);
    }

    // El backend retorna un array de CuponResponse[] al crear en lote
    return response.json() as Promise<CuponResponse[]>;
};

// NOTA: El método 'crearCupon' original fue eliminado ya que el formulario 
// ahora utiliza 'crearCuponesEnLote'.
// --------------------------------------------------------
// 2. LISTAR TODOS LOS CUPONES
// --------------------------------------------------------
export const listarTodosLosCupones = async (): Promise<CuponResponse[]> => {
    const response = await fetch(CUPON_API_URL);
    if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo cargar la lista de cupones.`);
    }
    return response.json() as Promise<CuponResponse[]>;
};

// --------------------------------------------------------
// 3. ACTUALIZAR CUPÓN
// --------------------------------------------------------
export const actualizarCupon = async (id: number, data: CrearCuponRequest): Promise<CuponResponse> => {
    // Se mantiene la lógica de mapeo de usosMaximos para la edición
    const requestBody = {
        ...data,
        usosMaximos: data.usosMaximos === 0 ? null : data.usosMaximos,
    };
    
    const response = await fetch(`${CUPON_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        let errorMessage = `Error al actualizar el cupón (HTTP ${response.status})`;
        try { const errorData = await response.json(); errorMessage = errorData.message || errorData.mensaje || errorMessage; } catch (e) {}
        throw new Error(errorMessage);
    }
    return response.json() as Promise<CuponResponse>;
};


// --------------------------------------------------------
// 4. ELIMINAR CUPÓN
// --------------------------------------------------------
export const eliminarCupon = async (id: number): Promise<void> => {
    const response = await fetch(`${CUPON_API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 404) {
        throw new Error(`Cupón con ID ${id} no encontrado.`);
    }
    if (!response.ok && response.status !== 204) { // 204 No Content es una respuesta válida sin cuerpo
        throw new Error(`Error ${response.status} al eliminar el cupón.`);
    }
    // Si es 204 (No Content), la promesa se resuelve sin valor de retorno.
};
// Corchete de cierre extra eliminado.