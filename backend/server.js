const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Compresión
app.use(compression());

// Logging
app.use(morgan('dev'));

// CORS: Permitir orígenes locales y de producción
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  // Agrega aquí la URL de tu frontend en Render/Vercel (ej: 'https://tu-frontend.onrender.com')
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true
}));

// Parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes
app.use('/api/auth', require('./features/auth/auth.routes'));
app.use('/api/usuarios', require('./features/usuarios/usuarios.routes'));
app.use('/api/productos', require('./features/productos/productos.routes'));
app.use('/api/categorias', require('./features/categorias/categorias.routes'));
app.use('/api/ventas', require('./features/ventas/ventas.routes'));

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor solo si no estamos en Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;