package com.venta.backend.common.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Filtro que intercepta todas las peticiones HTTP para:
 * 1. Generar un traceId único por request
 * 2. Limpiarlo al finalizar la petición
 * 
 * El userId se debe establecer manualmente en los controladores
 * cuando el usuario se autentique o realice acciones.
 */
@Component
@Order(1)
public class LogFilter implements Filter {

    private static final String TRACE_ID = "traceId";
    private static final String USER_ID = "userId";
    private static final String REQUEST_URI = "requestUri";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        try {
            // Generar traceId único para esta petición
            String traceId = UUID.randomUUID().toString().substring(0, 8);
            MDC.put(TRACE_ID, traceId);
            
            // Guardar URI del request para debugging
            MDC.put(REQUEST_URI, httpRequest.getRequestURI());
            
            // Si no hay userId establecido, usar "ANONYMOUS"
            if (MDC.get(USER_ID) == null) {
                MDC.put(USER_ID, "ANONYMOUS");
            }
            
            // Continuar con la cadena de filtros
            chain.doFilter(request, response);
            
        } finally {
            // CRÍTICO: Limpiar MDC al finalizar request para evitar memory leaks
            MDC.clear();
        }
    }
}
