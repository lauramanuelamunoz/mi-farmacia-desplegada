const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('./usuarios.controller');
const { verificarToken, verificarAdmin } = require('../auth/auth.middleware');

router.get('/', verificarToken, verificarAdmin, getUsuarios);
router.get('/:id', verificarToken, verificarAdmin, getUsuarioById);
router.post('/', verificarToken, verificarAdmin, createUsuario);
router.put('/:id', verificarToken, verificarAdmin, updateUsuario);
router.delete('/:id', verificarToken, verificarAdmin, deleteUsuario);

module.exports = router;