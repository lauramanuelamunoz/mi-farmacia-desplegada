# Despliegue En Railway

## Estructura Recomendada

- `PostgreSQL` en Railway como servicio de base de datos.
- `backend` en Railway como servicio Node.js con `Root Directory = backend`.
- `frontend` en Railway como servicio Node.js/Static con `Root Directory = frontend`.

## Backend

### Root Directory

`backend`

### Build Command

```bash
npm install
```

### Start Command

```bash
npm run start:railway
```

### Variables De Entorno Exactas

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_SSL=true
JWT_SECRET=pon_aqui_una_clave_larga_y_segura
ALLOWED_ORIGINS=https://tu-frontend.up.railway.app,http://localhost:5173,http://localhost:5174
```

### Notas

- `DATABASE_URL` debe salir del servicio PostgreSQL de Railway.
- `ALLOWED_ORIGINS` debe llevar la URL pública real del frontend.
- El comando `npm run start:railway` aplica `database.sql` antes de iniciar el servidor.

## Frontend

### Root Directory

`frontend`

### Build Command

```bash
npm install && npm run build
```

### Start Command

```bash
npm start
```

### Variables De Entorno Exactas

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

### Notas

- Cambia `tu-backend.up.railway.app` por el dominio público real del backend en Railway.
- El script `npm start` sirve el build de Vite en el puerto que Railway inyecta en `PORT`.

## Base De Datos

### Servicio

- Crea un servicio PostgreSQL nuevo dentro de Railway.

### Inicialización

- El backend puede aplicar el esquema automáticamente al arrancar usando `npm run start:railway`.
- Si prefieres ejecutarlo manualmente una sola vez, usa:

```bash
npm run db:apply
```

## Orden Recomendado De Despliegue

1. Crear PostgreSQL en Railway.
2. Desplegar `backend` con sus variables.
3. Verificar `https://tu-backend.up.railway.app/health`.
4. Desplegar `frontend` con `VITE_API_URL` apuntando al backend.
5. Actualizar `ALLOWED_ORIGINS` del backend con la URL final del frontend.
