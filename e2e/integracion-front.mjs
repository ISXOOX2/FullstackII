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
/** RUN válido (dígito verificador módulo 11) a partir de un cuerpo numérico. */
function runConDv(cuerpo) {
  let suma = 0; let m = 2;
  for (const d of String(cuerpo).split('').reverse()) { suma += Number(d) * m; m = m === 7 ? 2 : m + 1; }
  const r = 11 - (suma % 11);
  return `${cuerpo}${r === 11 ? '0' : r === 10 ? 'K' : r}`;
}
const disenosApi = async () => (await fetch(`${CATALOGO}/disenos`)).json();
const conToken = async (url) => {
  const token = await pagina.evaluate(() => JSON.parse(sessionStorage.getItem('foreverInk_sesion')).token);
  return (await fetch(url, { headers: { Authorization: `Bearer ${token}` } })).json();
};
const stockCrema = async () => (await (await fetch(`${CATALOGO}/tienda`)).json()).find((a) => a.id === 8).stock;

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
const errores = [];
let renovaciones = 0;
pagina.on('request', (r) => { if (r.url().includes('/auth/renovar')) renovaciones += 1; });
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
  await pagina.locator('table').getByText('Reembolsada').first().waitFor(); // en la tabla (el filtro también tiene esa opción)
  ok('la orden aparece Reembolsada en el panel');

  console.log('▶ CRUD del panel: diseños (ms-catalogo)');
  await pagina.goto(`${BASE}/admin/productos/nuevo`);
  await pagina.getByLabel('Nombre', { exact: true }).fill('Diseño de prueba E2E');
  await pagina.getByLabel('Estilo (categoría)').selectOption({ index: 1 });
  await pagina.getByLabel('Precio (CLP)').fill('15000');
  await pagina.getByLabel('Ancho (cm)').fill('6');
  await pagina.getByLabel('Alto (cm)').fill('5');
  await pagina.getByLabel('Duración (horas)').fill('1');
  await pagina.getByRole('button', { name: 'Guardar diseño' }).click();
  await pagina.waitForURL(/\/admin\/productos$/);
  const creado = (await disenosApi()).find((d) => d.nombre === 'Diseño de prueba E2E');
  comprobar(creado?.codigo?.startsWith('FI-'), `CREAR (POST): el diseño quedó en la API con código ${creado?.codigo}`);
  await pagina.goto(`${BASE}/admin/productos/${creado.id}/editar`);
  await pagina.getByLabel('Nombre', { exact: true }).fill('Diseño editado E2E');
  await pagina.getByRole('button', { name: 'Guardar diseño' }).click();
  await pagina.waitForURL(/\/admin\/productos$/);
  comprobar((await disenosApi()).some((d) => d.id === creado.id && d.nombre === 'Diseño editado E2E'), 'EDITAR (PUT): el cambio quedó en la API');
  await pagina.locator('tr', { hasText: 'Diseño editado E2E' }).getByRole('button', { name: 'Eliminar' }).click();
  await pagina.getByRole('dialog').getByRole('button', { name: 'Eliminar' }).click();
  await pagina.locator('tr', { hasText: 'Diseño editado E2E' }).waitFor({ state: 'detached' });
  comprobar(!(await disenosApi()).some((d) => d.id === creado.id), 'ELIMINAR (DELETE): el diseño ya no está en la API');

  console.log('▶ CRUD del panel: insumos (ms-catalogo) y usuarios (ms-usuarios)');
  await pagina.goto(`${BASE}/admin/insumos`);
  await pagina.locator('#i-nombre').fill('Agujas 5RL E2E');
  await pagina.locator('#i-tipo').selectOption('Agujas');
  await pagina.locator('#i-unidad').fill('cajas');
  await pagina.locator('#i-stock').fill('1');
  await pagina.locator('#i-critico').fill('2');
  await pagina.getByRole('button', { name: 'Agregar insumo' }).click();
  await pagina.getByText('«Agujas 5RL E2E» se agregó al inventario.').waitFor();
  const criticos = await conToken(`${CATALOGO}/insumos/criticos`);
  comprobar(criticos.some((i) => i.nombre === 'Agujas 5RL E2E'), 'insumo creado en la API y en stock crítico');

  const run = runConDv(20111222); // en el panel no hay campos de confirmación (solo en el registro)
  await pagina.goto(`${BASE}/admin/usuarios/nuevo`);
  await pagina.getByLabel('RUN').fill(run);
  await pagina.getByLabel('Nombre', { exact: true }).fill('Vale');
  await pagina.getByLabel('Apellidos').fill('Prueba E2E');
  await pagina.getByLabel('Correo electrónico').fill('vale.e2e@gmail.com');
  await pagina.getByLabel('Contraseña', { exact: true }).fill('Clave12');
  await pagina.getByLabel('Fecha de nacimiento').fill('1999-04-10');
  await pagina.getByLabel('Teléfono').fill('+56987654321');
  await pagina.getByLabel('Tipo de usuario').selectOption('Vendedor');
  await pagina.getByLabel('Región').selectOption({ index: 1 });
  await pagina.getByLabel('Comuna').selectOption({ index: 1 });
  await pagina.getByLabel('Dirección').fill('Calle Falsa 123');
  await pagina.getByRole('button', { name: 'Guardar cambios' }).click();
  await pagina.waitForURL(/\/admin\/usuarios$/);
  const usuariosApi = await conToken('http://localhost:8081/api/v1/usuarios');
  comprobar(usuariosApi.some((u) => u.correo === 'vale.e2e@gmail.com' && u.tipo === 'Vendedor'), 'usuario Vendedor creado en ms-usuarios');
  await pagina.locator('tr', { hasText: 'vale.e2e@gmail.com' }).getByRole('button', { name: 'Eliminar' }).click();
  await pagina.getByRole('dialog').getByRole('button', { name: 'Eliminar' }).click();
  await pagina.locator('tr', { hasText: 'vale.e2e@gmail.com' }).waitFor({ state: 'detached' });
  comprobar(!(await conToken('http://localhost:8081/api/v1/usuarios')).some((u) => u.correo === 'vale.e2e@gmail.com'), 'usuario eliminado de ms-usuarios');

  console.log('▶ Renovación del token JWT');
  comprobar(renovaciones > 0, `el front pidió ${renovaciones} renovación(es) del token antes de que venciera`);
  await pagina.evaluate(() => {
    const s = JSON.parse(sessionStorage.getItem('foreverInk_sesion'));
    s.token = `${s.token}x`; // token alterado: la firma ya no calza
    sessionStorage.setItem('foreverInk_sesion', JSON.stringify(s));
  });
  await pagina.goto(`${BASE}/admin`);
  await pagina.getByText('Tu sesión expiró. Vuelve a iniciar sesión.').waitFor();
  ok('con un token alterado el backend responde 401 y el front cierra la sesión');

  comprobar(errores.length === 0, `sin errores de JavaScript ${errores.join(' | ')}`);
  console.log('✅ Frontend + backend OK');
} catch (e) {
  await pagina.screenshot({ path: 'e2e-error.png', fullPage: true });
  console.log(`  ✘ ${e.message.split('\n').slice(0, 8).join('\n    ')}`);
  console.log(`    URL: ${pagina.url()}`);
  console.log(`    Pantalla: ${(await pagina.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400)}`);
  console.log(`    Errores JS: ${errores.join(' | ') || 'ninguno'}`);
  process.exitCode = 1;
} finally {
  await navegador.close();
}
