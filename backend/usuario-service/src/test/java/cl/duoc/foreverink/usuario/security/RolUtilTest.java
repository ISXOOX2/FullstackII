package cl.duoc.foreverink.usuario.security;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** El tipo de usuario del negocio se traduce al rol que usa Spring Security (@PreAuthorize). */
class RolUtilTest {

    @Test
    @DisplayName("Administrador → ADMIN, Vendedor → VENDEDOR y cualquier otro → CLIENTE")
    void traduceTipoARol() {
        assertEquals("ADMIN", RolUtil.rolDe("Administrador"));
        assertEquals("VENDEDOR", RolUtil.rolDe("Vendedor"));
        assertEquals("CLIENTE", RolUtil.rolDe("Cliente"));
    }
}
