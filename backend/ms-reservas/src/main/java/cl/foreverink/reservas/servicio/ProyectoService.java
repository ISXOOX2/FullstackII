package cl.foreverink.reservas.servicio;

import cl.foreverink.reservas.dto.MensajeRequest;
import cl.foreverink.reservas.dto.ProyectoRequest;
import cl.foreverink.reservas.excepcion.ReglaNegocioException;
import cl.foreverink.reservas.modelo.Mensaje;
import cl.foreverink.reservas.modelo.Proyecto;
import cl.foreverink.reservas.repositorio.MensajeRepository;
import cl.foreverink.reservas.repositorio.ProyectoRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;

/** Lo que el cliente le envia al estudio: ideas propias ("Mi proyecto") y mensajes de contacto. */
@Service
public class ProyectoService {

    /** Plazo para contactar al cliente (lunes a viernes). */
    public static final int DIAS_HABILES_CONTACTO = 3;
    private static final ZoneId CHILE = ZoneId.of("America/Santiago");

    private final ProyectoRepository proyectos;
    private final MensajeRepository mensajes;

    public ProyectoService(ProyectoRepository proyectos, MensajeRepository mensajes) {
        this.proyectos = proyectos;
        this.mensajes = mensajes;
    }

    /** Suma dias habiles: se salta sabados y domingos. */
    public static LocalDate sumarDiasHabiles(LocalDate desde, int dias) {
        LocalDate fecha = desde;
        int contados = 0;
        while (contados < dias) {
            fecha = fecha.plusDays(1);
            if (fecha.getDayOfWeek() != DayOfWeek.SATURDAY && fecha.getDayOfWeek() != DayOfWeek.SUNDAY) {
                contados++;
            }
        }
        return fecha;
    }

    public Proyecto crearProyecto(ProyectoRequest datos, Long usuarioId) {
        LocalDate hoy = LocalDate.now(CHILE);
        Proyecto p = new Proyecto();
        p.setNombre(datos.nombre().trim());
        p.setCorreo(datos.correo().trim());
        p.setZonaCuerpo(datos.zonaCuerpo());
        p.setLado(datos.lado() == null ? "" : datos.lado());
        p.setIdea(datos.idea().trim());
        p.setImagen(datos.imagen() == null ? "" : datos.imagen());
        p.setFecha(hoy);
        p.setContactarAntesDe(sumarDiasHabiles(hoy, DIAS_HABILES_CONTACTO));
        p.setEstado("Nuevo");
        p.setUsuarioId(usuarioId);
        return proyectos.save(p);
    }

    public List<Proyecto> listarProyectos() {
        return proyectos.findAllByOrderByFechaDescIdDesc();
    }

    public Proyecto cambiarEstado(Long id, String estado) {
        Proyecto p = proyectos.findById(id)
                .orElseThrow(() -> ReglaNegocioException.noEncontrado("El proyecto no existe."));
        p.setEstado(estado);
        return proyectos.save(p);
    }

    public Mensaje guardarMensaje(MensajeRequest datos) {
        Mensaje m = new Mensaje();
        m.setNombre(datos.nombre().trim());
        m.setCorreo(datos.correo().trim());
        m.setComentario(datos.comentario().trim());
        m.setFecha(LocalDateTime.now(CHILE));
        return mensajes.save(m);
    }

    public List<Mensaje> listarMensajes() {
        return mensajes.findAllByOrderByFechaDescIdDesc();
    }
}
