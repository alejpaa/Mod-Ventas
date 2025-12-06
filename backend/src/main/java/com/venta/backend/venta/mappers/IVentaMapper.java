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
    VentaResumenResponse toResumen(Venta venta);


    @Mapping(target = "detalleId", source = "id")
    @Mapping(target = "itemProductoId", source = "itemProducto.id")
    @Mapping(target = "nombreProducto", source = "itemProducto.nombre")
    LineaCarritoResponse toLinea(DetalleVenta detalle);

    VentaListadoResponse toListado(Venta venta);
}

