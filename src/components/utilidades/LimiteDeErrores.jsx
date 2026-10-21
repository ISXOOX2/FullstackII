import { Component } from 'react';
import { Container } from 'react-bootstrap';

/**
 * Error Boundary (material 2.3.5 "Manejo de errores en React").
 *
 * Atrapa los errores que ocurren al dibujar cualquier componente hijo y, en vez de dejar la
 * pantalla en blanco, muestra un mensaje amable. React solo permite crear Error Boundaries con
 * componentes de CLASE, porque usan dos métodos del ciclo de vida:
 *  - static getDerivedStateFromError(): cambia el estado para mostrar el mensaje de respaldo.
 *  - componentDidCatch(): se ejecuta después del error (aquí se podría registrar en un servidor).
 *
 * Props:
 *  - children : lo que se protege (toda la aplicación).
 *  - mensaje  : texto que se muestra si algo falla (opcional).
 */
export default class LimiteDeErrores extends Component {
  constructor(props) {
    super(props);
    this.state = { hayError: false };
  }

  static getDerivedStateFromError() {
    return { hayError: true };
  }

  componentDidCatch(error, info) {
    // Por qué no se hace más: el proyecto no tiene backend donde guardar el error.
    // En un sistema real aquí se enviaría "error" e "info.componentStack" a un registro.
    this.ultimoError = { error, info };
  }

  render() {
    if (this.state.hayError) {
      return (
        <Container className="py-5 text-center" role="alert">
          <h1 className="h3">Algo salió mal</h1>
          <p className="text-muted">
            {this.props.mensaje || 'Ocurrió un error inesperado. Recarga la página para continuar.'}
          </p>
        </Container>
      );
    }
    return this.props.children;
  }
}
