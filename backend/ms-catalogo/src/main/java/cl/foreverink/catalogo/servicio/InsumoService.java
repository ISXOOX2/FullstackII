package cl.foreverink.catalogo.servicio;

import cl.foreverink.catalogo.dto.InsumoRequest;
import cl.foreverink.catalogo.dto.MovimientoStock;
import cl.foreverink.catalogo.excepcion.ReglaNegocioException;
import cl.foreverink.catalogo.modelo.Insumo;
import cl.foreverink.catalogo.repositorio.InsumoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Insumos con stock. Stock critico: cuando stock <= stockCritico se muestra la alerta.
 * La Tienda vende los insumos con aLaVenta = true; al pagar se descuenta y al reembolsar se repone.
 */
@Service
public class InsumoService {

    private final InsumoRepository repositorio;

    public InsumoService(InsumoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Insumo> listar() {
        return repositorio.findAll();
    }

    public List<Insumo> criticos() {
        return repositorio.findAll().stream().filter(i -> i.getStock() <= i.getStockCritico()).toList();
    }

    public List<Insumo> tienda() {
        return repositorio.buscarALaVenta();
    }

    public Insumo obtener(Long id) {
        return repositorio.findById(id).orElseThrow(() -> ReglaNegocioException.noEncontrado("El insumo no existe."));
    }

    public Insumo guardar(Long id, InsumoRequest datos) {
        Insumo insumo = id == null ? new Insumo() : obtener(id);
        boolean venta = Boolean.TRUE.equals(datos.aLaVenta());
        if (venta && (datos.precio() == null || datos.descripcion() == null || datos.descripcion().isBlank()
                || datos.imagen() == null || datos.imagen().isBlank())) {
            throw new ReglaNegocioException("Para vender un insumo en la Tienda indica precio, descripcion e imagen.");
        }
        insumo.setNombre(datos.nombre().trim());
        insumo.setTipo(datos.tipo());
        insumo.setUnidad(datos.unidad().trim());
        insumo.setStock(datos.stock());
        insumo.setStockCritico(datos.stockCritico());
        insumo.setaLaVenta(venta);
        insumo.setPrecio(venta ? datos.precio() : 0);
        insumo.setDescripcion(venta ? datos.descripcion().trim() : "");
        insumo.setImagen(venta ? datos.imagen() : "");
        if (id == null) {
            insumo.setCodigo(siguienteCodigo());
        }
        return repositorio.save(insumo);
    }

    public void eliminar(Long id) {
        repositorio.delete(obtener(id));
    }

    /** IN-001, IN-002... */
    public String siguienteCodigo() {
        int mayor = repositorio.findAll().stream()
                .map(Insumo::getCodigo)
                .filter(c -> c != null && c.matches("IN-[0-9]+"))
                .mapToInt(c -> Integer.parseInt(c.substring(3)))
                .max().orElse(0);
        return String.format("IN-%03d", mayor + 1);
    }

    /** Venta pagada: revisa TODO el stock primero y recien despues descuenta (todo o nada). */
    @Transactional
    public List<Insumo> descontar(List<MovimientoStock> movimientos) {
        for (MovimientoStock m : movimientos) {
            Insumo insumo = obtener(m.insumoId());
            if (!Boolean.TRUE.equals(insumo.getaLaVenta())) {
                throw new ReglaNegocioException("«" + insumo.getNombre() + "» no esta a la venta.");
            }
            if (m.cantidad() > insumo.getStock()) {
                throw ReglaNegocioException.conflicto(insumo.getStock() > 0
                        ? "Solo quedan " + insumo.getStock() + " de «" + insumo.getNombre() + "»."
                        : "«" + insumo.getNombre() + "» se agoto.");
            }
        }
        for (MovimientoStock m : movimientos) {
            Insumo insumo = obtener(m.insumoId());
            insumo.setStock(insumo.getStock() - m.cantidad());
            repositorio.save(insumo);
        }
        return criticos();
    }

    /** Reembolso aprobado: los productos vuelven a bodega. */
    @Transactional
    public void reponer(List<MovimientoStock> movimientos) {
        for (MovimientoStock m : movimientos) {
            Insumo insumo = obtener(m.insumoId());
            insumo.setStock(insumo.getStock() + m.cantidad());
            repositorio.save(insumo);
        }
    }
}
