package com.venta.backend.cliente.application.servicios;

import com.venta.backend.cliente.application.dto.response.ClienteResponse;
import com.venta.backend.cliente.application.dto.response.ClienteVentaDTO;
import com.venta.backend.cliente.application.dto.response.HistorialComprasResponse;
import com.venta.backend.cliente.application.dto.response.PageClienteResponse;
import com.venta.backend.cliente.application.dto.response.PageMarketingClienteResponse;
import com.venta.backend.cliente.enums.EstadoClienteEnum;
import org.springframework.data.domain.Pageable;

/**
 * Interfaz para servicios de consulta de clientes.
 * Define operaciones de búsqueda y consulta de información de clientes.
 */
public interface IClienteConsultaServicio {

    /**
     * Busca clientes con filtros dinámicos y paginación.
     *
     * @param filtro Filtro de búsqueda general (puede ser nombre, DNI, etc.).
     * @param estado Estado del cliente para filtrar.
     * @param pageable Objeto que contiene el número de página y tamaño.
     * @return Un objeto PageClienteResponse que contiene la lista de clientes y la info de paginación.
     */
    PageClienteResponse filtrarClientes(String filtro, EstadoClienteEnum estado, Pageable pageable);

    /**
     * Obtiene el historial financiero y transacciones de un cliente.
     *
     * @param clienteId El ID del cliente.
     * @return Un HistorialComprasResponse con el detalle financiero del cliente.
     */
    HistorialComprasResponse obtenerHistorial(Long clienteId);

    /**
     * Obtiene datos segmentados para el módulo de Marketing.
     * Incluye información RFM (Recency, Frequency, Monetary) y datos demográficos.
     *
     * @param pageable Objeto que contiene el número de página y tamaño.
     * @return Un PageMarketingClienteResponse con clientes y sus datos analíticos para marketing.
     */
    PageMarketingClienteResponse obtenerDatosParaMarketing(Pageable pageable);

    /**
     * Busca un cliente por DNI para realizar una venta.
     * Devuelve datos operativos necesarios para el proceso de venta y flag de deuda.
     *
     * @param dni El DNI del cliente a buscar.
     * @return Un ClienteVentaDTO con los datos operativos y flag de deuda del cliente.
     */
    ClienteVentaDTO buscarClienteParaVenta(String dni);

    /**
     * Obtiene un cliente por su ID.
     * Devuelve la información completa del cliente.
     *
     * @param clienteId El ID del cliente a buscar.
     * @return Un ClienteResponse con los datos del cliente.
     */
    ClienteResponse obtenerClientePorId(Long clienteId);

    /**
     * Obtiene un cliente por su DNI.
     * Devuelve la información completa del cliente.
     *
     * @param dni El DNI del cliente a buscar.
     * @return Un ClienteResponse con los datos del cliente.
     */
    ClienteResponse obtenerClientePorDni(String dni);
}


