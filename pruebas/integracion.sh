#!/usr/bin/env bash
# Prueba de integración de los 3 microservicios (la corre GitHub Actions, y también sirve en tu PC con Git Bash).
# Requisitos: los 3 .jar compilados (mvn package en cada carpeta), curl y jq.
# Levanta todo con H2 en memoria y recorre el flujo principal llamando a la API como lo haría el frontend.
set -euo pipefail
cd "$(dirname "$0")/.."

ok()   { echo "  ✔ $1"; }
falla(){ echo "  ✘ $1"; for f in /tmp/ms-*.log; do echo "== $f"; tail -40 "$f"; done; exit 1; }
esperar() { for _ in $(seq 1 90); do curl -sf "http://localhost:$1/v3/api-docs" >/dev/null && return 0; sleep 2; done; falla "ms en puerto $1 no arrancó"; }
json() { curl -s -H 'Content-Type: application/json' "$@"; }
codigo() { curl -s -o /dev/null -w '%{http_code}' -H 'Content-Type: application/json' "$@"; }

echo "▶ Levantando microservicios (perfil h2)"
export CATALOGO_URL=http://localhost:8082/api/v1/catalogo
for par in auth:8081 catalogo:8082 reservas:8083; do
  ms=${par%%:*}; puerto=${par##*:}
  java -jar "ms-$ms/target/ms-$ms-1.0.0.jar" --spring.profiles.active=h2 --server.port="$puerto" > "/tmp/ms-$ms.log" 2>&1 &
done
for p in 8081 8082 8083; do esperar $p; done
ok "los 3 microservicios responden y publican Swagger (Flyway creó las tablas)"

U=http://localhost:8081/api/v1/usuarios; C=http://localhost:8082/api/v1/catalogo
R=http://localhost:8083/api/v1/reservas; BL=http://localhost:8082/api/v1/blog

echo "▶ ms-auth: JWT y roles"
ADMIN=$(json -X POST $U/auth/login -d '{"correo":"admin.foreverink@gmail.com","password":"Admin#123"}' | jq -r .token)
CLIENTE=$(json -X POST $U/auth/login -d '{"correo":"cliente.demo@gmail.com","password":"Cliente#1"}' | jq -r .token)
[[ $ADMIN == ey* && $CLIENTE == ey* ]] && ok "login de administrador y cliente devuelve token" || falla "login"
[[ $(codigo -X POST $U/auth/login -d '{"correo":"admin.foreverink@gmail.com","password":"mala1"}') == 401 ]] && ok "contraseña incorrecta: 401" || falla "login incorrecto"
[[ $(codigo $U) == 401 ]] && ok "sin token: 401" || falla "sin token"
NUEVO_TOKEN=$(json -X POST -H "Authorization: Bearer $CLIENTE" $U/auth/renovar | jq -r .token)
[[ $NUEVO_TOKEN == ey* && $(codigo -H "Authorization: Bearer $NUEVO_TOKEN" $U/yo) == 200 ]] && ok "renovación: el token nuevo funciona" || falla "renovar token"
[[ $(codigo -X POST $U/auth/renovar) == 401 ]] && ok "renovar sin token: 401" || falla "renovar sin token"
[[ $(codigo -X POST -H "Authorization: Bearer ${CLIENTE}x" $U/auth/renovar) == 401 ]] && ok "token alterado: 401" || falla "token alterado"
[[ $(codigo -H "Authorization: Bearer $CLIENTE" $U) == 403 ]] && ok "cliente no puede listar usuarios: 403" || falla "rol cliente"
[[ $(json -H "Authorization: Bearer $ADMIN" $U | jq length) -ge 3 ]] && ok "administrador lista usuarios" || falla "listar usuarios"
MENOR=$(date -d '-15 years' +%F)
RESP=$(json -X POST $U/auth/registro -d "{\"run\":\"111111111\",\"nombre\":\"Ana\",\"apellidos\":\"Pérez\",\"correo\":\"ana.menor@gmail.com\",\"password\":\"Clave12\",\"fechaNacimiento\":\"$MENOR\",\"telefono\":\"+56911112222\",\"direccion\":\"Calle 1\"}")
[[ $(echo "$RESP" | jq -r .mensaje) == *"18"* ]] && ok "registro de menor de 18 rechazado" || falla "menor de edad: $RESP"

echo "▶ ms-catalogo: diseños, tienda e insumos"
[[ $(json $C/disenos | jq length) == 30 ]] && ok "30 diseños" || falla "diseños"
[[ $(json $C/tienda | jq length) == 9 ]] && ok "9 artículos en la Tienda" || falla "tienda"
STOCK0=$(json $C/tienda | jq '.[] | select(.id==8) | .stock')
[[ $(codigo -H "Authorization: Bearer $CLIENTE" $C/insumos) == 403 ]] && ok "insumos solo para el administrador" || falla "insumos rol"
NUEVO=$(json -X POST -H "Authorization: Bearer $ADMIN" $C/disenos -d '{"nombre":"Prueba","categoriaId":1,"precio":15000,"anchoCm":5,"altoCm":5}')
[[ $(echo "$NUEVO" | jq -r .codigo) == FI-031 ]] && ok "código automático FI-031" || falla "código automático: $NUEVO"

echo "▶ ms-reservas: compra con cita + producto, pago, stock y reembolso"
FECHA=$(for d in $(seq 4 12); do f=$(date -d "+$d days" +%F); [[ $(date -d "$f" +%u) -ge 2 && $(date -d "$f" +%u) -le 6 ]] && echo $f && break; done)
ORDEN=$(json -X POST -H "Authorization: Bearer $CLIENTE" $R -d "{\"nombre\":\"Cliente\",\"apellidos\":\"Demo\",\"correo\":\"cliente.demo@gmail.com\",\"telefono\":\"+56912345678\",\"citaFecha\":\"$FECHA\",\"citaHora\":\"11:00\",\"tatuadorId\":1,\"zonaCuerpo\":\"Antebrazo\",\"items\":[{\"tipo\":\"diseno\",\"productoId\":1,\"cantidad\":1,\"anchoCm\":7,\"altoCm\":6},{\"tipo\":\"articulo\",\"articuloId\":8,\"cantidad\":2,\"precio\":1}]}")
ID=$(echo "$ORDEN" | jq -r .id)
[[ $(echo "$ORDEN" | jq -r .estado) == Pendiente ]] && ok "orden creada (Pendiente)" || falla "crear orden: $ORDEN"
[[ $(echo "$ORDEN" | jq -r .total) == $((12000 + 2 * 8990)) ]] && ok "total calculado con precios del catálogo (el cliente no puede cambiarlos)" || falla "total: $ORDEN"
PAGO=$(json -X POST -H "Authorization: Bearer $CLIENTE" $R/$ID/pago -d '{"aprobado":true}')
[[ $(echo "$PAGO" | jq -r .estado) == Pagada ]] && ok "pago aprobado" || falla "pago: $PAGO"
[[ $(json $C/tienda | jq '.[] | select(.id==8) | .stock') == $((STOCK0 - 2)) ]] && ok "ms-reservas descontó el stock en ms-catalogo" || falla "descuento de stock"
json "$R/horas?fecha=$FECHA&tatuadorId=1" | jq -e 'index("11:00") == null' >/dev/null && ok "la hora pagada queda ocupada" || falla "horas"
OTRA=$(json -X POST -H "Authorization: Bearer $ADMIN" $R -d "{\"nombre\":\"A\",\"apellidos\":\"B\",\"correo\":\"a@gmail.com\",\"telefono\":\"+56912345678\",\"citaFecha\":\"$FECHA\",\"citaHora\":\"11:00\",\"tatuadorId\":1,\"zonaCuerpo\":\"Pie\",\"items\":[{\"tipo\":\"diseno\",\"productoId\":2,\"cantidad\":1}]}")
[[ $(echo "$OTRA" | jq -r .mensaje) == *"reservada"* ]] && ok "no se puede reservar una hora ocupada" || falla "hora ocupada: $OTRA"
SOL=$(json -X POST -H "Authorization: Bearer $CLIENTE" $R/$ID/solicitudes -d '{"tipo":"reembolso","motivo":"Me arrepentí de la compra","justificativo":"Cambié de planes ese fin de semana"}')
SID=$(echo "$SOL" | jq -r .id)
[[ $(echo "$SOL" | jq -r .estado) == Pendiente ]] && ok "solicitud de reembolso enviada" || falla "solicitud: $SOL"
[[ $(codigo -X PUT -H "Authorization: Bearer $CLIENTE" $R/$ID/solicitudes/$SID -d '{"aprobada":true}') == 403 ]] && ok "el cliente no puede aprobarla" || falla "aprobar como cliente"
RESP=$(json -X PUT -H "Authorization: Bearer $ADMIN" $R/$ID/solicitudes/$SID -d '{"aprobada":true,"respuesta":"Devolución en 5 días hábiles"}')
[[ $(echo "$RESP" | jq -r .orden.estado) == Reembolsada ]] && ok "administrador aprueba: orden Reembolsada" || falla "responder: $RESP"
[[ $(json $C/tienda | jq '.[] | select(.id==8) | .stock') == "$STOCK0" ]] && ok "el stock volvió a bodega" || falla "reponer stock"
[[ $(json -X PUT -H "Authorization: Bearer $ADMIN" $R/$ID/estado -d '{"estado":"Pagada","motivo":"Prueba de transición"}' | jq -r .mensaje) == *"no puede pasar"* ]] && ok "Reembolsada es un estado final" || falla "transiciones"
[[ $(json -H "Authorization: Bearer $ADMIN" $R/agenda | jq length) == 3 ]] && ok "alerta de agenda de los 3 tatuadores" || falla "agenda"

echo "▶ Reseñas (ms-catalogo), Mi proyecto y contacto (ms-reservas)"
[[ $(json $C/resenas | jq length) == 4 ]] && ok "4 reseñas de ejemplo, públicas" || falla "listar reseñas"
FOTO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
MIA=$(json -X PUT -H "Authorization: Bearer $CLIENTE" $C/resenas/mia -d "{\"nombre\":\"Cliente D.\",\"estrellas\":5,\"comentario\":\"Excelente atención en el estudio\",\"imagen\":\"$FOTO\"}")
[[ $(echo "$MIA" | jq -r .estrellas) == 5 && $(json $C/resenas | jq length) == 5 ]] && ok "el cliente publica su reseña con foto" || falla "publicar reseña: $MIA"
json -X PUT -H "Authorization: Bearer $CLIENTE" $C/resenas/mia -d '{"nombre":"Cliente D.","estrellas":4,"comentario":"Cambié de opinión, igual muy bien"}' >/dev/null
[[ $(json $C/resenas | jq length) == 5 && $(json $C/resenas | jq '[.[] | select(.estrellas==4 and .nombre=="Cliente D.")] | length') == 1 ]] && ok "volver a opinar actualiza la misma reseña (una por cliente)" || falla "actualizar reseña"
[[ $(codigo -X PUT $C/resenas/mia -d '{"nombre":"X","estrellas":5,"comentario":"sin sesión no debería"}') == 401 ]] && ok "reseña sin sesión: 401" || falla "reseña sin sesión"
[[ $(codigo -X PUT -H "Authorization: Bearer $CLIENTE" $C/resenas/mia -d '{"nombre":"X","estrellas":9,"comentario":"nueve estrellas"}') == 400 ]] && ok "9 estrellas: 400" || falla "validar estrellas"
[[ $(codigo -X PUT -H "Authorization: Bearer $CLIENTE" $C/resenas/mia -d '{"nombre":"X","estrellas":5,"comentario":"imagen falsa aquí","imagen":"javascript:alert(1)"}') == 400 ]] && ok "imagen que no es JPG/PNG/WEBP: 400" || falla "validar imagen"
RID=$(json $C/resenas | jq '.[0].id')
[[ $(codigo -X DELETE -H "Authorization: Bearer $CLIENTE" $C/resenas/$RID) == 403 ]] && ok "un cliente no puede borrar reseñas: 403" || falla "borrar reseña cliente"
[[ $(codigo -X DELETE -H "Authorization: Bearer $ADMIN" $C/resenas/$RID) == 204 ]] && ok "el administrador borra una reseña" || falla "borrar reseña admin"

PROY=$(json -X POST $R/proyectos -d "{\"nombre\":\"Visita Sin Cuenta\",\"correo\":\"visita@gmail.com\",\"zonaCuerpo\":\"Muñeca\",\"lado\":\"Izquierdo\",\"idea\":\"Una luna pequeña con estrellas finas alrededor\",\"imagen\":\"$FOTO\"}")
[[ $(echo "$PROY" | jq -r .estado) == Nuevo && $(echo "$PROY" | jq -r .contactarAntesDe) > $(echo "$PROY" | jq -r .fecha) ]] && ok "Mi proyecto sin cuenta: estado Nuevo y plazo calculado por el servidor" || falla "crear proyecto: $PROY"
[[ $(codigo -X POST $R/proyectos -d '{"nombre":"A","correo":"no-es-correo","zonaCuerpo":"Pie","idea":"corta"}') == 400 ]] && ok "proyecto con datos inválidos: 400" || falla "validar proyecto"
[[ $(codigo -H "Authorization: Bearer $CLIENTE" $R/proyectos) == 403 ]] && ok "un cliente no puede ver los proyectos de otros: 403" || falla "proyectos rol"
PID=$(echo "$PROY" | jq -r .id)
[[ $(json -X PUT -H "Authorization: Bearer $ADMIN" $R/proyectos/$PID/estado -d '{"estado":"Contactado"}' | jq -r .estado) == Contactado ]] && ok "el personal cambia el estado del proyecto" || falla "estado proyecto"
[[ $(json -H "Authorization: Bearer $ADMIN" $R/proyectos | jq -r '.[0].imagen') == "$FOTO" ]] && ok "el administrador ve la imagen enviada" || falla "imagen del proyecto"
[[ $(codigo -X POST $R/mensajes -d '{"nombre":"Visita","correo":"visita@gmail.com","comentario":"¿Atienden los domingos?"}') == 201 ]] && ok "mensaje de contacto sin cuenta" || falla "enviar mensaje"
[[ $(codigo $R/mensajes) == 401 && $(json -H "Authorization: Bearer $ADMIN" $R/mensajes | jq length) == 1 ]] && ok "los mensajes solo los lee el personal" || falla "listar mensajes"

echo "▶ Blog (en ms-catalogo): el front lee la lista y ve los artículos nuevos"
[[ $(json $BL | jq length) == 2 ]] && ok "2 artículos iniciales" || falla "blog"
json -X POST -H "Authorization: Bearer $ADMIN" $BL -d '{"titulo":"Nuevo artículo","resumen":"Publicado desde la API","imagen":"cuidados","contenido":[{"tipo":"p","texto":"Hola"}]}' >/dev/null
[[ $(json $BL | jq -r '.[0].titulo') == "Nuevo artículo" ]] && ok "un artículo publicado aparece primero" || falla "publicar artículo"

echo "▶ Buenas prácticas: ResponseEntity, Flyway y manejo global de errores"
[[ $(json $C/tatuadores | jq length) == 3 ]] && ok "Flyway V2 insertó los 3 tatuadores" || falla "seed de tatuadores"
[[ $(codigo -X POST -H "Authorization: Bearer $ADMIN" $C/categorias -d '{"nombre":"Prueba 201"}') == 201 ]] && ok "crear devuelve 201 Created" || falla "201"
[[ $(codigo $C/disenos/99999) == 404 && $(json $C/disenos/99999 | jq -r .mensaje) != null ]] && ok "recurso inexistente: 404 con { mensaje }" || falla "404"
[[ $(codigo $C/disenos/abc) == 400 ]] && ok "parámetro inválido: 400" || falla "parámetro inválido"
[[ $(json $C/disenos/1 | jq 'has("imagenes") and has("codigo")') == true ]] && ok "las respuestas son DTOs con los mismos campos que usa el front" || falla "DTO"
[[ $(json -H "Authorization: Bearer $ADMIN" $C/insumos | jq '.[0] | has("aLaVenta")') == true ]] && ok "InsumoRespuesta mantiene el campo aLaVenta" || falla "aLaVenta"

echo "✅ Integración OK"
