const express = require('express');
const router = express.Router();
const {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    actualizarStock
} = require('./productos.controller');
const { verificarToken, verificarAdmin } = require('../auth/auth.middleware');

router.get('/', verificarToken, getProductos);
router.get('/:id', verificarToken, getProductoById);
router.post('/', verificarToken, verificarAdmin, createProducto);
router.put('/:id', verificarToken, verificarAdmin, updateProducto);
router.delete('/:id', verificarToken, verificarAdmin, deleteProducto);
router.patch('/:id/stock', verificarToken, verificarAdmin, actualizarStock);

module.exports = router;