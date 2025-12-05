package com.venta.backend.vendedor.application.impl;

import com.venta.backend.vendedor.application.adaptadores.IAdaptadorEmpleado;
import com.venta.backend.vendedor.application.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategia;
import com.venta.backend.vendedor.application.exceptions.RecursoNoEncontradoException;
import com.venta.backend.vendedor.application.exceptions.RegistroVendedorException;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.infraestructura.clientes.IClienteRRHH;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Para agregar las dependencias
public class RegistroInternoStrategiaImpl implements IRegistroVendedorStrategia {

    private final VendedorRepositorio vendedorRepositorio;
    private final IClienteRRHH clienteRRHH;
    private final IAdaptadorEmpleado adaptadorEmpleado;

    @Override
    public void validateData(RegistroVendedorRequest request) {
        // Empleado ya está registrado como Vendedor"
        if (vendedorRepositorio.existsByDni(request.getDni())) {
            throw new RegistroVendedorException("El DNI ya se encuentra registrado como vendedor.");
        }
    }

    @Override
    public Vendedor createSellerEntity(RegistroVendedorRequest request) {

        String dniToSearch = request.getDni();
        EmpleadoRRHHDTO empleadoRRHH = clienteRRHH.getEmployeeByDni(dniToSearch)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Empleado no encontrado en RRHH. Verifique el DNI."
                ));

        Vendedor newVendedor = adaptadorEmpleado.adaptar(empleadoRRHH);

        newVendedor.setSellerType(request.getSellerType());
        newVendedor.setBankAccount(request.getBankAccount());
        newVendedor.setBankName(request.getBankName());

        return newVendedor;
    }
}
