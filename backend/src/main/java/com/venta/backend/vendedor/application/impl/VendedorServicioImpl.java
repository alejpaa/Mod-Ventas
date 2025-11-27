package com.venta.backend.vendedor.application.impl;

import com.venta.backend.vendedor.application.dto.request.ModificacionVendedorRequest;
import com.venta.backend.vendedor.application.dto.request.RegistroVendedorRequest;
import com.venta.backend.vendedor.application.dto.response.VendedorResponse;
import com.venta.backend.vendedor.application.estrategias.IEdicionVendedorStrategia;
import com.venta.backend.vendedor.application.estrategias.IRegistroVendedorStrategia;
import com.venta.backend.vendedor.application.exceptions.RecursoNoEncontradoException;
import com.venta.backend.vendedor.application.exceptions.RegistroVendedorException;
import com.venta.backend.vendedor.application.fabricas.IFabricaStrategia;
import com.venta.backend.vendedor.application.mappers.IVendedorMapeador;
import com.venta.backend.vendedor.application.servicios.IVendedorAdminServicio;
import com.venta.backend.vendedor.application.servicios.IVendedorConsultaServicio;
import com.venta.backend.vendedor.application.specifications.VendedorEspecificacion;
import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.enums.SellerType;
import com.venta.backend.vendedor.infraestructura.clientes.IClienteCotizacion;
import com.venta.backend.vendedor.infraestructura.repository.SedeRepositorio;
import com.venta.backend.vendedor.infraestructura.repository.VendedorRepositorio;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendedorServicioImpl implements IVendedorAdminServicio, IVendedorConsultaServicio {
    private final VendedorRepositorio vendedorRepositorio;
    private final SedeRepositorio sedeRepositorio;
    private final IFabricaStrategia fabricaStrategia;
    private final IVendedorMapeador vendedorMapeador;
    private final IClienteCotizacion clienteCotizacion;

    @Override
    @Transactional
    public VendedorResponse createSeller(RegistroVendedorRequest request) {
        IRegistroVendedorStrategia strategia = fabricaStrategia.getRegistrationStrategy(request.getSellerType());

        strategia.validateData(request);

        if (request.getSellerBranchId() == null) {
            throw new RegistroVendedorException("Debe asignar una Sede de Venta.");
        }
        Sede sedeAsignada = findSedeEntityById(request.getSellerBranchId());

        Vendedor newVendedor = strategia.createSellerEntity(request);

        newVendedor.assignBranch(sedeAsignada);

        Vendedor savedVendedor = vendedorRepositorio.save(newVendedor);

        return vendedorMapeador.toVendedorResponse(savedVendedor);
    }

    @Override
    @Transactional
    public VendedorResponse updateSeller(Long sellerId, ModificacionVendedorRequest request) {
        Vendedor vendedorToUpdate = findSellerEntityById(sellerId);

        IEdicionVendedorStrategia strategia = fabricaStrategia.getEditionStrategy(vendedorToUpdate.getSellerType());

        Sede newSede = null;
        Long newBranchId = request.getSellerBranchId();

        if (newBranchId != null && !newBranchId.equals(vendedorToUpdate.getSellerBranch().getBranchId())) {
            newSede = findSedeEntityById(newBranchId);
        }

        strategia.applyChanges(vendedorToUpdate, request, newSede);

        Vendedor updatedVendedor = vendedorRepositorio.save(vendedorToUpdate);

        return vendedorMapeador.toVendedorResponse(updatedVendedor);
    }

    @Override
    @Transactional
    public void deactivateSeller(Long sellerId) {
        Vendedor vendedor = findSellerEntityById(sellerId);

        if (clienteCotizacion.hasPendingQuotations(sellerId)) {
            throw new RegistroVendedorException("Acción bloqueada: El vendedor tiene cotizaciones pendientes.");
        }

        vendedor.changeStatus(SellerStatus.INACTIVE);

        vendedorRepositorio.save(vendedor);
    }

    @Override
    @Transactional
    public VendedorResponse reactivateSeller(Long sellerId) {
        Vendedor vendedor = findSellerEntityById(sellerId);
        vendedor.changeStatus(SellerStatus.ACTIVE);
        Vendedor reactivatedVendedor = vendedorRepositorio.save(vendedor);
        return vendedorMapeador.toVendedorResponse(reactivatedVendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendedorResponse findSellerById(Long sellerId) {
        Vendedor vendedor = findSellerEntityById(sellerId);
        return vendedorMapeador.toVendedorResponse(vendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendedorResponse findSellerByDni(String dni) {
        Vendedor vendedor = vendedorRepositorio.findByDni(dni)
                .orElseThrow(() -> new RecursoNoEncontradoException("Vendedor no encontrado con DNI: " + dni));
        return vendedorMapeador.toVendedorResponse(vendedor);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendedorResponse> searchSellers(SellerType sellerType, SellerStatus sellerStatus,
                                                Long sellerBranchId, String dni, Pageable pageable) {
        // 1. Usar nuestro helper para construir la consulta dinámica
        Specification<Vendedor> spec = VendedorEspecificacion.buildSpecification(
                sellerType, sellerStatus, sellerBranchId, dni
        );

        // 2. Ejecutar la consulta con paginación
        Page<Vendedor> vendedorPage = vendedorRepositorio.findAll(spec, pageable);

        // 3. Mapear la página de Entidades a una página de DTOs
        // (vendedorMapeador::toVendedorResponse es un atajo para v -> vendedorMapeador.toVendedorResponse(v))
        return vendedorPage.map(vendedorMapeador::toVendedorResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendedorResponse> listActiveSellers() {
        Specification<Vendedor> spec = VendedorEspecificacion.buildSpecification(null, SellerStatus.ACTIVE, null, null);
        List<Vendedor> activeSellers = vendedorRepositorio.findAll(spec);
        return vendedorMapeador.toVendedorResponseList(activeSellers);
    }


    private Vendedor findSellerEntityById(Long sellerId) {
        return vendedorRepositorio.findById(sellerId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Vendedor no encontrado con ID: " + sellerId));
    }

    private Sede findSedeEntityById(Long sedeId) {
        return sedeRepositorio.findById(sedeId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Sede no encontrada con ID: " + sedeId));
    }
}
