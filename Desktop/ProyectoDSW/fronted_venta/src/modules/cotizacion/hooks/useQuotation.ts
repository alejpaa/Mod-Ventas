import { useState } from 'react';
import type { Quotation, QuotationItem } from '../types/quotation.types';
import { QuotationStatus } from '../types/quotation.types';

// Mock Data
const mockQuotations: Quotation[] = [
  {
    id: 'COT-001',
    clientName: 'Empresa ABC S.A.C.',
    date: '2023-10-25',
    expirationDate: '2023-11-25',
    status: QuotationStatus.Sent,
    items: [
      {
        id: '1',
        description: 'Servicio de Internet Fibra Óptica 200Mbps',
        quantity: 1,
        unitPrice: 150,
        total: 150,
      },
      {
        id: '2',
        description: 'Instalación y Configuración',
        quantity: 1,
        unitPrice: 100,
        total: 100,
      },
    ],
    subtotal: 250,
    tax: 45,
    total: 295,
  },
  {
    id: 'COT-002',
    clientName: 'Juan Pérez',
    date: '2023-10-28',
    expirationDate: '2023-11-10',
    status: QuotationStatus.Draft,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  {
    id: 'COT-003',
    clientName: 'Tech Solutions EIRL',
    date: '2023-10-20',
    expirationDate: '2023-10-30',
    status: QuotationStatus.Accepted,
    items: [
      {
        id: '1',
        description: 'Plan Móvil Corporativo Ilimitado',
        quantity: 5,
        unitPrice: 80,
        total: 400,
      },
    ],
    subtotal: 400,
    tax: 72,
    total: 472,
  },
];

export const mockProducts = [
  { id: 'P001', name: 'Internet Fibra Óptica 100Mbps', price: 90 },
  { id: 'P002', name: 'Internet Fibra Óptica 200Mbps', price: 150 },
  { id: 'P003', name: 'Plan Móvil Ilimitado', price: 65 },
  { id: 'P004', name: 'Plan Móvil Corporativo', price: 80 },
  { id: 'S001', name: 'Instalación Estándar', price: 50 },
  { id: 'S002', name: 'Instalación Premium', price: 100 },
];

export function useQuotation() {
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Create Form State
  const [newClientName, setNewClientName] = useState('');
  const [newItems, setNewItems] = useState<QuotationItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  // Filtered Quotations
  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Actions
  const handleCreateQuotation = () => {
    setViewMode('CREATE');
    setNewClientName('');
    setNewItems([]);
  };

  const handleAddItem = () => {
    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: product.name,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
    };

    setNewItems([...newItems, newItem]);
    setSelectedProduct('');
  };

  const handleRemoveItem = (id: string) => {
    setNewItems(newItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setNewItems(
      newItems.map((item) =>
        item.id === id ? { ...item, quantity, total: item.unitPrice * quantity } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18; // 18% IGV
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSaveQuotation = () => {
    if (!newClientName) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }
    if (newItems.length === 0) {
      alert('Por favor agregue al menos un ítem');
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    const newQuotation: Quotation = {
      id: `COT-${(quotations.length + 1).toString().padStart(3, '0')}`,
      clientName: newClientName,
      date: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +15 days
      status: QuotationStatus.Draft,
      items: newItems,
      subtotal,
      tax,
      total,
    };

    setQuotations([newQuotation, ...quotations]);
    setViewMode('LIST');
    alert('Cotización guardada exitosamente como Borrador');
  };

  const handleGeneratePDF = (id: string) => {
    alert(`Generando PDF para la cotización ${id}... (Simulación)`);
  };

  const handleSendEmail = (id: string) => {
    alert(`Enviando cotización ${id} por correo... (Simulación)`);
    // Update status to Sent if it was Draft
    setQuotations(
      quotations.map((q) =>
        q.id === id && q.status === QuotationStatus.Draft
          ? { ...q, status: QuotationStatus.Sent }
          : q
      )
    );
  };

  const handleAcceptQuotation = (id: string) => {
    if (confirm('¿Está seguro de marcar esta cotización como ACEPTADA?')) {
      setQuotations(
        quotations.map((q) => (q.id === id ? { ...q, status: QuotationStatus.Accepted } : q))
      );
    }
  };

  const handleConvertToSale = (id: string) => {
    alert(`Redirigiendo a generar venta para la cotización ${id}...`);
  };

  return {
    viewMode,
    setViewMode,
    quotations,
    filteredQuotations,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    newClientName,
    setNewClientName,
    newItems,
    selectedProduct,
    setSelectedProduct,
    handleCreateQuotation,
    handleAddItem,
    handleRemoveItem,
    handleUpdateQuantity,
    calculateTotals,
    handleSaveQuotation,
    handleGeneratePDF,
    handleSendEmail,
    handleAcceptQuotation,
    handleConvertToSale,
  };
}
