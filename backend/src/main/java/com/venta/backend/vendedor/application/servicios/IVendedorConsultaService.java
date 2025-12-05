package com.venta.backend.vendedor.application.servicios;

import com.venta.backend.vendedor.application.dto.response.VendedorResponse;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.enums.SellerType;
import com.venta.backend.vendedor.infraestructura.clientes.dto.EmpleadoRRHHDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IVendedorConsultaService {

    /**
     * Busca un vendedor específico por su ID.
     *
     * @param sellerId El ID del vendedor.
     * @return Un VendedorResponse con los datos del vendedor.
     */
    VendedorResponse findSellerById(Long sellerId);

    /**
     * Busca un vendedor específico por su DNI.
     *
     * @param dni El DNI del vendedor.
     * @return Un VendedorResponse con los datos del vendedor.
     */
    VendedorResponse findSellerByDni(String dni);

    // No entiendo esto xd
    /**
     * Lista todos los vendedores con filtros dinámicos y paginación.
     *
     * @param sellerType (Filtro) Tipo de vendedor (INTERNAL, EXTERNAL).
     * @param sellerStatus (Filtro) Estado del vendedor (ACTIVE, INACTIVE).
     * @param sellerBranchId (Filtro) ID de la sede.
     * @param dni (Filtro) DNI del vendedor.
     * @param pageable (Paginación) Objeto que contiene el número de página y tamaño.
     * @return Un objeto Page que contiene la lista de VendedorResponse y la info de paginación.
     */
    Page<VendedorResponse> searchSellers(
            SellerType sellerType,
            SellerStatus sellerStatus,
            Long sellerBranchId,
            String dni,
            Pageable pageable
    );

    /**
     * Obtiene una lista simple de todos los vendedores activos.
     * (Útil para otros módulos, como Ventas, que necesitan un dropdown de vendedores)
     *
     * @return Lista de VendedorResponse activos.
     */
    List<VendedorResponse> listActiveSellers();

    /**
     * Busca el VendedorResponse local por su ID de empleado de RRHH.
     * (Usado por módulos externos para obtener el sellerId local para transacciones).
     *
     * @param employeeRrhhId El ID del empleado de RRHH.
     * @return El VendedorResponse (contiene el sellerId, que es la llave de la tabla Venta).
     */
    VendedorResponse findSellerByEmployeeRrhhId(Long employeeRrhhId);


    /**
     * Busca y devuelve los datos de un empleado de RRHH por DNI.
     * (Usado por el frontend para autocompletar el formulario de registro interno).
     *
     * @param dni DNI del empleado.
     * @return DTO con los datos del empleado.
     */
    EmpleadoRRHHDTO fetchRrhhEmployee(String dni);
}
