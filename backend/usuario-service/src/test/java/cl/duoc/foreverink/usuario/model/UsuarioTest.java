package cl.duoc.foreverink.usuario.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** El tipo de usuario del negocio se traduce al rol que usa Spring Security (@PreAuthorize). */
@DisplayName("Usuario - Rol para Spring Security")
class UsuarioTest {

    @Test
    @DisplayName("Administrador -> ADMIN, Vendedor -> VENDEDOR y Cliente -> CLIENTE")
    void testRolSegunTipo() {
        // given
        Usuario usuario = new Usuario();

        // when & then
        usuario.setTipo("Administrador");
        assertEquals("ADMIN", usuario.getRol());
        usuario.setTipo("Vendedor");
        assertEquals("VENDEDOR", usuario.getRol());
        usuario.setTipo("Cliente");
        assertEquals("CLIENTE", usuario.getRol());
    }
}
