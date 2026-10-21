package cl.duoc.foreverink.usuario.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import cl.duoc.foreverink.usuario.model.Usuario;
import cl.duoc.foreverink.usuario.repository.UsuarioRepository;

/**
 * Le dice a Spring Security cómo buscar un usuario por su correo. El AuthenticationManager
 * lo usa en el login para comparar la contraseña escrita con el hash BCrypt guardado.
 */
@Service
public class DetallesUsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public DetallesUsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return User.withUsername(usuario.getCorreo())
                .password(usuario.getPassword())
                .roles(RolUtil.rolDe(usuario.getTipo()))
                .build();
    }
}
