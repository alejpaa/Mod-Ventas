package com.venta.backend.vendedor.application.impl;

import com.venta.backend.vendedor.application.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategia;
import com.venta.backend.vendedor.application.exceptions.RegistroVendedorException;
import com.venta.backend.vendedor.enums.DocumentType;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.entities.Vendedor;

import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RegistroExternoStrategiaImpl implements IRegistroVendedorStrategia {

    // Inyección de dependencias (el constructor lo pone Lombok)
    private final VendedorRepositorio vendedorRepositorio;

    @Override
    public void validateData(RegistroVendedorRequest request) {
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

        if (request.getRuc() != null && !request.getRuc().isBlank()) {
            // Podrías agregar un método en el repo: existsByRuc
            // if (vendedorRepositorio.existsByRuc(request.getRuc())) {
            //     throw new RegistroVendedorException("El RUC ya se encuentra registrado.");
            // }
        }
    }

    @Override
    public Vendedor createSellerEntity(RegistroVendedorRequest request) {
        return Vendedor.builder()
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
    }
}
