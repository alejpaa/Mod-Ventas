package com.venta.backend.cliente.application.servicios;

import com.venta.backend.cliente.application.dto.request.CrearClienteSimpleRequest;
import com.venta.backend.cliente.application.dto.request.ModificacionClienteRequest;
import com.venta.backend.cliente.application.dto.request.RegistroClienteRequest;
import com.venta.backend.cliente.application.dto.response.ClienteIdResponse;
import com.venta.backend.cliente.application.dto.response.ClienteResponse;

/**
 * Interfaz para servicios de administración de clientes.
 * Define operaciones de creación, actualización y gestión de clientes.
 */
public interface IClienteAdminServicio {

    /**
     * Registra un nuevo cliente en el sistema.
     * Valida DNI y deudas antes de crear el cliente.
     *
     * @param request El DTO con toda la información del formulario de registro.
     * @return Un ClienteResponse con los datos del cliente creado.
     */
    ClienteResponse registrarCliente(RegistroClienteRequest request);

    /**
     * Actualiza la información de un cliente existente.
     * Permite modificar datos permitidos o cambiar el estado del cliente.
     *
     * @param clienteId El ID del cliente a actualizar.
     * @param request El DTO con los campos que se pueden modificar.
     * @return Un ClienteResponse con los datos actualizados.
     */
    ClienteResponse actualizarCliente(Long clienteId, ModificacionClienteRequest request);

    /**
     * Crea un cliente simplificado desde el módulo de Ventas.
     * Recibe datos básicos y devuelve solo el ID generado para uso inmediato en la venta.
     *
     * @param request El DTO con los datos básicos del cliente.
     * @return Un ClienteIdResponse con el ID del cliente creado.
     */
    ClienteIdResponse crearClienteSimple(CrearClienteSimpleRequest request);

    /**
     * Da de baja (desactiva) un cliente.
     * Valida que el cliente no tenga deudas ni equipos pendientes antes de dar de baja.
     *
     * @param clienteId El ID del cliente a dar de baja.
     */
    void darBajaCliente(Long clienteId);
}

