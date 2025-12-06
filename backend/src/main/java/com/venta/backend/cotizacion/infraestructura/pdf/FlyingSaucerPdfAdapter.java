package com.venta.backend.cotizacion.infraestructura.pdf;

import com.lowagie.text.DocumentException;
import org.springframework.stereotype.Component;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Flying Saucer implementation of the PDF generator adapter.
 * Converts HTML to PDF using the Flying Saucer library.
 */
@Component
public class FlyingSaucerPdfAdapter implements IPdfGenerator {

    @Override
    public byte[] generatePdf(String htmlContent) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            
            // Set the HTML content
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            
            // Generate PDF
            renderer.createPDF(outputStream);
            
            return outputStream.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }
}
