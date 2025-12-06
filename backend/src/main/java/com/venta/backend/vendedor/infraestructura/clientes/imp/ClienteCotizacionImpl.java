package com.venta.backend.vendedor.infraestructura.clientes.imp;

import com.venta.backend.cotizacion.model.CotizacionEstado;
import com.venta.backend.cotizacion.repository.CotizacionRepository;
import com.venta.backend.vendedor.infraestructura.clientes.IClienteCotizacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Esta clase implementa el contrato IClienteCotizacion (Service Proxy local)
 * para mantener la separación lógica de módulos.
 */
@Component
@RequiredArgsConstructor
public class ClienteCotizacionImpl implements IClienteCotizacion {

    private final CotizacionRepository cotizacionRepository;

    @Override
    public boolean hasPendingQuotations(Long sellerId) {
        List<CotizacionEstado> pendingStatuses = Arrays.asList(
                CotizacionEstado.BORRADOR,
                CotizacionEstado.ENVIADA
        );

        long pendingCount = cotizacionRepository.countByVendedor_SellerIdAndEstadoIn(sellerId, pendingStatuses);

        return pendingCount > 0;
    }
}