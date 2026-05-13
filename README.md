# Innovatech Chile — Frontend (marca Lumina Retail)

## Contexto del caso

**Innovatech Chile** avanza a la **etapa 2** del proyecto: el equipo debe **desplegar la aplicación de una de las marcas** de la empresa sobre la **infraestructura construida en la Evaluación Parcial N° 1** (por ejemplo VPC, subredes públicas/privadas, EC2 y grupos de seguridad según tu laboratorio).

Este repositorio contiene la **capa web** de la marca **Lumina Retail** (nombre de ejemplo; sustitúyelo si tu enunciado define otra marca). La imagen Docker (Node → Nginx) es la que se publica en **Amazon ECR** y se ejecuta en **EC2** de cara a Internet, consumiendo la API del backend vía `VITE_API_BASE_URL`.

> **Requerimientos técnicos:** completa la checklist de tu PDF oficial (la lista que sigue a “requerimientos técnicos” en el enunciado) y cruza cada ítem con lo documentado en este README y con las capturas de evidencia.

**Diseño UI:** la hoja de estilos y la composición de pantalla siguen el mismo lenguaje visual que el ejemplo **`ejemplos y guias/paso03-appGithubActions/alumnos-web`** (variables `--primary`, `--surface`, layout `app-wrapper`, tarjetas `card`, barra de estadísticas `stats-bar`, tabla con `badge`, alertas y spinner).

Aplicación **React + Vite + TypeScript** servida con **Nginx** en contenedor (multi-stage).

## Qué hace este paso

1. **`npm run build`** genera la carpeta `dist/` con HTML/JS/CSS estáticos.
2. El **Dockerfile** copia `dist` a la imagen **nginx:stable-alpine** (imagen pequeña, solo runtime).
3. **`nginx.conf`** sirve la SPA (`try_files` → `index.html`) y expone **`/health`** en texto plano para probes.
4. **`docker-compose.yml`** levanta el contenedor en el puerto **80**.

## Requisitos locales

- Node.js 20+
- Docker (opcional, para imagen)

## Desarrollo

```powershell
npm install
npm run dev
```

## Build de producción (sin Docker)

```powershell
npm run build
npm run preview
```

## Docker (local)

```powershell
docker compose build --no-cache
docker compose up -d
```

Abre `http://localhost:80` (o `http://localhost`).

### API del backend desde el navegador

El front llama a `VITE_API_BASE_URL` en tiempo de **build**. En Docker Compose puedes pasar build-arg vía variable de entorno:

```powershell
$env:VITE_API_BASE_URL="http://localhost:8080"
docker compose build --no-cache
docker compose up -d
```

En **EC2**, usa la URL pública o privada del balanceador / instancia backend según tu red (y CORS en el backend ya permite orígenes `*` para la demo).

## CI/CD — GitHub Actions

Workflow: `.github/workflows/cicd-frontend.yml`

- Se dispara con **push** a la rama **`deploy`**.
- Construye la imagen, hace login a **Amazon ECR** y publica **`frontend:v1.0.<run_number>`** y **`latest`**.

### Secretos en GitHub (Settings → Secrets)

| Secreto | Descripción |
|---------|-------------|
| `AWS_ACCESS_KEY_ID` | Clave IAM con permisos ECR (mínimo: push/pull en el repo). |
| `AWS_SECRET_ACCESS_KEY` | Secreto asociado. |
| `AWS_REGION` | Ej. `us-east-1`. |
| `ECR_REGISTRY` | URI **sin** path de repo: `123456789012.dkr.ecr.us-east-1.amazonaws.com`. |

### Rama `deploy`

```powershell
git checkout -b deploy
git push -u origin deploy
```

## ECR + EC2 (resumen operativo)

1. Crear repositorio **`frontend`** en ECR (misma región que los secretos).
2. Tras un pipeline verde, en la **EC2 pública** (con Docker y plugin Compose v2):

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_REGISTRY>
docker pull <ECR_REGISTRY>/frontend:latest
docker rm -f frontend 2>/dev/null || true
docker run -d --name frontend -p 80:80 <ECR_REGISTRY>/frontend:latest
```

*(Para producción suele usarse `docker compose` con un `docker-compose.ec2.yml` que apunte a la URI de ECR; el curso avanzado usa **SSM** desde el pipeline para no abrir SSH.)*

## Arquitectura (EP02)

```text
Internet → EC2 (subnet pública) :80 → contenedor Nginx → estáticos Vite
```

## Troubleshooting

| Problema | Qué revisar |
|----------|-------------|
| Pantalla en blanco | Consola del navegador; rutas SPA requieren `nginx.conf` con `try_files`. |
| No llega al API | `VITE_API_BASE_URL` debe haberse inyectado en **build** del front; CORS y SG (8080 solo desde front o red correcta). |
| `docker login` falla | Región, reloj del sistema, permisos IAM `ecr:GetAuthorizationToken`. |
