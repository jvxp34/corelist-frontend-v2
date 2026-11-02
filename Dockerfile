# Imagem do site: monta com Node e serve com nginx.
# O nginx repassa /api para o backend (API_UPSTREAM), como o proxy do Amplify.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine
ARG VERSAO=local
ENV VERSAO=$VERSAO \
    API_UPSTREAM=https://18-229-44-14.sslip.io
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
