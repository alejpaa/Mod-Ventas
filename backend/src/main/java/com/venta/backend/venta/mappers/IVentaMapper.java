package com.venta.backend.venta.mappers;

import com.venta.backend.venta.dto.response.LineaCarritoResponse;
import com.venta.backend.venta.dto.response.VentaResumenResponse;
import com.venta.backend.venta.dto.response.VentaListadoResponse;
import com.venta.backend.venta.entities.DetalleVenta;
import com.venta.backend.venta.entities.Venta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IVentaMapper {

    @Mapping(target = "ventaId", source = "id")
    @Mapping(target = "numVenta", source = "numVenta")
    @Mapping(target = "origen", source = "origenVenta")
    @Mapping(target = "items", source = "detalles")
    @Mapping(target = "idVendedor", source = "idVendedor")
    @Mapping(target = "nombreVendedor", ignore = true)
    @Mapping(target = "clienteId", source = "clienteId")
    @Mapping(target = "nombreCliente", ignore = true)
    @Mapping(target = "clienteDni", ignore = true)
    @Mapping(target = "clienteEmail", ignore = true)
    @Mapping(target = "clienteTelefono", ignore = true)
    VentaResumenResponse toResumen(Venta venta);


    @Mapping(target = "detalleId", source = "id")
    @Mapping(target = "itemProductoId", source = "idProducto")
    @Mapping(target = "nombreProducto", source = "nombreProducto")
    LineaCarritoResponse toLinea(DetalleVenta detalle);

    @Mapping(target = "nombreCliente", ignore = true)
    VentaListadoResponse toListado(Venta venta);
}

