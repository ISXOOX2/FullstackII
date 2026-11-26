# Despliegue en AWS (EC2) con un solo link

Todo el proyecto queda en **una instancia EC2** y se abre con **un solo link**: `http://IP-PUBLICA`.

```
Navegador ──► http://IP-PUBLICA (puerto 80)
                 │
              Nginx (contenedor "frontend")
                 ├── /                 → React compilado (dist)
                 ├── /api/v1/usuarios  → ms-auth     :8081 ─┐
                 ├── /api/v1/catalogo  → ms-catalogo :8082 ─┼──► MySQL 8 (una base por microservicio,
                 ├── /api/v1/blog      → ms-catalogo :8082  │      tablas creadas por Flyway)
                 ├── /api/v1/reservas  → ms-reservas :8083 ─┘
                 └── /docs/<ms>/swagger-ui.html → Swagger de cada microservicio
```

`docker-compose.yml` (en la raíz) levanta los 6 contenedores. GitHub Actions ya prueba exactamente esto en
cada cambio (job `despliegue-docker`), así que si el CI está en verde, en EC2 debería funcionar igual.

---

## 1. Crear la instancia

En la consola de AWS (o en el Learner Lab de AWS Academy) → **EC2 → Launch instance**:

| Opción | Valor |
|---|---|
| Nombre | `forever-ink` |
| AMI | **Amazon Linux 2023** |
| Tipo | **t3.medium** o **t3.small** si el lab lo permite. Con **t2.micro** (1 GB) también funciona, pero hay que crear swap (paso 3.4) y la primera compilación tarda más. |
| Par de claves | Crea uno nuevo (`forever-ink.pem`) y guárdalo bien |
| Grupo de seguridad | Abre **22 (SSH)** solo para tu IP y **80 (HTTP)** para todo el mundo (`0.0.0.0/0`) |
| Almacenamiento | 20 GB |

> Ya no hace falta abrir los puertos 3000, 8081… : Nginx recibe todo por el 80.

## 2. Conectarse

```bash
ssh -i "forever-ink.pem" ec2-user@TU-IP-PUBLICA
```

En Windows, si dice que la clave es "too open": clic derecho en el `.pem` → Propiedades → Seguridad →
Opciones avanzadas → deja solo a tu usuario con permiso de lectura.

## 3. Preparar la instancia (una sola vez)

### 3.1 Actualizar e instalar Docker y Git

```bash
sudo dnf update -y
sudo dnf install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```

### 3.2 Instalar Docker Compose y Buildx (plugins)

```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo curl -SL https://github.com/docker/buildx/releases/download/v0.17.1/buildx-v0.17.1.linux-amd64 \
  -o /usr/local/lib/docker/cli-plugins/docker-buildx
sudo chmod +x /usr/local/lib/docker/cli-plugins/*
```

### 3.3 Salir y volver a entrar

`exit` y vuelve a conectarte con `ssh` (así el usuario queda en el grupo docker). Comprueba:

```bash
docker compose version
```

### 3.4 Solo en t2.micro: crear 2 GB de swap

```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

## 4. Descargar el proyecto y configurar

```bash
git clone https://github.com/ISXOOX2/Forever_Ink.git
cd Forever_Ink
git clone https://github.com/ISXOOX2/Forever_Ink_Backend.git backend
cp despliegue/.env.example .env
nano .env
```

En `.env` cambia:

- `DB_PASSWORD`: una clave para MySQL.
- `JWT_SECRETO`: una frase larga (32 caracteres o más).
- `ADMIN_PASSWORD` y `VENDEDOR_PASSWORD`: las contraseñas del administrador y del vendedor (de 4 a 10
  caracteres, con letras y números). Son obligatorias: las de ejemplo del repositorio son públicas.
- `CORS_ORIGENES`: `http://TU-IP-PUBLICA`.

Guarda con `Ctrl + O`, `Enter` y sal con `Ctrl + X`.

## 5. Levantar todo

```bash
docker compose up -d --build
```

La primera vez tarda (descarga imágenes y compila con Maven y Vite): unos 5 minutos en t3.medium y hasta 15
en t2.micro. Para ver el avance:

```bash
docker compose ps          # los 6 contenedores deben decir "running" (mysql: "healthy")
docker compose logs -f ms-reservas   # Ctrl + C para salir
```

## 6. Abrir el sitio

| Qué | Link |
|---|---|
| **Sitio (el link único)** | `http://TU-IP-PUBLICA` |
| Swagger auth | `http://TU-IP-PUBLICA/docs/auth/swagger-ui.html` |
| Swagger catálogo | `http://TU-IP-PUBLICA/docs/catalogo/swagger-ui.html` |
| Swagger reservas | `http://TU-IP-PUBLICA/docs/reservas/swagger-ui.html` |

Para probar en Swagger una ruta protegida: ejecuta `POST /api/v1/usuarios/auth/login` con
`{"correo": "admin.foreverink@gmail.com", "password": "<tu ADMIN_PASSWORD>"}`, copia el `token`, presiona
**Authorize** y pégalo.

## 7. Actualizar después de un cambio

```bash
cd ~/Forever_Ink
git pull
git -C backend pull
docker compose up -d --build
```

Los datos de MySQL se mantienen (volumen `datos-mysql`). Para partir de cero con los datos de ejemplo:
`docker compose down -v && docker compose up -d --build`.

## 8. AWS Academy (Learner Lab)

- Al terminar la sesión del lab la instancia se **detiene** y, al volver a iniciarla, la **IP pública cambia**.
  Para tener siempre el mismo link, asigna una **Elastic IP** (EC2 → Elastic IPs → Allocate → Associate).
- Al iniciar de nuevo la instancia, Docker vuelve a levantar los contenedores solo (`restart: unless-stopped`).
- Cuando ya no la uses: Instance state → **Terminate** (se borran los datos).

## 9. Problemas comunes

| Síntoma | Qué hacer |
|---|---|
| El sitio no carga | Revisa que el grupo de seguridad tenga el puerto 80 abierto y usa `http://` (no `https://`). |
| "No pudimos conectar con el servidor" | `docker compose ps`: algún microservicio no está "running". Mira su log con `docker compose logs ms-...`. |
| Un microservicio se reinicia solo | Falta memoria: usa t3.small o t3.medium, o crea el swap del paso 3.4. |
| La compilación se corta | Vuelve a ejecutar `docker compose up -d --build` (retoma donde quedó). |
| Cambió la IP | Actualiza `CORS_ORIGENES` en `.env` y ejecuta `docker compose up -d`. |
