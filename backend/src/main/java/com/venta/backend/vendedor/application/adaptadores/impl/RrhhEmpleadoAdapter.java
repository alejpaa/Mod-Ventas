package com.venta.backend.vendedor.application.adaptadores.impl;

import com.venta.backend.vendedor.application.adaptadores.IEmpleadoAdapter;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.enums.DocumentType;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class RrhhEmpleadoAdapter implements IEmpleadoAdapter {
    @Override
    public Vendedor adaptar(EmpleadoRRHHDTO empleadoDTO) {

        String lastName = empleadoDTO.getApellidoPaterno() + " " + empleadoDTO.getApellidoMaterno();

        return Vendedor.builder()
                // Mapeo de campos
                .dni(empleadoDTO.getDocumentoIdentidad())
                .firstName(empleadoDTO.getNombres())
                .lastName(lastName)
                .email(empleadoDTO.getEmail())
                .phoneNumber(empleadoDTO.getTelefono())
                .address(empleadoDTO.getDireccion())

                // Asignaciones internas por defecto
                .sellerStatus(SellerStatus.ACTIVE)
                .registrationDate(LocalDate.now())

                // Mapeo del ID de Referencia
                .employeeRrhhId(empleadoDTO.getIdEmpleado())

                .documentType(DocumentType.DNI)
                .build();
    }
}
