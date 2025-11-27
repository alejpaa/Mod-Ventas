package com.venta.backend.vendedor.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendedorResponse {

    private Long sellerId;
    private String dni;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;

    private String sellerType;
    private String sellerStatus;

    private LocalDate registrationDate;

    private Long sellerBranchId;
    private String sellerBranchName;

    private Long employeeRrhhId;
    private String ruc;
    private String bankAccount;
    private String bankName;
    private String documentType;
    private Long warehouseRefId;
}
