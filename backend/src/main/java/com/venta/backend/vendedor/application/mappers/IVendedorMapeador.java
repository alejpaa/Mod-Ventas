package com.venta.backend.vendedor.application.mappers;

import com.venta.backend.vendedor.application.dto.response.VendedorResponse;
import com.venta.backend.vendedor.entities.Vendedor;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import java.util.List;

/**
 * Interfaz de Mapeo (traducción) entre la Entidad de Dominio (Vendedor)
 * y el DTO de Respuesta (VendedorResponse).
 * * Usamos MapStruct para generar la implementación.
 */
@Mapper(componentModel = "spring")
public interface IVendedorMapeador {

    IVendedorMapeador INSTANCE = Mappers.getMapper(IVendedorMapeador.class);

    /**
     * Convierte una entidad Vendedor a un DTO VendedorResponse.
     *
     * @param vendedor La entidad Vendedor desde la BD.
     * @return El DTO VendedorResponse para la API.
     */
    @Mapping(source = "sellerBranch.branchId", target = "sellerBranchId")
    @Mapping(source = "sellerBranch.name", target = "sellerBranchName")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "sellerBranch.warehouseRefId", target = "warehouseRefId")
    VendedorResponse toVendedorResponse(Vendedor vendedor);

    /**
     * Convierte una lista de entidades Vendedor a una lista de DTOs VendedorResponse.
     * MapStruct es lo suficientemente inteligente para saber que debe usar
     * el método de 'toVendedorResponse' para cada elemento de la lista.
     *
     * @param vendedores La lista de entidades Vendedor.
     * @return La lista de DTOs VendedorResponse.
     */
    List<VendedorResponse> toVendedorResponseList(List<Vendedor> vendedores);
}
