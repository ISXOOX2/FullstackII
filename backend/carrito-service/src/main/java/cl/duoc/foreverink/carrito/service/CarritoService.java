package cl.duoc.foreverink.carrito.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.duoc.foreverink.carrito.client.ProductoClient;
import cl.duoc.foreverink.carrito.client.ProductoRemotoDto;
import cl.duoc.foreverink.carrito.dto.CarritoDto;
import cl.duoc.foreverink.carrito.dto.ItemCarritoDto;
import cl.duoc.foreverink.carrito.dto.ItemRequest;
import cl.duoc.foreverink.carrito.exception.RecursoNoEncontradoException;
import cl.duoc.foreverink.carrito.exception.ReglaNegocioException;
import cl.duoc.foreverink.carrito.model.Carrito;
import cl.duoc.foreverink.carrito.model.ItemCarrito;
import cl.duoc.foreverink.carrito.repository.CarritoRepository;

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

    private final CarritoRepository carritoRepository;
    private final ProductoClient productoClient;

    public CarritoService(CarritoRepository carritoRepository, ProductoClient productoClient) {
        this.carritoRepository = carritoRepository;
        this.productoClient = productoClient;
    }

    /** Devuelve el carrito; si todavía no existe, uno vacío. */
    @Transactional(readOnly = true)
    public CarritoDto obtener(String clave) {
        return carritoRepository.findByClave(clave)
                .map(this::aDto)
                .orElseGet(() -> new CarritoDto(clave, List.of(), 0, 0));
    }

    /** Agrega un diseño (o suma unidades si ya estaba). */
    @Transactional
    public CarritoDto agregar(String clave, ItemRequest datos) {
        Carrito carrito = obtenerOCrear(clave);
        ItemCarrito item = buscarItem(carrito, datos.productoId());
        int nuevaCantidad = (item != null ? item.getCantidad() : 0) + datos.cantidad();
        ProductoRemotoDto producto = consultarProducto(datos.productoId());
        validarCantidad(producto, nuevaCantidad);
        if (item == null) {
            item = new ItemCarrito();
            item.setCarrito(carrito);
            item.setProductoId(producto.id());
            carrito.getItems().add(item);
        }
        copiarProducto(producto, item, nuevaCantidad);
        log.info("Carrito {}: agregado producto={} cantidad={}", clave, producto.id(), nuevaCantidad);
        return guardar(carrito);
    }

    /** Cambia la cantidad de un diseño que ya está en el carrito. */
    @Transactional
    public CarritoDto cambiarCantidad(String clave, Long productoId, int cantidad) {
        Carrito carrito = buscarCarrito(clave);
        ItemCarrito item = buscarItem(carrito, productoId);
        if (item == null) {
            throw new RecursoNoEncontradoException("El producto " + productoId + " no está en el carrito");
        }
        ProductoRemotoDto producto = consultarProducto(productoId);
        validarCantidad(producto, cantidad);
        copiarProducto(producto, item, cantidad);
        return guardar(carrito);
    }

    /** Quita un diseño del carrito. */
    @Transactional
    public void quitar(String clave, Long productoId) {
        Carrito carrito = buscarCarrito(clave);
        boolean quitado = carrito.getItems().removeIf(i -> i.getProductoId().equals(productoId));
        if (!quitado) {
            throw new RecursoNoEncontradoException("El producto " + productoId + " no está en el carrito");
        }
        guardar(carrito);
        log.info("Carrito {}: quitado producto={}", clave, productoId);
    }

    /** Vacía el carrito (por ejemplo, después de pagar). */
    @Transactional
    public void vaciar(String clave) {
        carritoRepository.findByClave(clave).ifPresent(carrito -> {
            carrito.getItems().clear();
            guardar(carrito);
            log.info("Carrito {} vaciado", clave);
        });
    }

    /**
     * Guarda el carrito completo de una vez (lo usa el frontend). Cada ítem se valida contra
     * producto-service. Los ítems existentes se actualizan en su lugar y los que ya no vienen
     * se eliminan.
     */
    @Transactional
    public CarritoDto reemplazar(String clave, List<ItemRequest> items) {
        Carrito carrito = obtenerOCrear(clave);
        Set<Long> pedidos = new HashSet<>();
        for (ItemRequest datos : items) {
            if (!pedidos.add(datos.productoId())) {
                throw new ReglaNegocioException("El producto " + datos.productoId() + " viene repetido");
            }
            ProductoRemotoDto producto = consultarProducto(datos.productoId());
            validarCantidad(producto, datos.cantidad());
            ItemCarrito item = buscarItem(carrito, datos.productoId());
            if (item == null) {
                item = new ItemCarrito();
                item.setCarrito(carrito);
                item.setProductoId(producto.id());
                carrito.getItems().add(item);
            }
            copiarProducto(producto, item, datos.cantidad());
        }
        carrito.getItems().removeIf(i -> !pedidos.contains(i.getProductoId()));
        log.info("Carrito {} guardado con {} diseño(s)", clave, pedidos.size());
        return guardar(carrito);
    }

    // ─── Apoyo ──────────────────────────────────────────────────────────────

    /**
     * Comunicación con producto-service. Si el producto no existe, Feign lanza
     * FeignException.NotFound; si el servicio no responde, otra FeignException.
     * Las dos las traduce el ManejadorGlobalErrores (404 y 503).
     */
    private ProductoRemotoDto consultarProducto(Long productoId) {
        log.info("Consultando producto {} en producto-service", productoId);
        return productoClient.obtenerProducto(productoId);
    }

    private void validarCantidad(ProductoRemotoDto producto, int cantidad) {
        if (producto.stock() <= 0) {
            throw new ReglaNegocioException("«" + producto.nombre() + "» no tiene cupos disponibles");
        }
        int limite = Math.min(producto.stock(), MAXIMO_POR_DISENO);
        if (cantidad > limite) {
            throw new ReglaNegocioException("Solo puedes reservar hasta " + limite + " unidad(es) de «" + producto.nombre() + "»");
        }
    }

    private void copiarProducto(ProductoRemotoDto producto, ItemCarrito item, int cantidad) {
        item.setNombre(producto.nombre());
        item.setImagen(producto.imagen());
        item.setPrecio(producto.precioFinal());
        item.setStock(producto.stock());
        item.setCantidad(cantidad);
    }

    private Carrito obtenerOCrear(String clave) {
        return carritoRepository.findByClave(clave).orElseGet(() -> {
            Carrito nuevo = new Carrito();
            nuevo.setClave(clave);
            return nuevo;
        });
    }

    private Carrito buscarCarrito(String clave) {
        return carritoRepository.findByClave(clave)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el carrito " + clave));
    }

    private ItemCarrito buscarItem(Carrito carrito, Long productoId) {
        return carrito.getItems().stream()
                .filter(i -> i.getProductoId().equals(productoId))
                .findFirst()
                .orElse(null);
    }

    private CarritoDto guardar(Carrito carrito) {
        carrito.setActualizado(LocalDateTime.now());
        return aDto(carritoRepository.save(carrito));
    }

    private CarritoDto aDto(Carrito carrito) {
        List<ItemCarritoDto> items = carrito.getItems().stream()
                .map(i -> new ItemCarritoDto(i.getProductoId(), i.getNombre(), i.getImagen(), i.getPrecio(),
                        i.getStock(), i.getCantidad(), i.getPrecio() * i.getCantidad()))
                .toList();
        int total = items.stream().mapToInt(ItemCarritoDto::subtotal).sum();
        int cantidad = items.stream().mapToInt(ItemCarritoDto::cantidad).sum();
        return new CarritoDto(carrito.getClave(), items, total, cantidad);
    }
}
