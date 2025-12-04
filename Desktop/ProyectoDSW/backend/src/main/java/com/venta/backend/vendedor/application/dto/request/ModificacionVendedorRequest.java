package com.venta.backend.vendedor.application.dto.request;

import com.venta.backend.vendedor.enums.SellerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModificacionVendedorRequest {

    // --- Datos editables por un Vendedor EXTERNO ---
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;

    // --- Datos editables por TODOS (Internos y Externos) ---

    // La nueva sede a la que será re-asignado
    private Long sellerBranchId;

    // El nuevo estado (para activar o reactivar)
    private SellerStatus sellerStatus;

    private String bankAccount;

    private String bankName;
}
