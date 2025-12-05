package com.venta.backend.vendedor.application.adaptadores.impl;

import com.venta.backend.vendedor.application.adaptadores.IAdaptadorEmpleado;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.enums.DocumentType;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RRHHAdaptadorImpl implements IAdaptadorEmpleado {
    @Override
    public Vendedor adaptar(EmpleadoRRHHDTO empleadoDTO) {
        return Vendedor.builder()
                .dni(empleadoDTO.getDni())
                .firstName(empleadoDTO.getFirstName())
                .lastName(empleadoDTO.getLastName())
                .email(empleadoDTO.getEmail())
                .phoneNumber(empleadoDTO.getPhoneNumber())
                .address(empleadoDTO.getAddress())
                // Asignaciones internas por defecto al adaptarse de RRHH:
                .sellerStatus(SellerStatus.ACTIVE)
                .registrationDate(LocalDate.now())
                .employeeRrhhId(empleadoDTO.getEmployeeId())
                .documentType(DocumentType.DNI)
                // Nota: sellerType y sellerBranch se asignan en la estrategia/servicio principal
                .build();
    }
}
