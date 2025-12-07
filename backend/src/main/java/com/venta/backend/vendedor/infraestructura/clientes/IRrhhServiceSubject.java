package com.venta.backend.vendedor.infraestructura.clientes;

import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;

import java.util.Optional;

public interface IRrhhServiceSubject {

    /**
     * Busca un empleado activo en el sistema externo de RRHH por su DNI
     *
     * @param dni El DNI de 8 dígitos a buscar.
     * @return Un Optional que contiene el EmpleadoRRHHDTO si se encuentra,
     * o un Optional vacío si no existe (HU-11, Escenario 2).
     */
    Optional<EmpleadoRRHHDTO> getEmployeeByDni(String dni);
}
