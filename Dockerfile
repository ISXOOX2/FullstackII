# Frontend: 1) compila React con Vite  2) lo sirve Nginx junto con el proxy a los microservicios
FROM node:22-alpine AS compilacion
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Con Nginx en el mismo dominio, las rutas relativas /api/v1/... de api.js funcionan solas
ENV VITE_USAR_API=true
RUN npm run build

FROM nginx:1.27-alpine
COPY despliegue/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compilacion /app/dist /usr/share/nginx/html
EXPOSE 80
