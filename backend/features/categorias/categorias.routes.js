const express = require('express');
const router = express.Router();
const {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
} = require('./categorias.controller');
const { verificarToken, verificarAdmin } = require('../auth/auth.middleware');

router.get('/', verificarToken, getCategorias);
router.get('/:id', verificarToken, getCategoriaById);
router.post('/', verificarToken, verificarAdmin, createCategoria);
router.put('/:id', verificarToken, verificarAdmin, updateCategoria);
router.delete('/:id', verificarToken, verificarAdmin, deleteCategoria);

module.exports = router;