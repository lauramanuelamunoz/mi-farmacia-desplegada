const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// SEGURIDAD
// ============================================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ============================================
// COMPRESIÓN
// ============================================

app.use(compression());

// ============================================
// LOGGING
// ============================================

app.use(morgan('dev'));

// ============================================
// CORS
// ============================================

const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...envOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin
      // (Postman, Thunder Client, aplicaciones backend, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // En desarrollo permitir cualquier origen
      if (NODE_ENV === 'development') {
        return callback(null, true);
      }

      // En producción validar contra la lista permitida
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error(`Origen no permitido por CORS: ${origin}`);
      error.status = 403;
      error.code = 'CORS_ERROR';

      return callback(error);
    },

    credentials: true,
  })
);

// ============================================
// PARSEO DE PETICIONES
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando',
    name: 'Farmacia API',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// RUTAS DE LA API
// ============================================

app.use('/api/auth', require('./features/auth/auth.routes'));

app.use(
  '/api/usuarios',
  require('./features/usuarios/usuarios.routes')
);

app.use(
  '/api/productos',
  require('./features/productos/productos.routes')
);

app.use(
  '/api/categorias',
  require('./features/categorias/categorias.routes')
);

app.use(
  '/api/ventas',
  require('./features/ventas/ventas.routes')
);

// ============================================
// RUTA NO ENCONTRADA
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `No existe la ruta ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    method: req.method,
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use((err, req, res, next) => {
  console.error('====================================');
  console.error('ERROR DEL SERVIDOR');
  console.error('Método:', req.method);
  console.error('Ruta:', req.originalUrl);
  console.error('Mensaje:', err.message);
  console.error('====================================');

  // ----------------------------------------
  // Error de JSON inválido
  // ----------------------------------------

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      message: 'El cuerpo de la solicitud no tiene un formato JSON válido.',
    });
  }

  // ----------------------------------------
  // Error de CORS
  // ----------------------------------------

  if (err.code === 'CORS_ERROR') {
    return res.status(403).json({
      success: false,
      error: 'CORS_ERROR',
      message: 'El origen de la solicitud no está permitido.',
    });
  }

  // ----------------------------------------
  // Error personalizado
  // ----------------------------------------

  const statusCode = err.status || err.statusCode || 500;

  // ----------------------------------------
  // Error interno
  // ----------------------------------------

  return res.status(statusCode).json({
    success: false,
    error:
      statusCode === 500
        ? 'INTERNAL_SERVER_ERROR'
        : 'SERVER_ERROR',

    message:
      NODE_ENV === 'development'
        ? err.message
        : 'Ocurrió un error en el servidor.',

    ...(NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('');
    console.log('==========================================');
    console.log('        FARMACIA API');
    console.log('==========================================');
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`📊 Ambiente: ${NODE_ENV}`);
    console.log(`❤️  Health:   http://localhost:${PORT}/health`);
    console.log('==========================================');
    console.log('');
  });
}

module.exports = app;