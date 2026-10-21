import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Al cambiar de página, vuelve al inicio (si no, React Router deja el scroll donde estaba). */
export default function ScrollArriba() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
