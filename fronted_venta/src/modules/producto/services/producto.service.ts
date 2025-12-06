// fronted_venta/src/modules/producto/services/producto.service.ts

import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';
import type { ProductoDTO, ComboRequest } from '../types/product.types';

const API_PRODUCTOS_URL = `${API_BASE_URL}/productos`;

/**
 * Interfaz para productos disponibles (formato del backend)
 */
export interface ProductoDisponible {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  precio: number;
  imagenUrl: string | null;
}

/**
 * Servicio para manejar operaciones relacionadas con productos
 */
export const ProductoService = {
  /**
   * Obtiene todos los productos disponibles para el frontend (vendedor)
   * GET /api/productos/disponibles
   */
  obtenerProductosDisponibles: async (): Promise<ProductoDisponible[]> => {
    try {
      const response = await axios.get<ProductoDisponible[]>(`${API_PRODUCTOS_URL}/disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos disponibles:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los productos individuales para crear combos (admin)
   * GET /api/productos/admin/disponibles
   */
  obtenerProductosDisponiblesAdmin: async (): Promise<ProductoDTO[]> => {
    try {
      const response = await axios.get<ProductoDTO[]>(`${API_PRODUCTOS_URL}/admin/disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos disponibles (admin):', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo combo
   * POST /api/productos/combos
   */
  crearCombo: async (request: ComboRequest): Promise<ProductoDTO> => {
    try {
      const response = await axios.post<ProductoDTO>(`${API_PRODUCTOS_URL}/combos`, request);
      return response.data;
    } catch (error) {
      console.error('Error al crear combo:', error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de combos creados
   * GET /api/productos/combos
   */
  obtenerListaCombos: async (): Promise<ProductoDTO[]> => {
    try {
      const response = await axios.get<ProductoDTO[]>(`${API_PRODUCTOS_URL}/combos`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lista de combos:', error);
      throw error;
    }
  },

  /**
   * Obtiene el detalle de un combo específico
   * GET /api/productos/combos/{id}
   */
  obtenerDetalleCombo: async (id: number): Promise<ProductoDTO> => {
    try {
      const response = await axios.get<ProductoDTO>(`${API_PRODUCTOS_URL}/combos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener detalle del combo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todos los productos con filtro opcional por tipo
   * GET /api/productos?tipo=...
   */
  obtenerTodosLosProductos: async (tipo?: string): Promise<ProductoDTO[]> => {
    try {
      const params = tipo ? { tipo } : {};
      const response = await axios.get<ProductoDTO[]>(`${API_PRODUCTOS_URL}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      throw error;
    }
  },
};

export default ProductoService;
