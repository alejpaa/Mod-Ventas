package com.venta.backend.cliente.infraestructura.repository;

import com.venta.backend.cliente.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, Long>, JpaSpecificationExecutor<Cliente> {

    /**
     * Busca un cliente por su DNI.
     * @param dni El DNI a buscar.
     * @return Un Optional que puede contener al Cliente si se encuentra.
     */
    Optional<Cliente> findByDni(String dni);

    /**
     * Verifica si ya existe un cliente con un DNI específico.
     * @param dni El DNI a verificar.
     * @return true si el DNI ya existe, false de lo contrario.
     */
    boolean existsByDni(String dni);

    /**
     * Verifica si ya existe un cliente con un email específico.
     * @param email El email a verificar.
     * @return true si el email ya existe, false de lo contrario.
     */
    boolean existsByEmail(String email);
}

