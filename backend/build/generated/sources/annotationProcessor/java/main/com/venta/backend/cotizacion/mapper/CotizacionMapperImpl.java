package com.venta.backend.cotizacion.mapper;

import com.venta.backend.cotizacion.dto.CotizacionItemRequest;
import com.venta.backend.cotizacion.dto.CotizacionItemResponse;
import com.venta.backend.cotizacion.dto.CotizacionRequest;
import com.venta.backend.cotizacion.dto.CotizacionResponse;
import com.venta.backend.cotizacion.model.Cotizacion;
import com.venta.backend.cotizacion.model.DetalleCotizacion;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-04T22:57:45-0500",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class CotizacionMapperImpl implements CotizacionMapper {

    @Override
    public DetalleCotizacion toEntity(CotizacionItemRequest request) {
        if ( request == null ) {
            return null;
        }

        DetalleCotizacion.DetalleCotizacionBuilder detalleCotizacion = DetalleCotizacion.builder();

        detalleCotizacion.itemProductoId( request.getProductoId() );
        detalleCotizacion.cantidad( request.getCantidad() );
        detalleCotizacion.precioUnitario( request.getPrecioUnitario() );

        return detalleCotizacion.build();
    }

    @Override
    public CotizacionItemResponse toDto(DetalleCotizacion item) {
        if ( item == null ) {
            return null;
        }

        CotizacionItemResponse.CotizacionItemResponseBuilder cotizacionItemResponse = CotizacionItemResponse.builder();

        cotizacionItemResponse.productoId( item.getItemProductoId() );
        cotizacionItemResponse.id( item.getId() );
        cotizacionItemResponse.cantidad( item.getCantidad() );
        cotizacionItemResponse.precioUnitario( item.getPrecioUnitario() );
        cotizacionItemResponse.descuentoMonto( item.getDescuentoMonto() );
        cotizacionItemResponse.subtotal( item.getSubtotal() );

        return cotizacionItemResponse.build();
    }

    @Override
    public Cotizacion toEntity(CotizacionRequest request) {
        if ( request == null ) {
            return null;
        }

        Cotizacion.CotizacionBuilder cotizacion = Cotizacion.builder();

        cotizacion.fechaCotizacion( java.time.LocalDate.now() );
        cotizacion.estado( com.venta.backend.cotizacion.model.CotizacionEstado.BORRADOR );

        return cotizacion.build();
    }

    @Override
    public CotizacionResponse toDto(Cotizacion cotizacion) {
        if ( cotizacion == null ) {
            return null;
        }

        CotizacionResponse.CotizacionResponseBuilder cotizacionResponse = CotizacionResponse.builder();

        cotizacionResponse.id( cotizacion.getId() );
        cotizacionResponse.numCotizacion( cotizacion.getNumCotizacion() );
        cotizacionResponse.fechaCotizacion( cotizacion.getFechaCotizacion() );
        cotizacionResponse.idCliente( cotizacion.getIdCliente() );
        cotizacionResponse.sellerCode( cotizacion.getSellerCode() );
        cotizacionResponse.idSede( cotizacion.getIdSede() );
        cotizacionResponse.estado( cotizacion.getEstado() );
        cotizacionResponse.validezDias( cotizacion.getValidezDias() );
        cotizacionResponse.totalCotizado( cotizacion.getTotalCotizado() );
        cotizacionResponse.origenCotizacion( cotizacion.getOrigenCotizacion() );

        cotizacionResponse.items( cotizacion.getItems().stream().map(this::toDto).toList() );

        return cotizacionResponse.build();
    }
}
