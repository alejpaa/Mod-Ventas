package com.venta.backend.cotizacion.mapper;

import com.venta.backend.cotizacion.dto.CotizacionItemRequest;
import com.venta.backend.cotizacion.dto.CotizacionItemResponse;
import com.venta.backend.cotizacion.dto.CotizacionListResponse;
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
    @Mapping(target = "producto", ignore = true)
    DetalleCotizacion toEntity(CotizacionItemRequest request);

    @Mapping(target = "productoId", source = "producto.id")
    CotizacionItemResponse toDto(DetalleCotizacion item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "numCotizacion", ignore = true)
    @Mapping(target = "fechaCotizacion", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "estado", expression = "java(com.venta.backend.cotizacion.model.CotizacionEstado.BORRADOR)")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "vendedor", ignore = true)
    Cotizacion toEntity(CotizacionRequest request);

    @Mapping(target = "idCliente", source = "cliente.clienteId")
    @Mapping(target = "sellerCode", expression = "java(String.valueOf(cotizacion.getVendedor().getSellerId()))")
    @Mapping(target = "idSede", expression = "java(cotizacion.getVendedor().getSellerBranch() != null ? cotizacion.getVendedor().getSellerBranch().getBranchId().intValue() : null)")
    @Mapping(target = "items", expression = "java(cotizacion.getItems().stream().map(this::toDto).toList())")
    CotizacionResponse toDto(Cotizacion cotizacion);

    @Mapping(target = "clienteNombre", expression = "java(cotizacion.getCliente().getFullName())")
    @Mapping(target = "fechaExpiracion", expression = "java(cotizacion.getFechaExpiracion())")
    CotizacionListResponse toListDto(Cotizacion cotizacion);
}


