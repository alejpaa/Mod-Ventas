export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
  stock?: number;
  activo: boolean;
}

// Datos simulados de productos
const MOCK_PRODUCTOS: Producto[] = [
  {
    id: 1,
    nombre: 'Laptop Dell Inspiron 15',
    descripcion: 'Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD',
    precio: 2500.0,
    categoria: 'Computadoras',
    stock: 15,
    activo: true,
  },
  {
    id: 2,
    nombre: 'Mouse Logitech MX Master 3',
    descripcion: 'Mouse inalámbrico ergonómico de alta precisión',
    precio: 120.0,
    categoria: 'Accesorios',
    stock: 50,
    activo: true,
  },
  {
    id: 3,
    nombre: 'Teclado Mecánico Keychron K2',
    descripcion: 'Teclado mecánico inalámbrico con switches Gateron',
    precio: 180.0,
    categoria: 'Accesorios',
    stock: 30,
    activo: true,
  },
  {
    id: 4,
    nombre: 'Monitor LG UltraWide 34"',
    descripcion: 'Monitor ultrawide 34 pulgadas, resolución 3440x1440',
    precio: 1800.0,
    categoria: 'Monitores',
    stock: 8,
    activo: true,
  },
  {
    id: 5,
    nombre: 'Webcam Logitech C920',
    descripcion: 'Cámara web Full HD 1080p con micrófono estéreo',
    precio: 150.0,
    categoria: 'Accesorios',
    stock: 25,
    activo: true,
  },
  {
    id: 6,
    nombre: 'Auriculares Sony WH-1000XM4',
    descripcion: 'Auriculares inalámbricos con cancelación de ruido',
    precio: 450.0,
    categoria: 'Audio',
    stock: 12,
    activo: true,
  },
  {
    id: 7,
    nombre: 'SSD Samsung 970 EVO 1TB',
    descripcion: 'Disco sólido NVMe M.2 de alta velocidad',
    precio: 280.0,
    categoria: 'Almacenamiento',
    stock: 40,
    activo: true,
  },
  {
    id: 8,
    nombre: 'Impresora HP LaserJet Pro',
    descripcion: 'Impresora láser monocromática con WiFi',
    precio: 650.0,
    categoria: 'Impresoras',
    stock: 6,
    activo: true,
  },
  {
    id: 9,
    nombre: 'Router TP-Link AX3000',
    descripcion: 'Router WiFi 6 de doble banda',
    precio: 220.0,
    categoria: 'Redes',
    stock: 18,
    activo: true,
  },
  {
    id: 10,
    nombre: 'Disco Duro Externo WD 2TB',
    descripcion: 'Disco duro portátil USB 3.0',
    precio: 180.0,
    categoria: 'Almacenamiento',
    stock: 35,
    activo: true,
  },
];

export const productoService = {
  /**
   * Listar productos activos (datos simulados)
   */
  async listarProductosActivos(): Promise<Producto[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PRODUCTOS.filter((p) => p.activo);
  },

  /**
   * Obtener producto por ID (datos simulados)
   */
  async obtenerProducto(id: number): Promise<Producto | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_PRODUCTOS.find((p) => p.id === id);
  },

  /**
   * Buscar productos por nombre (datos simulados)
   */
  async buscarProductos(query: string): Promise<Producto[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTOS.filter(
      (p) =>
        p.activo &&
        (p.nombre.toLowerCase().includes(lowerQuery) ||
          p.descripcion?.toLowerCase().includes(lowerQuery) ||
          p.categoria?.toLowerCase().includes(lowerQuery))
    );
  },
};
