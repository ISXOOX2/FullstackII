package cl.duoc.foreverink.usuario.security;

/** Traduce el tipo de usuario del negocio al rol que usa Spring Security. */
public final class RolUtil {

    private RolUtil() {
    }

    public static String rolDe(String tipo) {
        return switch (tipo) {
            case "Administrador" -> "ADMIN";
            case "Vendedor" -> "VENDEDOR";
            default -> "CLIENTE";
        };
    }
}
