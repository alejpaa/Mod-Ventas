package com.venta.backend.vendedor.application.specifications;

import com.venta.backend.vendedor.entities.Sede;
import com.venta.backend.vendedor.entities.Vendedor;
import com.venta.backend.vendedor.enums.SellerStatus;
import com.venta.backend.vendedor.enums.SellerType;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class VendedorEspecificacion {

    /**
     * Construye una especificación de Spring Data JPA para filtrar vendedores.
     *
     * @param sellerType
     * @param sellerStatus
     * @param sellerBranchId
     * @param dni
     * @return
     */
    public static Specification<Vendedor> buildSpecification(
                                                              SellerType sellerType,
                                                              SellerStatus sellerStatus,
                                                              Long sellerBranchId,
                                                              String dni
    ) {
        return (root, query, cb) -> {
            // Creamos una lista para todos los predicados (condiciones WHERE)
            List<Predicate> predicates = new ArrayList<>();

            // Filtrar por Tipo
            if (sellerType != null) {
                predicates.add(cb.equal(root.get("sellerType"), sellerType));
            }

            // Filtrar por Estado
            if (sellerStatus != null) {
                predicates.add(cb.equal(root.get("sellerStatus"), sellerStatus));
            }

            // Filtrar por Sede
            if (sellerBranchId != null) {
                // Hacemos un JOIN con la tabla Sede (sellerBranch)
                Join<Vendedor, Sede> branchJoin = root.join("sellerBranch");
                // Comparamos el ID de la sede
                predicates.add(cb.equal(branchJoin.get("branchId"), sellerBranchId));
            }

            // Búsqueda por DNI
            if (dni != null && !dni.isBlank()) {
                // Usamos 'like' para búsquedas parciales (ej: '7654' trae '76543210')
                predicates.add(cb.like(root.get("dni"), "%" + dni + "%"));
            }

            // Combinamos todos los predicados con un "AND"
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}