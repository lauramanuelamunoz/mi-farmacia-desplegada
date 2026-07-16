const express = require('express');
const router = express.Router();
const {
    getVentas,
    getVentaById,
    createVenta,
    getEstadisticas
} = require('./ventas.controller');
const { verificarToken, verificarAdmin } = require('../auth/auth.middleware');

router.get('/', verificarToken, verificarAdmin, getVentas);
router.get('/estadisticas', verificarToken, getEstadisticas);
router.get('/:id', verificarToken, verificarAdmin, getVentaById);
router.post('/', verificarToken, createVenta);

module.exports = router;