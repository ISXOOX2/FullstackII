package cl.foreverink.reservas.cliente;

import cl.foreverink.reservas.excepcion.ReglaNegocioException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.time.Duration;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

/**
 * Comunicacion entre microservicios: ms-reservas le pregunta a ms-catalogo por REST (RestClient).
 *  - precios y nombres reales de los disenos y articulos (el cliente no puede inventar un precio);
 *  - descontar el stock de la Tienda cuando un pago se aprueba y reponerlo si se reembolsa.
 * El token JWT del usuario se reenvia para que ms-catalogo sepa quien pide el cambio.
 */
@Component
public class CatalogoCliente {

    private static final Logger log = LoggerFactory.getLogger(CatalogoCliente.class);

    private static final ParameterizedTypeReference<Map<String, Object>> OBJETO = new ParameterizedTypeReference<>() { };
    private static final ParameterizedTypeReference<List<Map<String, Object>>> LISTA = new ParameterizedTypeReference<>() { };

    private final RestClient cliente;
    private final ObjectMapper mapper;

    public CatalogoCliente(@Value("${app.catalogo.url}") String url, ObjectMapper mapper) {
        // Timeouts: si ms-catalogo no contesta, la compra no queda colgada (responde 503 con un mensaje claro)
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(Duration.ofSeconds(3));
        fabrica.setReadTimeout(Duration.ofSeconds(10));
        this.cliente = RestClient.builder().baseUrl(url).requestFactory(fabrica).build();
        this.mapper = mapper;
    }

    public Map<String, Object> diseno(Long id) {
        try {
            return cliente.get().uri("/disenos/{id}", id).retrieve().body(OBJETO);
        } catch (RestClientResponseException e) {
            throw traducir(e, "El diseno " + id + " ya no esta en el catalogo.");
        } catch (RestClientException e) {
            throw sinConexion();
        }
    }

    public List<Map<String, Object>> tienda() {
        try {
            return cliente.get().uri("/tienda").retrieve().body(LISTA);
        } catch (RestClientException e) {
            throw sinConexion();
        }
    }

    public List<Map<String, Object>> tatuadores() {
        try {
            return cliente.get().uri("/tatuadores").retrieve().body(LISTA);
        } catch (RestClientException e) {
            throw sinConexion();
        }
    }

    public void descontar(List<Map<String, Object>> movimientos, String token) {
        enviar("/tienda/descontar", movimientos, token);
    }

    public void reponer(List<Map<String, Object>> movimientos, String token) {
        enviar("/tienda/reponer", movimientos, token);
    }

    private void enviar(String ruta, List<Map<String, Object>> movimientos, String token) {
        if (movimientos.isEmpty()) {
            return;
        }
        try {
            cliente.post().uri(ruta)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", token == null ? "" : token)
                    .body(movimientos)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            throw traducir(e, "No se pudo actualizar el stock de la Tienda.");
        } catch (RestClientException e) {
            throw sinConexion();
        }
    }

    /** Usa el mensaje que devolvio ms-catalogo (por ejemplo "Solo quedan 2 de ..."). */
    private ReglaNegocioException traducir(RestClientResponseException e, String porDefecto) {
        String mensaje = porDefecto;
        try {
            Object texto = mapper.readValue(e.getResponseBodyAsString(), Map.class).get("mensaje");
            if (texto != null) {
                mensaje = texto.toString();
            }
        } catch (Exception ignorado) {
            // la respuesta no era JSON: se usa el mensaje por defecto
        }
        HttpStatus estado = HttpStatus.resolve(e.getStatusCode().value());
        return new ReglaNegocioException(estado == null ? HttpStatus.BAD_GATEWAY : estado, mensaje);
    }

    private ReglaNegocioException sinConexion() {
        log.error("Sin conexion con ms-catalogo");
        return new ReglaNegocioException(HttpStatus.SERVICE_UNAVAILABLE,
                "El catalogo no responde en este momento. Intenta de nuevo en unos minutos.");
    }
}
