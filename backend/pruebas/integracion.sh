#!/usr/bin/env bash
# Prueba de integración de los 4 microservicios (la corre GitHub Actions, y también sirve en tu PC con Git Bash).
# Requisitos: los 4 .jar compilados (mvn package en cada carpeta), curl y jq.
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
for par in usuarios:8081 catalogo:8082 reservas:8083 blog:8084; do
  ms=${par%%:*}; puerto=${par##*:}
  java -jar "ms-$ms/target/ms-$ms-1.0.0.jar" --spring.profiles.active=h2 --server.port="$puerto" > "/tmp/ms-$ms.log" 2>&1 &
done
for p in 8081 8082 8083 8084; do esperar $p; done
ok "los 4 microservicios responden y publican Swagger"

U=http://localhost:8081/api/v1/usuarios; C=http://localhost:8082/api/v1/catalogo
R=http://localhost:8083/api/v1/reservas; BL=http://localhost:8084/api/v1/blog

echo "▶ ms-usuarios: JWT y roles"
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
[[ $(json $C/disenos | jq length) == 25 ]] && ok "25 diseños" || falla "diseños"
[[ $(json $C/tienda | jq length) == 9 ]] && ok "9 artículos en la Tienda" || falla "tienda"
STOCK0=$(json $C/tienda | jq '.[] | select(.id==8) | .stock')
[[ $(codigo -H "Authorization: Bearer $CLIENTE" $C/insumos) == 403 ]] && ok "insumos solo para el administrador" || falla "insumos rol"
NUEVO=$(json -X POST -H "Authorization: Bearer $ADMIN" $C/disenos -d '{"nombre":"Prueba","categoriaId":1,"precio":15000,"anchoCm":5,"altoCm":5}')
[[ $(echo "$NUEVO" | jq -r .codigo) == FI-026 ]] && ok "código automático FI-026" || falla "código automático: $NUEVO"

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

echo "▶ ms-blog: el front lee la lista y ve los artículos nuevos"
[[ $(json $BL | jq length) == 2 ]] && ok "2 artículos iniciales" || falla "blog"
json -X POST -H "Authorization: Bearer $ADMIN" $BL -d '{"titulo":"Nuevo artículo","resumen":"Publicado desde la API","imagen":"cuidados","contenido":[{"tipo":"p","texto":"Hola"}]}' >/dev/null
[[ $(json $BL | jq -r '.[0].titulo') == "Nuevo artículo" ]] && ok "un artículo publicado aparece primero" || falla "publicar artículo"

echo "✅ Integración OK"
