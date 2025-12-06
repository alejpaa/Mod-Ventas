// fronted_venta/src/modules/producto/types/product.types.ts

export type TipoProducto = 'EQUIPO_MOVIL' | 'SERVICIO_HOGAR' | 'SERVICIO_MOVIL' | 'COMBO';

export interface ProductoDTO {
  id: number; // El backend usa Long (número) ahora
  codigo?: string; // PROD-0001, COMBO-0001
  nombre: string;
  tipo: TipoProducto;
  precioBase: number;
  precioFinal: number;
  informacionAdicional: string;
  descuentoTotal?: number;
  componentes?: ProductoDTO[];
  imagenUrl?: string; // URL de la imagen del producto
}

export interface ComboRequest {
  nombre: string;
  productosIds: number[]; // Ahora solo números
}
