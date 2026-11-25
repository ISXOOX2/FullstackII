# Presentación EFT · Forever Ink (1 a 2 minutos)

## Guion (≈ 1 min 45 s leyendo con calma)

> **(Inicio, en el Home con la animación)**
> Somos Forever Ink, un estudio de tatuajes con estética manga. El problema que resolvemos es simple:
> el cliente no compra un producto, **reserva una hora**. Por eso nuestra tienda vende reservas: eliges un
> diseño, tu tatuador, la fecha y la hora, y pagas en línea. Si ya tienes tu propia idea, la envías en
> **Mi proyecto** con una imagen y te contactamos en tres días hábiles.
>
> **(Tienda y blog)**
> Además vendemos productos de cuidado y gift cards, que sí tienen stock. El blog se actualiza solo desde
> la API.
>
> **(Compra en vivo)**
> Al pagar, el sistema valida que la hora siga libre, ocupa la hora del tatuador y descuenta el stock.
> Si el cliente se arrepiente, pide el reembolso desde su perfil con un justificativo, y el administrador lo
> aprueba en el panel.
>
> **(Panel)**
> El administrador ve alertas de stock crítico y de tatuadores con pocas horas libres, cambia estados con
> historial, y el vendedor solo ve órdenes y productos.
>
> **(Arquitectura, una diapositiva o el Swagger)**
> Por dentro: React con Vite y Bootstrap, y **cuatro microservicios en Spring Boot**: usuarios, catálogo,
> reservas y blog. Cada uno tiene su base MySQL y su documentación Swagger, y la seguridad usa JWT con roles.
> Todo corre en **AWS EC2 con Docker** detrás de Nginx, en un solo link. Y cada cambio que subimos a GitHub
> se prueba automáticamente.
>
> Gracias, quedamos atentos a sus preguntas.

## Orden de la demostración (para no perderse)

1. **Home**: deja que se vea la animación de entrada (GSAP) y baja con el scroll.
2. **Tienda**: muestra la etiqueta "¡Quedan solo…!" de un producto en stock crítico.
3. **Blog**: muestra el texto "Se actualiza solo cada 30 segundos".
4. Inicia sesión como **cliente** (`cliente.demo@gmail.com` / `Cliente#1`). Agrega un diseño y una crema, y
   paga eligiendo tatuador, fecha y hora. Abre la boleta.
5. Ve a **Mi perfil**, abre "Cambiar o reembolsar" y pide el reembolso.
6. Cierra sesión y entra como **admin** (`admin.foreverink@gmail.com` / `Admin#123`). Muestra el Dashboard con
   las alertas, abre la orden y aprueba el reembolso.
7. Abre un **Swagger**: `http://IP/docs/reservas/swagger-ui.html`.

## Preguntas probables y respuesta corta

| Pregunta | Respuesta |
|---|---|
| ¿Por qué microservicios? | Cada parte del negocio (usuarios, catálogo, reservas, blog) se despliega y escala por separado y tiene su propia base de datos. |
| ¿Cómo se comunican? | El front llama a cada uno con axios (una instancia por microservicio). ms-reservas le pide a ms-catalogo los precios reales y que descuente o reponga stock (RestClient). |
| ¿Cómo funciona la seguridad? | ms-usuarios entrega un token JWT al iniciar sesión. El interceptor de axios lo envía en cada petición y cada microservicio lo verifica y revisa el rol con `@PreAuthorize`. Las contraseñas se guardan con BCrypt. |
| ¿Por qué el precio no lo manda el front? | Porque se podría modificar desde el navegador: el backend lo toma siempre del catálogo. |
| ¿Cómo se despliega? | Docker Compose en EC2: MySQL, los 4 microservicios y Nginx, que sirve el front y redirige `/api/v1/...` a cada servicio. Ver `despliegue/GUIA_AWS.md`. |
| ¿Por qué springdoc y no springfox? | springfox (el de la guía 3.1.2) no es compatible con Spring Boot 3; springdoc es su reemplazo y genera el mismo Swagger UI. |
| ¿Cómo se actualiza el blog? | El hook `useArticulos` vuelve a pedir los artículos cada 30 segundos con `setInterval` dentro de un `useEffect`, y limpia el intervalo al salir. |
| ¿Dónde está la animación? | En `Home.jsx`: `useGSAP` con una timeline, `ScrollTrigger` y `stagger`, como en la clase de GSAP. |
