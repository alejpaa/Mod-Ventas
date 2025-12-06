package com.venta.backend.vendedor.impl;

import com.venta.backend.vendedor.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.strategies.IRegistroVendedorStrategy;
import com.venta.backend.vendedor.exceptions.RegistroVendedorException;
import com.venta.backend.vendedor.services.ISellerOnboardingService;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.enums.DocumentType;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.entities.Vendedor;

import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RegistroExternoStrategyImpl implements IRegistroVendedorStrategy {

    // Inyección de dependencias (el constructor lo pone Lombok)
    private final VendedorRepositorio vendedorRepositorio;
    private final ISellerOnboardingService sellerOnboardingService;

    @Override
    public void validateData(RegistroVendedorRequest request, Sede sedeAsignada) {
        if (request.getDni() == null || request.getDni().isBlank()) {
            throw new RegistroVendedorException("El campo DNI es obligatorio.");
        }
        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new RegistroVendedorException("El campo Nombre es obligatorio.");
        }
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new RegistroVendedorException("El campo Apellido es obligatorio.");
        }

        if (vendedorRepositorio.existsByDni(request.getDni())) {
            throw new RegistroVendedorException("El DNI ya se encuentra registrado.");
        }

        if (request.getRuc() != null && !request.getRuc().isBlank() && vendedorRepositorio.existsByRuc(request.getRuc())) {
            throw new RegistroVendedorException("El RUC ya se encuentra registrado.");
        }
    }

    @Override
    public Vendedor createSellerEntity(RegistroVendedorRequest request) {
        Vendedor newVendeor = Vendedor.builder()
                .dni(request.getDni())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .sellerType(request.getSellerType())
                .sellerStatus(SellerStatus.ACTIVE)
                .registrationDate(LocalDate.now())
                .ruc(request.getRuc())
                .bankAccount(request.getBankAccount())
                .bankName(request.getBankName())
                .documentType(request.getDocumentType() != null ? request.getDocumentType() : DocumentType.DNI)
                .build();

        // OnboardingService se encargará de enviar el email de bienvenida
        sellerOnboardingService.onboardSeller(newVendeor);

        return newVendeor;
    }
}
