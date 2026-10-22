package cl.duoc.foreverink.usuario.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cl.duoc.foreverink.usuario.exception.ReglaNegocioException;

/**
 * Prueba unitaria de la validación del RUN (dígito verificador con módulo 11).
 * Está en el mismo paquete que UsuarioService porque validarRun no es pública.
 */
class ValidarRunTest {

    @Test
    @DisplayName("Acepta RUN con dígito verificador correcto, incluido el dígito K")
    void runValido() {
        assertDoesNotThrow(() -> UsuarioService.validarRun("190110222"));
        assertDoesNotThrow(() -> UsuarioService.validarRun("111111111"));
        assertDoesNotThrow(() -> UsuarioService.validarRun("10000013k"));
    }

    @Test
    @DisplayName("Rechaza un RUN con el dígito verificador equivocado")
    void runInvalido() {
        assertThrows(ReglaNegocioException.class, () -> UsuarioService.validarRun("190110221"));
    }
}
