package cl.duoc.foreverink.carrito.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.foreverink.carrito.client.ProductoClient;
import cl.duoc.foreverink.carrito.client.ProductoRemotoDto;
import cl.duoc.foreverink.carrito.dto.CarritoDto;
import cl.duoc.foreverink.carrito.dto.ItemCarritoDto;
import cl.duoc.foreverink.carrito.dto.ItemRequest;
import cl.duoc.foreverink.carrito.model.CarritoItem;
import cl.duoc.foreverink.carrito.repository.CarritoItemRepository;

/**
 * Reglas del carrito (las mismas del frontend, ERS 3.2.2):
 *  - máximo 5 unidades del mismo diseño;
 *  - no se puede reservar más de los cupos (stock) disponibles;
 *  - el precio es el de oferta si existe.
 * Los cupos y el precio NO se inventan aquí: se le preguntan a producto-service (Feign).
 */
@Service
public class CarritoService {

    public static final int MAXIMO_POR_DISENO = 5;

    private static final Logger log = LoggerFactory.getLogger(CarritoService.class);

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private ProductoClient productoClient;

    /** Devuelve el carrito (si no tiene ítems, viene vacío con total 0). */
    @Transactional(readOnly = true)
    public CarritoDto obtener(String clave) {
        List<CarritoItem> items = carritoItemRepository.findByClaveOrderByIdAsc(clave);
        List<ItemCarritoDto> dtos = items.stream()
                .map(i -> new ItemCarritoDto(i.getProductoId(), i.getNombre(), i.getImagen(), i.getPrecio(),
                        i.getStock(), i.getCantidad(), i.getPrecio() * i.getCantidad()))
                .toList();
        int total = dtos.stream().mapToInt(ItemCarritoDto::getSubtotal).sum();
        int cantidadTotal = dtos.stream().mapToInt(ItemCarritoDto::getCantidad).sum();
        return new CarritoDto(clave, dtos, total, cantidadTotal);
    }

    /** Agrega un diseño (o suma unidades si ya estaba en el carrito). */
    @Transactional
    public CarritoDto agregar(String clave, ItemRequest datos) {
        CarritoItem item = carritoItemRepository.findByClaveAndProductoId(clave, datos.getProductoId())
                .orElse(null);
        int nuevaCantidad = (item != null ? item.getCantidad() : 0) + datos.getCantidad();
        guardarItem(clave, item, datos.getProductoId(), nuevaCantidad);
        log.info("Carrito {}: producto={} cantidad={}", clave, datos.getProductoId(), nuevaCantidad);
        return obtener(clave);
    }

    /** Quita un diseño del carrito (404 si no estaba). */
    @Transactional
    public void quitar(String clave, Long productoId) {
        CarritoItem item = carritoItemRepository.findByClaveAndProductoId(clave, productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El producto " + productoId + " no está en el carrito"));
        carritoItemRepository.delete(item);
        log.info("Carrito {}: quitado producto={}", clave, productoId);
    }

    /** Vacía el carrito (por ejemplo, después de pagar). */
    @Transactional
    public void vaciar(String clave) {
        carritoItemRepository.deleteAll(carritoItemRepository.findByClaveOrderByIdAsc(clave));
        log.info("Carrito {} vaciado", clave);
    }

    /**
     * Guarda el carrito completo de una vez (lo usa el frontend). Cada ítem se valida contra
     * producto-service; los que ya estaban se actualizan y los que ya no vienen se eliminan.
     */
    @Transactional
    public CarritoDto reemplazar(String clave, List<ItemRequest> items) {
        Set<Long> pedidos = new HashSet<>();
        for (ItemRequest datos : items) {
            if (!pedidos.add(datos.getProductoId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El producto " + datos.getProductoId() + " viene repetido");
            }
            CarritoItem item = carritoItemRepository.findByClaveAndProductoId(clave, datos.getProductoId())
                    .orElse(null);
            guardarItem(clave, item, datos.getProductoId(), datos.getCantidad());
        }
        for (CarritoItem item : carritoItemRepository.findByClaveOrderByIdAsc(clave)) {
            if (!pedidos.contains(item.getProductoId())) {
                carritoItemRepository.delete(item);
            }
        }
        log.info("Carrito {} guardado con {} diseño(s)", clave, pedidos.size());
        return obtener(clave);
    }

    // ─── Apoyo ──────────────────────────────────────────────────────────────

    /**
     * Pregunta a producto-service el precio y los cupos del diseño, valida la cantidad y guarda.
     * Si el producto no existe, Feign lanza FeignException.NotFound (-> 404); si producto-service
     * no responde, otra FeignException (-> 503). Las dos las traduce el GlobalExceptionHandler.
     */
    private void guardarItem(String clave, CarritoItem item, Long productoId, int cantidad) {
        log.info("Consultando producto {} en producto-service", productoId);
        ProductoRemotoDto producto = productoClient.obtenerProducto(productoId);
        validarCantidad(producto, cantidad);
        if (item == null) {
            item = new CarritoItem();
            item.setClave(clave);
            item.setProductoId(producto.getId());
        }
        item.setNombre(producto.getNombre());
        item.setImagen(producto.getImagen());
        item.setPrecio(producto.precioFinal());
        item.setStock(producto.getStock());
        item.setCantidad(cantidad);
        carritoItemRepository.save(item);
    }

    private void validarCantidad(ProductoRemotoDto producto, int cantidad) {
        if (producto.getStock() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "«" + producto.getNombre() + "» no tiene cupos disponibles");
        }
        int limite = Math.min(producto.getStock(), MAXIMO_POR_DISENO);
        if (cantidad > limite) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Solo puedes reservar hasta " + limite + " unidad(es) de «" + producto.getNombre() + "»");
        }
    }
}
