import { SellerType, type SellerToolbarProps } from "../types/seller.types";

interface SellerToolbarPropsWithFilter extends SellerToolbarProps {
    onFilterChange: (name: string, value: string) => void;
}

const SellerToolbar = ({onNewSellerClick, onFilterChange} : SellerToolbarPropsWithFilter) => (
  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
    {/* Barra de Búsqueda */}
    <div className="w-full md:w-1/3">
      <input
        type="text"
        placeholder="Buscar por DNI..."
        // 2. Notificamos el cambio del filtro 'dni'
        onChange={(e) => onFilterChange('dni', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Filtros y Botón */}
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">

      {/* Filtro Tipo de Vendedor */}
      <select
        // 3. Notificamos el cambio del filtro 'sellerType'
        onChange={(e) => onFilterChange('sellerType', e.target.value)}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none">
        <option value="">Todo Tipo</option>
        <option value="INTERNAL">Interno</option>
        <option value="EXTERNAL">Externo</option>
      </select>

      {/* Filtro Estado del Vendedor */}
      <select
        // 4. Notificamos el cambio del filtro 'sellerStatus'
        onChange={(e) => onFilterChange('sellerStatus', e.target.value)}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none">
        <option value="">Todo Estado</option>
        <option value="ACTIVE">Activo</option>
        <option value="INACTIVE">Inactivo</option>
      </select>

      {/* Botón Crear Vendedor */}
      <button
        onClick={onNewSellerClick}
        className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Nuevo Vendedor
      </button>
    </div>
  </div>
);


export default SellerToolbar;
