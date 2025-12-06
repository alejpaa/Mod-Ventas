import { type SellerToolbarProps } from '../types/seller.types';
import { Package } from 'lucide-react';

/**
 * Propiedades extendidas para el Toolbar que incluye la lógica de filtrado.
 * Se asume que SellerToolbarProps base tiene onNewSellerClick y onCreateComboClick.
 */
interface SellerToolbarPropsWithFilter extends SellerToolbarProps {
  // Propiedad requerida por la PaginaVendedor para manejar el estado de los filtros
  onFilterChange: (name: string, value: string) => void; // Propiedades que se usan en el componente pero podrían faltar en la base si fue un error de conflicto
  onCreateComboClick?: () => void;
  isAdmin?: boolean;
}

const SellerToolbar = ({
  onNewSellerClick,
  onCreateComboClick,
  isAdmin = false, // Se establece un valor por defecto
  onFilterChange,
}: SellerToolbarPropsWithFilter) => (
  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
        {/* Barra de Búsqueda */}   {' '}
    <div className="w-full md:w-1/3">
           {' '}
      <input
        type="text"
        placeholder="Buscar por DNI..." // 2. Notificamos el cambio del filtro 'dni'
        onChange={(e) => onFilterChange('dni', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
         {' '}
    </div>
        {/* Filtros y Botones */}   {' '}
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Filtro Tipo de Vendedor */}     {' '}
      <select // 3. Notificamos el cambio del filtro 'sellerType'
        onChange={(e) => onFilterChange('sellerType', e.target.value)}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
      >
                <option value="">Todo Tipo</option>        <option value="INTERNAL">Interno</option>
                <option value="EXTERNAL">Externo</option>     {' '}
      </select>
            {/* Filtro Estado del Vendedor */}     {' '}
      <select // 4. Notificamos el cambio del filtro 'sellerStatus'
        onChange={(e) => onFilterChange('sellerStatus', e.target.value)}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
      >
                <option value="">Todo Estado</option>        <option value="ACTIVE">Activo</option> 
              <option value="INACTIVE">Inactivo</option>     {' '}
      </select>
            {/* Botón Crear Combo - Solo para Administradores */}     {' '}
      {isAdmin && onCreateComboClick && (
        <button
          onClick={onCreateComboClick}
          className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300 flex items-center gap-2"
        >
                    <Package size={18} />          Crear Combo        {' '}
        </button>
      )}
            {/* Botón Crear Vendedor */}     {' '}
      <button
        onClick={onNewSellerClick}
        className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
                Nuevo Vendedor      {' '}
      </button>
         {' '}
    </div>
     {' '}
  </div>
);

export default SellerToolbar;
