import { QuoteIcon } from '../../../components/Icons';
import { useQuotation } from '../hooks/useQuotation';
import { QuotationList } from '../components/QuotationList';
import { QuotationForm } from '../components/QuotationForm';

export function PaginaCotizacion() {
  // Re-filtering here or inside the hook.
  // Since the hook returns filteredQuotations, we should use it.
  // But wait, I didn't export filteredQuotations in the hook?
  // Let me check the hook content I wrote.
  // Yes, I did export filteredQuotations.

  // Re-accessing the hook return values to make sure I have everything.
  const hookData = useQuotation();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
            <p className="text-gray-600 mt-1">
              Crea, envía y gestiona las cotizaciones de tus clientes
            </p>
          </div>
          {hookData.viewMode === 'LIST' && (
            <button
              onClick={hookData.handleCreateQuotation}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all"
            >
              <QuoteIcon size={20} />
              Nueva Cotización
            </button>
          )}
        </div>

        {hookData.viewMode === 'LIST' ? (
          <QuotationList
            quotations={hookData.filteredQuotations}
            searchTerm={hookData.searchTerm}
            onSearchChange={hookData.setSearchTerm}
            statusFilter={hookData.statusFilter}
            onFilterChange={hookData.setStatusFilter}
            onGeneratePDF={hookData.handleGeneratePDF}
            onSendEmail={hookData.handleSendEmail}
            onAccept={hookData.handleAcceptQuotation}
            onConvertToSale={hookData.handleConvertToSale}
          />
        ) : (
          <QuotationForm
            newClientName={hookData.newClientName}
            onClientNameChange={hookData.setNewClientName}
            newItems={hookData.newItems}
            selectedProduct={hookData.selectedProduct}
            onSelectedProductChange={hookData.setSelectedProduct}
            onAddItem={hookData.handleAddItem}
            onRemoveItem={hookData.handleRemoveItem}
            onUpdateQuantity={hookData.handleUpdateQuantity}
            totals={hookData.calculateTotals()}
            onSave={hookData.handleSaveQuotation}
            onCancel={() => hookData.setViewMode('LIST')}
          />
        )}
      </div>
    </div>
  );
}
