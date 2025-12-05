package com.venta.backend.descuento.dominio.reglas;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.descuento.DTO.DescuentoAplicadoResponse;
import com.venta.backend.descuento.dominio.entidades.Cupon;
import com.venta.backend.descuento.dominio.estrategias.IDescuentoStrategy;
import com.venta.backend.descuento.dominio.enums.TipoDescuento;
import com.venta.backend.descuento.infraestructura.repository.CuponRepositorio;
import com.venta.backend.venta.entities.Venta;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class ReglaCupon implements IReglaDescuento {

    private final CuponRepositorio cuponRepositorio;
    private final IDescuentoStrategy porcentajeStrategy;
    private final IDescuentoStrategy fixedAmountStrategy;

    private Cupon cuponAplicable; // Estado para transferir el cupón de esAplicable a aplicar

    public ReglaCupon(CuponRepositorio cuponRepositorio, 
                      @Qualifier("porcentajeStrategy") IDescuentoStrategy porcentajeStrategy,
                      @Qualifier("fixedAmountStrategy") IDescuentoStrategy fixedAmountStrategy) {
        this.cuponRepositorio = cuponRepositorio;
        this.porcentajeStrategy = porcentajeStrategy;
        this.fixedAmountStrategy = fixedAmountStrategy;
    }

    @Override
    public boolean esAplicable(Venta venta, Cliente cliente, String codigoCupon) {
        if (codigoCupon == null || codigoCupon.trim().isEmpty()) {
            return false;
        }

        // Buscar el cupón (las validaciones de estado se harán en DiscountService)
        Optional<Cupon> cuponOpt = cuponRepositorio.findByCodigo(codigoCupon.trim());

        if (cuponOpt.isPresent() && cuponOpt.get().tieneUsosDisponibles() && !cuponOpt.get().estaExpirado() 
            && venta.calcularTotal().compareTo(cuponOpt.get().getMontoMinimoRequerido()) >= 0) {
            
            // Si el cupón es funcional (existe y cumple requisitos), lo marcamos como aplicable
            this.cuponAplicable = cuponOpt.get();
            return true;
        }
        
        return false;
    }

    @Override
    public DescuentoAplicadoResponse aplicar(Venta venta, Cliente cliente) {
        if (this.cuponAplicable == null) {
            throw new IllegalStateException("El cupón no fue marcado como aplicable.");
        }
        
        Cupon cupon = this.cuponAplicable;
        
        IDescuentoStrategy strategy = cupon.getTipoDescuento() == TipoDescuento.PORCENTAJE
                ? porcentajeStrategy
                : fixedAmountStrategy;

        BigDecimal montoDescontado = strategy.calcular(venta, cupon.getValor());
        BigDecimal nuevoTotal = venta.calcularTotal().subtract(montoDescontado);
        
        // **ACCIÓN CRÍTICA**: Marcar el cupón como usado y persistir
        cupon.usar();
        cuponRepositorio.save(cupon); 
        this.cuponAplicable = null;

        return new DescuentoAplicadoResponse(
                "CUPON_" + cupon.getCodigo(),
                montoDescontado,
                nuevoTotal,
                "Cupón aplicado: " + cupon.getCodigo()
        );
    }
    
    @Override
    public int getPrioridad() {
        return 5; // Alta prioridad para cupones manuales
    }
}