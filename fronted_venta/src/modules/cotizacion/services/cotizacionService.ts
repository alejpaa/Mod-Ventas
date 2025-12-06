import type {
  Quotation,
  CotizacionRequest,
  EnviarCotizacionRequest,
} from '../types/quotation.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const cotizacionService = {
  /**
   * List all quotations - USA LA API (with pagination)
   */
  async listarCotizaciones(): Promise<Quotation[]> {
    const response = await fetch(`${API_BASE_URL}/cotizaciones?page=0&size=100`);
    if (!response.ok) {
      throw new Error('Error al cargar las cotizaciones');
    }
    const paginatedResponse = await response.json();
    // Extract the content array from the paginated response
    return paginatedResponse.content || [];
  },

  /**
   * Create a new quotation - USA LA API
   */
  async crearCotizacion(request: CotizacionRequest): Promise<Quotation> {
    const response = await fetch(`${API_BASE_URL}/cotizaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al crear la cotización');
    }

    return response.json();
  },

  /**
   * Send quotation by email - USA LA API
   */
  async enviarCotizacion(request: EnviarCotizacionRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cotizaciones/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al enviar la cotización');
    }
  },

  /**
   * Accept a quotation - USA LA API
   * Endpoint: POST /api/cotizaciones/{id}/aceptacion
   */
  async aceptarCotizacion(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cotizaciones/${id}/aceptacion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty body as per AceptacionCotizacionRequest
    });

    if (!response.ok) {
      throw new Error('Error al aceptar la cotización');
    }
  },

  /**
   * Download quotation PDF - USA LA API
   * Endpoint: GET /api/cotizaciones/{id}/pdf
   */
  async descargarPdf(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cotizaciones/${id}/pdf`);

    if (!response.ok) {
      throw new Error('Error al descargar el PDF');
    }

    // Create blob from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotizacion_${id}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
