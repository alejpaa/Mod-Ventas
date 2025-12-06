import React from 'react';

interface SellerPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
}

const SellerPagination: React.FC<SellerPaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // No mostrar si solo hay una página

  // Lógica para generar los números de página a mostrar
  const pagesToShow: number[] = [];
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const PageButton = ({ page, label, disabled = false }: { page: number, label: string | number, disabled?: boolean }) => (
    <button
      onClick={() => onPageChange(page)}
      disabled={disabled}
      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
        page === currentPage
          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <PageButton page={currentPage - 1} label="Anterior" disabled={isFirstPage} />
        <PageButton page={currentPage + 1} label="Siguiente" disabled={isLastPage} />
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {/* Información de la página */}
        <div>
          <p className="text-sm text-gray-700">
            Mostrando
            <span className="font-medium ml-1">{(currentPage * 20) + 1}</span>
            a
            <span className="font-medium ml-1">
                {Math.min((currentPage + 1) * 20, totalElements)}
            </span>
            de
            <span className="font-medium ml-1">{totalElements}</span>
            resultados
          </p>
        </div>
        {/* Controles de paginación */}
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Botón Anterior */}
            <PageButton page={currentPage - 1} label="Anterior" disabled={isFirstPage} />

            {/* Botones de números de página */}
            {pagesToShow[0] > 0 && (
                <>
                    <PageButton page={0} label={1} />
                    {pagesToShow[0] > 1 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>}
                </>
            )}

            {pagesToShow.map(page => (
              <PageButton key={page} page={page} label={page + 1} />
            ))}

            {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
                <>
                    {pagesToShow[pagesToShow.length - 1] < totalPages - 2 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>}
                    <PageButton page={totalPages - 1} label={totalPages} />
                </>
            )}

            {/* Botón Siguiente */}
            <PageButton page={currentPage + 1} label="Siguiente" disabled={isLastPage} />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SellerPagination;
