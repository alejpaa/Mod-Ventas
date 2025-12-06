import { useQuotation } from '../hooks/useQuotation';
import { QuotationList } from '../components/QuotationList';
import { QuotationForm } from '../components/QuotationForm';
import { QuotationDetail } from '../components/QuotationDetail';
import { EmailDialog } from '../components/EmailDialog';
import { AcceptQuotationDialog } from '../components/AcceptQuotationDialog';
import { ModalCrearCliente } from '../../clientes/components/ModalCrearCliente';

export function PaginaCotizacion() {
  const hookData = useQuotation();

  return (
    <div>
      {/* --- SECCIÓN DE FILTROS --- */}
      {hookData.viewMode === 'LIST' && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex items-end gap-3 flex-wrap">
            {/* Buscar Cliente */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Cliente</label>
              <input
                type="text"
                placeholder="Buscar cliente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => hookData.setSearchTerm(e.target.value)}
                value={hookData.searchTerm}
              />
            </div>

            {/* Estado */}
            <div className="w-48">
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Botón Nueva Cotización */}
            <button
              onClick={hookData.handleCreateQuotation}
              disabled={hookData.isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Nueva Cotización
            </button>
          </div>
        </div>
      )}

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
          onDownloadPdf={hookData.handleDownloadPdf}
          onSendEmail={hookData.handleOpenEmailDialog}
          onOpenAcceptDialog={hookData.handleOpenAcceptDialog}
          onConvertToSale={hookData.handleConvertToSale}
          onViewDetail={hookData.handleViewDetail}
          isLoading={hookData.isLoading}
          isConverting={hookData.isConverting}
        />
      ) : hookData.viewMode === 'DETAIL' ? (
        hookData.selectedQuotationDetail && (
          <QuotationDetail
            quotation={hookData.selectedQuotationDetail}
            clienteNombre={
              hookData.clientes.find((c) => c.id === hookData.selectedQuotationDetail?.idCliente)
                ?.nombre || 'Cliente no encontrado'
            }
            vendedorNombre={
              hookData.vendedores.find(
                (v) => v.sellerId.toString() === hookData.selectedQuotationDetail?.sellerCode
              )?.fullName || 'Vendedor no encontrado'
            }
            fechaExpiracion={hookData.selectedQuotationDetail.fechaCotizacion}
            onBack={hookData.handleBackToList}
            onDownloadPdf={hookData.handleDownloadPdf}
            onSendEmail={() =>
              hookData.handleOpenEmailDialog(
                hookData.quotations.find((q) => q.id === hookData.selectedQuotationDetail?.id)!
              )
            }
            onAccept={() =>
              hookData.handleOpenAcceptDialog(
                hookData.quotations.find((q) => q.id === hookData.selectedQuotationDetail?.id)!
              )
            }
            onConvertToSale={hookData.handleConvertToSale}
            isLoading={hookData.isLoadingDetail}
            isConverting={hookData.isConverting}
          />
        )
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
          onOpenCreateClient={() => hookData.setCreateClientModalOpen(true)}
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

      {/* Create Client Modal */}
      {hookData.createClientModalOpen && (
        <ModalCrearCliente
          onClose={() => hookData.setCreateClientModalOpen(false)}
          onSuccess={() => {
            // Reload clients list after creating new client
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
