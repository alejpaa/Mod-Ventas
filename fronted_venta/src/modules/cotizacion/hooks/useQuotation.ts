import { useState, useEffect } from 'react';
import type {
  Quotation,
  QuotationItemFormData,
  QuotationFormData,
  CotizacionRequest,
} from '../types/quotation.types';
import { cotizacionService } from '../services/cotizacionService';
import { vendedorService, type VendedorResponse } from '../../vendedor/services/vendedorService';
import { clienteService, type Cliente } from '../../cliente/services/clienteService';
import { productoService, type Producto } from '../../producto/services/productoService';
import type { ApiError } from '../../../services/apiClient';

export function useQuotation() {
  // View State
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');

  // Data State
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<VendedorResponse[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Error States
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form State
  const [formData, setFormData] = useState<QuotationFormData>({
    clienteId: null,
    vendedorId: null,
    validezDias: 15,
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  // Email Dialog State
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedQuotationForEmail, setSelectedQuotationForEmail] = useState<Quotation | null>(
    null
  );

  // Product Catalog Modal State
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadQuotations();
    loadClientes();
    loadVendedores();
    loadProductos();
  }, []);

  const loadQuotations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cotizacionService.listarCotizaciones();
      setQuotations(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar las cotizaciones');
      console.error('Error loading quotations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await clienteService.listarClientes();
      setClientes(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      // Don't set main error state for background data loads
    }
  };

  const loadVendedores = async () => {
    try {
      const data = await vendedorService.listarVendedoresActivos();
      setVendedores(data);
    } catch (err) {
      console.error('Error loading sellers:', err);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await productoService.listarProductosActivos();
      setProductos(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  // Filtered Quotations
  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.numCotizacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || q.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Form Actions
  const handleCreateQuotation = () => {
    setViewMode('CREATE');
    setFormData({
      clienteId: null,
      vendedorId: null,
      validezDias: 15,
      items: [],
    });
    setSelectedProduct(null);
    setError(null);
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const product = productos.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newItem: QuotationItemFormData = {
      tempId: Date.now().toString(),
      productoId: product.id,
      productoNombre: product.nombre,
      cantidad: 1,
      precioUnitario: product.precio,
      subtotal: product.precio,
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
    setSelectedProduct(null);
  };

  const handleAddProductFromCatalog = (catalogProduct: {
    id: string;
    name: string;
    price: number;
  }) => {
    // Convert catalog product to quotation item
    const newItem: QuotationItemFormData = {
      tempId: Date.now().toString(),
      productoId: parseInt(catalogProduct.id.replace('PROD-', '')), // Convert PROD-XXX to number
      productoNombre: catalogProduct.name,
      cantidad: 1,
      precioUnitario: catalogProduct.price,
      subtotal: catalogProduct.price,
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });

    // Close the modal after adding
    setCatalogModalOpen(false);
  };

  const handleRemoveItem = (tempId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.tempId !== tempId),
    });
  };

  const handleUpdateQuantity = (tempId: string, cantidad: number) => {
    if (cantidad < 1) return;

    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.tempId === tempId
          ? { ...item, cantidad, subtotal: item.precioUnitario * cantidad }
          : item
      ),
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.18; // 18% IGV
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSaveQuotation = async () => {
    setError(null);

    // Validation
    if (!formData.clienteId) {
      setError('Por favor seleccione un cliente');
      return;
    }
    if (!formData.vendedorId) {
      setError('Por favor seleccione un vendedor');
      return;
    }
    if (formData.items.length === 0) {
      setError('Por favor agregue al menos un producto');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate validity date
      const vigencia = new Date();
      vigencia.setDate(vigencia.getDate() + formData.validezDias);
      const vigenciaStr = vigencia.toISOString().split('T')[0];

      const request: CotizacionRequest = {
        clienteId: formData.clienteId,
        vendedorId: formData.vendedorId,
        vigencia: vigenciaStr,
        items: formData.items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      };

      await cotizacionService.crearCotizacion(request);

      // Reload quotations and return to list view
      await loadQuotations();
      setViewMode('LIST');
      alert('Cotización creada exitosamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al crear la cotización');
      console.error('Error creating quotation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePDF = (id: number) => {
    // TODO: Implement PDF generation
    alert(`Generando PDF para la cotización #${id}... (Funcionalidad pendiente)`);
  };

  const handleOpenEmailDialog = (quotation: Quotation) => {
    setSelectedQuotationForEmail(quotation);
    setEmailDialogOpen(true);
  };

  const handleSendEmail = async (email: string) => {
    if (!selectedQuotationForEmail) return;

    setIsSendingEmail(true);
    setError(null);

    try {
      await cotizacionService.enviarCotizacion({
        cotizacionId: selectedQuotationForEmail.id,
        email,
      });

      // Reload quotations to get updated status
      await loadQuotations();

      setEmailDialogOpen(false);
      setSelectedQuotationForEmail(null);
      alert('Cotización enviada exitosamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al enviar la cotización');
      console.error('Error sending quotation:', err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleAcceptQuotation = async (id: number) => {
    if (!confirm('¿Está seguro de marcar esta cotización como ACEPTADA?')) {
      return;
    }

    setError(null);

    try {
      await cotizacionService.aceptarCotizacion(id);

      // Reload quotations to get updated status
      await loadQuotations();

      alert('Cotización aceptada exitosamente');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al aceptar la cotización');
      console.error('Error accepting quotation:', err);
    }
  };

  const handleConvertToSale = (id: number) => {
    // TODO: Implement conversion to sale
    alert(`Redirigiendo a generar venta para la cotización #${id}...`);
  };

  return {
    // View State
    viewMode,
    setViewMode,

    // Data
    quotations,
    filteredQuotations,
    clientes,
    vendedores,
    productos,

    // Loading States
    isLoading,
    isSubmitting,
    isSendingEmail,

    // Error State
    error,
    setError,

    // Filter State
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,

    // Form State
    formData,
    setFormData,
    selectedProduct,
    setSelectedProduct,

    // Email Dialog State
    emailDialogOpen,
    setEmailDialogOpen,
    selectedQuotationForEmail,

    // Catalog Modal State
    catalogModalOpen,
    setCatalogModalOpen,

    // Actions
    handleCreateQuotation,
    handleAddItem,
    handleAddProductFromCatalog,
    handleRemoveItem,
    handleUpdateQuantity,
    calculateTotals,
    handleSaveQuotation,
    handleGeneratePDF,
    handleOpenEmailDialog,
    handleSendEmail,
    handleAcceptQuotation,
    handleConvertToSale,
  };
}
