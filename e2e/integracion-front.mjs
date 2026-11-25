// Prueba de punta a punta: el FRONTEND (React) conectado a los 4 microservicios reales.
// La corre GitHub Actions (ver .github/workflows/backend.yml). Usa Playwright como si fuera una persona.
import { chromium } from 'playwright';

const BASE = process.env.FRONT_URL || 'http://localhost:4173';
const CATALOGO = 'http://localhost:8082/api/v1/catalogo';
const ok = (t) => console.log(`  ✔ ${t}`);
const falla = (t) => { console.log(`  ✘ ${t}`); process.exitCode = 1; throw new Error(t); };
const comprobar = (condicion, texto) => (condicion ? ok(texto) : falla(texto));

/** Próximo día de atención (martes a sábado) al menos 4 días después de hoy. */
function fechaCita() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  while (d.getDay() === 0 || d.getDay() === 1) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
const stockCrema = async () => (await (await fetch(`${CATALOGO}/tienda`)).json()).find((a) => a.id === 8).stock;

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
const errores = [];
pagina.on('pageerror', (e) => errores.push(e.message));

async function login(correo, clave) {
  await pagina.goto(`${BASE}/login`);
  await pagina.getByLabel('Correo electrónico').fill(correo);
  await pagina.getByLabel('Contraseña', { exact: true }).fill(clave);
  await pagina.getByRole('form', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
  await pagina.getByTestId('saludo').waitFor();
}

try {
  console.log('▶ Catálogo y blog desde la API');
  await pagina.goto(`${BASE}/tienda`);
  await pagina.locator('.tarjeta-producto').first().waitFor();
  comprobar(await pagina.locator('.tarjeta-producto').count() === 9, 'la Tienda muestra los 9 artículos de ms-catalogo');
  await pagina.goto(`${BASE}/blogs`);
  await pagina.getByText('Se actualiza solo cada 30 segundos').waitFor();
  comprobar(await pagina.locator('.tarjeta-blog').count() === 2, 'el blog muestra los artículos de ms-blog');

  console.log('▶ Login con JWT (ms-usuarios)');
  await login('cliente.demo@gmail.com', 'Cliente#1');
  const sesion = await pagina.evaluate(() => JSON.parse(sessionStorage.getItem('foreverInk_sesion')));
  comprobar(sesion?.token?.startsWith('ey'), 'la sesión guarda el token JWT');

  console.log('▶ Compra: diseño con cita + producto de la tienda (ms-reservas + ms-catalogo)');
  const stockAntes = await stockCrema();
  await pagina.goto(`${BASE}/productos/1`);
  await pagina.locator('button.btn-lg').click();
  await pagina.goto(`${BASE}/tienda`);
  await pagina.locator('.tarjeta-producto').filter({ hasText: 'Crema cicatrizante 50 ml' }).getByRole('button').click();
  await pagina.goto(`${BASE}/checkout`);
  await pagina.getByLabel('Teléfono').fill('+56912345678');
  await pagina.getByLabel('Tatuador/a').selectOption('1');
  await pagina.getByLabel('Fecha').fill(fechaCita());
  await pagina.locator('#c-hora option[value="11:00"]').waitFor({ state: 'attached' });
  ok('las horas libres llegan desde ms-reservas');
  await pagina.getByLabel('Horario').selectOption('11:00');
  await pagina.getByLabel('Zona del cuerpo').selectOption('Antebrazo');
  await pagina.getByRole('button', { name: /Pagar ahora/ }).click();
  await pagina.waitForURL(/compra-exitosa/, { timeout: 20000 });
  ok('pago aprobado: página de compra exitosa con la boleta');
  comprobar(await stockCrema() === stockAntes - 1, 'el stock de la crema bajó en ms-catalogo');

  console.log('▶ Reembolso: lo pide el cliente y lo aprueba el administrador');
  await pagina.goto(`${BASE}/perfil`);
  await pagina.getByRole('button', { name: 'Cambiar o reembolsar' }).first().click();
  await pagina.getByLabel('Reembolso').check();
  await pagina.getByLabel('Motivo').selectOption({ index: 1 });
  await pagina.getByLabel('Justificativo').fill('Me surgió un viaje de trabajo esa semana');
  await pagina.getByRole('button', { name: 'Enviar solicitud' }).click();
  await pagina.getByText('Reembolso: Pendiente').waitFor();
  ok('la solicitud quedó en ms-reservas como Pendiente');
  const ordenId = await pagina.evaluate(() => JSON.parse(localStorage.getItem('foreverInk_bd_v7')).ordenes[0].id);

  await pagina.getByTestId('saludo').click();
  await pagina.getByText('Cerrar sesión').click();
  await login('admin.foreverink@gmail.com', 'Admin#123');
  await pagina.goto(`${BASE}/admin/ordenes/${ordenId}`);
  await pagina.getByRole('button', { name: 'Aprobar' }).click();
  await pagina.getByText('La solicitud fue aprobada.').waitFor();
  comprobar(await stockCrema() === stockAntes, 'reembolso aprobado: el stock volvió a bodega');
  await pagina.goto(`${BASE}/admin/ordenes`);
  await pagina.getByText('Reembolsada').first().waitFor();
  ok('la orden aparece Reembolsada en el panel');

  comprobar(errores.length === 0, `sin errores de JavaScript ${errores.join(' | ')}`);
  console.log('✅ Frontend + backend OK');
} catch (e) {
  await pagina.screenshot({ path: 'e2e-error.png', fullPage: true });
  console.log(`  ✘ ${e.message}`);
  process.exitCode = 1;
} finally {
  await navegador.close();
}
