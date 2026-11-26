package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.NotNull;

/** Resultado del pago simulado: true = aprobado, false = rechazado. */
public record PagoRequest(@NotNull(message = "Indica si el pago fue aprobado.") Boolean aprobado) {
}
