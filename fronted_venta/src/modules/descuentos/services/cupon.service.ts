import type { CrearCuponRequest, CuponResponse } from '../types/cupon.types';
import { API_BASE_URL } from '../../../config/api.config';

// La ruta del controlador es /api/admin/cupones.
// Como API_BASE_URL ya contiene '/api', 
// solo necesitamos el resto de la ruta.
const CUPON_API_PATH = '/admin/cupones';
const CUPON_API_URL = `${API_BASE_URL}${CUPON_API_PATH}`; // Esto resulta en .../api/admin/cupones

export const crearCupon = async (data: CrearCuponRequest): Promise<CuponResponse> => {
  // Manejo de valores nulos o cero para usosMaximos (si se envía 0, se asume null/ilimitado)
  const requestBody = {
    ...data,
    usosMaximos: data.usosMaximos === 0 ? null : data.usosMaximos,
  };

  const response = await fetch(CUPON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Agrega aquí cualquier token de autenticación (ej. 'Authorization': `Bearer ${token}`)
    },
    body: JSON.stringify(requestBody),
  });

  // Manejo de errores 400 (BAD REQUEST) desde el backend
  if (!response.ok) {
    // Si el backend no devuelve un JSON útil en el error, usamos un mensaje genérico.
    // En tu backend (CuponAdminController) se retorna 400 en caso de error de Runtime.
    let errorMessage = `Error al crear el cupón (HTTP ${response.status})`;
    
    try {
        const errorData = await response.json();
        // Si el backend usa el formato DescuentoAplicadoResponse o similar para errores
        if (errorData.mensaje) {
             errorMessage = errorData.mensaje;
        } else if (errorData.message) {
             errorMessage = errorData.message;
        }
    } catch (e) {
        // Ignorar si la respuesta no es JSON
    }
    
    throw new Error(errorMessage);
  }

  return response.json() as Promise<CuponResponse>;
};

// Aquí irían los otros métodos CRUD (listarCupones, obtenerPorId, etc.)
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