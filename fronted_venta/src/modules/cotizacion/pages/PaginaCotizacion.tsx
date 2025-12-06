import { useQuotation } from '../hooks/useQuotation';
import { QuotationList } from '../components/QuotationList';
import { QuotationForm } from '../components/QuotationForm';
import { EmailDialog } from '../components/EmailDialog';
import { AcceptQuotationDialog } from '../components/AcceptQuotationDialog';

export function PaginaCotizacion() {
  const hookData = useQuotation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* --- SECCIÓN DE FILTROS --- */}
      {hookData.viewMode === 'LIST' && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {/* Fila 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
              <input
                type="text"
                name="cliente"
                placeholder="Buscar cliente..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => hookData.setSearchTerm(e.target.value)}
                value={hookData.searchTerm}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <select
                name="estado"
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => hookData.setStatusFilter(e.target.value)}
                value={hookData.statusFilter}
              >
                <option value="">Todos</option>
                <option value="BORRADOR">Borrador</option>
                <option value="ENVIADA">Enviada</option>
                <option value="ACEPTADA">Aceptada</option>
                <option value="RECHAZADA">Rechazada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Fila 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID Cotización</label>
              <input
                type="text"
                name="id"
                placeholder="ID Cotización..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vendedor</label>
              <input
                type="text"
                name="vendedor"
                placeholder="Vendedor..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <div className="flex items-end justify-end gap-3">
              <button
                onClick={hookData.handleCreateQuotation}
                disabled={hookData.isSubmitting}
                className="h-10 px-4 py-2 bg-[#3C83F6] text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm whitespace-nowrap cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="mr-2 text-lg">+</span> Nueva Cotización
              </button>
            </div>
          </div>
        </div>
      )}

      {hookData.viewMode === 'LIST' && <hr className="border-gray-200 mb-6" />}

      {/* Error Display */}
      {hookData.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{hookData.error}</p>
          <button
            onClick={() => hookData.setError(null)}
            className="text-red-600 hover:text-red-800 text-sm mt-2 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main Content */}
      {hookData.viewMode === 'LIST' ? (
        <QuotationList
          quotations={hookData.filteredQuotations}
          searchTerm={hookData.searchTerm}
          onSearchChange={hookData.setSearchTerm}
          statusFilter={hookData.statusFilter}
          onFilterChange={hookData.setStatusFilter}
          onDownloadPdf={hookData.handleDownloadPdf}
          onSendEmail={hookData.handleOpenEmailDialog}
          onOpenAcceptDialog={hookData.handleOpenAcceptDialog}
          onConvertToSale={hookData.handleConvertToSale}
          isLoading={hookData.isLoading}
        />
      ) : (
        <QuotationForm
          formData={hookData.formData}
          onFormDataChange={hookData.setFormData}
          clientes={hookData.clientes}
          vendedores={hookData.vendedores}
          productos={hookData.productos}
          selectedProduct={hookData.selectedProduct}
          onSelectedProductChange={hookData.setSelectedProduct}
          onAddItem={hookData.handleAddItem}
          onRemoveItem={hookData.handleRemoveItem}
          onUpdateQuantity={hookData.handleUpdateQuantity}
          totals={hookData.calculateTotals()}
          onSave={hookData.handleSaveQuotation}
          onCancel={() => hookData.setViewMode('LIST')}
          isSubmitting={hookData.isSubmitting}
          error={hookData.error}
          catalogModalOpen={hookData.catalogModalOpen}
          onOpenCatalog={() => hookData.setCatalogModalOpen(true)}
          onCloseCatalog={() => hookData.setCatalogModalOpen(false)}
          onAddProductFromCatalog={hookData.handleAddProductFromCatalog}
        />
      )}

      {/* Email Dialog */}
      <EmailDialog
        isOpen={hookData.emailDialogOpen}
        quotationNumber={hookData.selectedQuotationForEmail?.numCotizacion || ''}
        onClose={() => hookData.setEmailDialogOpen(false)}
        onSend={hookData.handleSendEmail}
        isLoading={hookData.isSendingEmail}
      />

      {/* Accept Quotation Dialog */}
      <AcceptQuotationDialog
        isOpen={hookData.acceptDialogOpen}
        quotationNumber={hookData.selectedQuotationForAccept?.numCotizacion || ''}
        onConfirm={() => hookData.handleAcceptQuotation(hookData.selectedQuotationForAccept!.id)}
        onCancel={() => hookData.setAcceptDialogOpen(false)}
        isLoading={hookData.isAccepting}
      />
    </div>
  );
}
