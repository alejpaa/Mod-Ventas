package com.venta.backend.venta.repository;

import com.venta.backend.venta.entities.ItemProducto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemProductoRepositorio extends JpaRepository<ItemProducto, Long> {
}

