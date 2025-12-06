package com.venta.backend.common.util;

import org.slf4j.MDC;

/**
 * Utilidad para gestionar el contexto de logging con MDC.
 * 
 * Uso:
 * - LoggingUtils.setUserId("12345")  → Establece el ID del usuario
 * - LoggingUtils.setUserId("admin@empresa.com") → O usar email
 * - LoggingUtils.clearUser() → Limpia el userId del contexto
 */
public class LoggingUtils {

    private static final String USER_ID_KEY = "userId";
    private static final String TRACE_ID_KEY = "traceId";

    /**
     * Establece el ID del usuario en el contexto MDC.
     * Se mostrará en todos los logs subsiguientes.
     * 
     * @param userId ID del usuario (puede ser ID numérico, email, username, etc.)
     */
    public static void setUserId(String userId) {
        if (userId != null && !userId.trim().isEmpty()) {
            MDC.put(USER_ID_KEY, userId);
        }
    }

    /**
     * Establece el ID del usuario usando un Long.
     * 
     * @param userId ID numérico del usuario
     */
    public static void setUserId(Long userId) {
        if (userId != null) {
            MDC.put(USER_ID_KEY, String.valueOf(userId));
        }
    }

    /**
     * Limpia el userId del contexto MDC.
     * Útil al hacer logout o al finalizar sesión.
     */
    public static void clearUser() {
        MDC.remove(USER_ID_KEY);
        MDC.put(USER_ID_KEY, "ANONYMOUS");
    }

    /**
     * Obtiene el traceId actual (para debugging).
     * 
     * @return El traceId actual o null si no existe
     */
    public static String getTraceId() {
        return MDC.get(TRACE_ID_KEY);
    }

    /**
     * Obtiene el userId actual (para debugging).
     * 
     * @return El userId actual o null si no existe  
     */
    public static String getUserId() {
        return MDC.get(USER_ID_KEY);
    }
}
