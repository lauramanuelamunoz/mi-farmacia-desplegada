# Farmacia App

## Resumen

Este proyecto es una aplicación de farmacia con backend en Node.js/Express y base de datos PostgreSQL, y frontend en React + Vite. Incluye autenticación, gestión de usuarios, productos, categorías y ventas.

## Estructura del repositorio

- `backend/`: servidor Node.js con API REST.
- `frontend/`: aplicación cliente React con Vite.
- `data_base/`: archivo SQL adicional de la base de datos.
- `RAILWAY_DEPLOY.md`: instrucciones de despliegue para Railway.
- `render.yaml`: configuración para despliegue en Render.

## Requisitos previos

- Node.js 20.x (o compatible)
- npm
- PostgreSQL
- Git

## Configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/<tu-repo>.git
cd proyecto_Farmacia
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `backend/.env` con los valores locales de PostgreSQL y JWT. Por ejemplo:

```env
PORT=5000
NODE_ENV=development

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=tu_contraseña_postgres
PGDATABASE=farmacia_db

JWT_SECRET=una_clave_secreta_segura
```

> Nota: si usas otro usuario, contraseña o nombre de base de datos, actualiza los valores correspondientes.

### 3. Inicializar la base de datos

El backend incluye un script que crea la base de datos si no existe y aplica el esquema definido en `backend/database.sql`.

```bash
cd backend
npm run db:apply
```

### 4. Ejecutar el backend en modo desarrollo

```bash
cd backend
npm run dev
```

El servidor quedará accesible en `http://localhost:5000`.

### 5. Configurar el frontend

```bash
cd frontend
npm install
```

Copiar `frontend/.env.example` a `frontend/.env` y ajustar la URL del backend. Por ejemplo:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Ejecutar el frontend en modo desarrollo

```bash
cd frontend
npm run dev
```

El frontend quedará accesible en `http://localhost:5173` (o el puerto que indique Vite).

## Variables de entorno

### Backend

- `PORT`: puerto del servidor.
- `NODE_ENV`: `development` o `production`.
- `PGHOST`: host de PostgreSQL.
- `PGPORT`: puerto de PostgreSQL.
- `PGUSER`: usuario de PostgreSQL.
- `PGPASSWORD`: contraseña de PostgreSQL.
- `PGDATABASE`: nombre de la base de datos.
- `JWT_SECRET`: clave secreta para firmar tokens JWT.
- `DATABASE_URL` / `DB_URL`: alternativa para conexión en una sola cadena.
- `DB_SSL`: `true` o `false` para habilitar SSL en PostgreSQL.
- `ALLOWED_ORIGINS`: orígenes permitidos por CORS (usado en producción).

### Frontend

- `VITE_API_URL`: URL base de la API REST. Ejemplo: `http://localhost:5000/api`.

## Comandos disponibles

### Backend

- `npm install`: instala dependencias.
- `npm run dev`: inicia el servidor con `nodemon`.
- `npm start`: inicia el servidor con `node server.js`.
- `npm run db:apply`: crea la base de datos y aplica el esquema.
- `npm run start:railway`: aplica el esquema y arranca el servidor (usado en Railway).

### Frontend

- `npm install`: instala dependencias.
- `npm run dev`: inicia Vite en modo desarrollo.
- `npm run build`: genera el build de producción.
- `npm start`: sirve la aplicación build.
- `npm run preview`: ejecuta Vite preview.

## Base de datos

- El archivo principal de esquema es `backend/database.sql`.
- También existe `data_base/database.sql` como referencia adicional.
- El script de inicialización es `backend/scripts/applyDatabase.js`.

## Rutas principales de la API

- `GET /`: estado de la API.
- `GET /health`: health check.
- `POST /api/auth/...`: autenticación.
- `GET/POST/PUT/DELETE /api/usuarios`: gestión de usuarios.
- `GET/POST/PUT/DELETE /api/productos`: gestión de productos.
- `GET/POST/PUT/DELETE /api/categorias`: gestión de categorías.
- `GET/POST/PUT/DELETE /api/ventas`: gestión de ventas.

## Despliegue

### Railway

- `backend` como servicio Node.js con `Root Directory = backend`.
- `frontend` como servicio estático con `Root Directory = frontend`.
- Usar `RAILWAY_DEPLOY.md` para variables y comandos recomendados.

### Render

- `render.yaml` ya contiene la configuración para backend y frontend.
- El backend usa variables de servicio y base de datos gestionadas por Render.

## Notas adicionales

- El frontend usa React, Vite, Tailwind y Axios.
- El backend usa Express, JWT, PostgreSQL y seguridad básica con Helmet y CORS.
- En desarrollo, CORS está abierto para `localhost`.

---

Con esto tendrás un README técnico completo para clonar, configurar y ejecutar el proyecto localmente y para despliegue.
