package com.venta.backend.vendedor.application.dto.request;

import com.venta.backend.vendedor.enums.DocumentType;
import com.venta.backend.vendedor.enums.SellerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Getters, Setters, etc.
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroVendedorRequest { // ¡Clase en Español!

    // --- Datos de RRHH (si es INTERNO) o manuales (si es EXTERNO) ---
    private String dni;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;

    // Le dice a la lógica qué estrategia usar
    private SellerType sellerType;

    // El ID de la sede a la que será asignado
    private Long sellerBranchId;

    /**
     * RUC (solo para vendedores externos que son personas jurídicas)
     */
    private String ruc;

    /**
     * Cuenta bancaria para comisiones
     */
    private String bankAccount;

    /**
     * Nombre del banco
     */
    private String bankName;

    /**
     * Tipo de documento (DNI por defecto)
     */
    private DocumentType documentType;
}
