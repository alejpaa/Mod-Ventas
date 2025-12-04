package com.venta.backend.cliente.application.specifications;

import com.venta.backend.cliente.entities.Cliente;
import com.venta.backend.cliente.enums.EstadoClienteEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ClienteEspecificacion {

    /**
     * Construye una especificación de Spring Data JPA para filtrar clientes.
     *
     * @param filtro Filtro general (puede ser nombre, DNI, email, etc.)
     * @param estado Estado del cliente para filtrar
     * @return Specification para filtrar clientes
     */
    public static Specification<Cliente> buildSpecification(
            String filtro,
            EstadoClienteEnum estado
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtrar por Estado
            if (estado != null) {
                predicates.add(cb.equal(root.get("estado"), estado));
            }

            // Búsqueda general por filtro (nombre, DNI, email)
            if (filtro != null && !filtro.isBlank()) {
                String likePattern = "%" + filtro + "%";
                Predicate filtroNombre = cb.or(
                        cb.like(root.get("firstName"), likePattern),
                        cb.like(root.get("lastName"), likePattern),
                        cb.like(cb.concat(root.get("firstName"), cb.concat(" ", root.get("lastName"))), likePattern)
                );
                Predicate filtroDni = cb.like(root.get("dni"), likePattern);
                Predicate filtroEmail = cb.like(root.get("email"), likePattern);
                
                predicates.add(cb.or(filtroNombre, filtroDni, filtroEmail));
            }

            // Combinamos todos los predicados con un "AND"
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

