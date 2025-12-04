package com.venta.backend.cliente.application.mappers;

import com.venta.backend.cliente.application.dto.response.ClienteResponse;
import com.venta.backend.cliente.entities.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * Interfaz de Mapeo (traducción) entre la Entidad de Dominio (Cliente)
 * y los DTOs de Respuesta.
 * Usamos MapStruct para generar la implementación.
 */
@Mapper(componentModel = "spring")
public interface IClienteMapeador {

    IClienteMapeador INSTANCE = Mappers.getMapper(IClienteMapeador.class);

    /**
     * Convierte una entidad Cliente a un DTO ClienteResponse.
     *
     * @param cliente La entidad Cliente desde la BD.
     * @return El DTO ClienteResponse para la API.
     */
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "estado", target = "estado")
    ClienteResponse toClienteResponse(Cliente cliente);

    /**
     * Convierte una lista de entidades Cliente a una lista de DTOs ClienteResponse.
     *
     * @param clientes La lista de entidades Cliente.
     * @return La lista de DTOs ClienteResponse.
     */
    List<ClienteResponse> toClienteResponseList(List<Cliente> clientes);
}

