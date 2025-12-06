package com.venta.backend.cotizacion.infraestructura.pdf;

/**
 * Adapter interface for PDF generation.
 * This allows different PDF generation implementations to be used interchangeably.
 */
public interface IPdfGenerator {
    
    /**
     * Generates a PDF from HTML content.
     * 
     * @param htmlContent The HTML content to convert to PDF
     * @return PDF as byte array
     * @throws RuntimeException if PDF generation fails
     */
    byte[] generatePdf(String htmlContent);
}
