package com.venta.backend.cotizacion.mapper;

import com.venta.backend.cotizacion.dto.CotizacionItemRequest;
import com.venta.backend.cotizacion.dto.CotizacionItemResponse;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.DetalleCotizacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CotizacionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cotizacion", ignore = true)
    @Mapping(target = "itemProductoId", source = "productoId")
    DetalleCotizacion toEntity(CotizacionItemRequest request);

    @Mapping(target = "productoId", source = "itemProductoId")
    CotizacionItemResponse toDto(DetalleCotizacion item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "numCotizacion", ignore = true)
    @Mapping(target = "fechaCotizacion", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "estado", expression = "java(com.venta.backend.cotizacion.model.CotizacionEstado.BORRADOR)")
    @Mapping(target = "items", ignore = true)
    Cotizacion toEntity(CotizacionRequest request);

    @Mapping(target = "items", expression = "java(cotizacion.getItems().stream().map(this::toDto).toList())")
    CotizacionResponse toDto(Cotizacion cotizacion);
}


