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
// Ejemplo de listar:
export const listarCupones = async (): Promise<CuponResponse[]> => {
    const response = await fetch(CUPON_API_URL);
    if (!response.ok) {
        throw new Error(`Error al listar cupones (HTTP ${response.status})`);
    }
    return response.json() as Promise<CuponResponse[]>;
};