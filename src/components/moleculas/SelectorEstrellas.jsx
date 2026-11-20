import { Form } from 'react-bootstrap';

const TEXTOS = { 1: 'Muy malo', 2: 'Malo', 3: 'Regular', 4: 'Bueno', 5: 'Excelente' };

/**
 * MOLÉCULA · Elegir de 1 a 5 estrellas. Por dentro son 5 radio buttons (accesible con teclado),
 * dibujados como estrellas con CSS. 1 es la peor valoración y 5 la mejor.
 * Props: name, valor, onChange(evento) y error (como CampoFormulario).
 */
export default function SelectorEstrellas({ name = 'estrellas', valor, onChange, error = '' }) {
  const actual = Number(valor) || 0;
  return (
    <fieldset className="mb-3">
      <legend className="etiqueta-campo">Tu valoración</legend>
      <div className="selector-estrellas" role="radiogroup" aria-label="Valoración de 1 a 5 estrellas">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={n <= actual ? 'estrella-llena' : 'estrella-vacia'} title={TEXTOS[n]}>
            <input
              type="radio" name={name} value={n} checked={actual === n} onChange={onChange}
              className="visually-hidden" aria-label={`${n} estrella(s): ${TEXTOS[n]}`}
            />
            <span aria-hidden="true">★</span>
          </label>
        ))}
        {actual > 0 && <span className="ms-2 small text-muted">{TEXTOS[actual]}</span>}
      </div>
      {error && <Form.Text className="text-danger d-block">{error}</Form.Text>}
    </fieldset>
  );
}
