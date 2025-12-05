package com.venta.backend.vendedor.application.adaptadores;

import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;

public interface IAdaptadorEmpleado {
    /**
     * Adapta los datos de RRHH a una entidad Vendedor (parcial)
     * lista para el registro.
     *
     * @param empleadoDTO El DTO del sistema RRHH.
     * @return Una entidad Vendedor pre-construida con los datos básicos.
     */
    Vendedor adaptar(EmpleadoRRHHDTO empleadoDTO);
}
