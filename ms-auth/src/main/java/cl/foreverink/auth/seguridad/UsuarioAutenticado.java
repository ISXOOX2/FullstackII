package cl.foreverink.auth.seguridad;

/**
 * Quien hizo la peticion (sale del token). Los controladores lo reciben con @AuthenticationPrincipal.
 * rol: "Administrador", "Vendedor" o "Cliente".
 */
public record UsuarioAutenticado(Long id, String correo, String rol) {

    public boolean esAdministrador() {
        return "Administrador".equals(rol);
    }

    public boolean esPersonal() {
        return "Administrador".equals(rol) || "Vendedor".equals(rol);
    }
}
