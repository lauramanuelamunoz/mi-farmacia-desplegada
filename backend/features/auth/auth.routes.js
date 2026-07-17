const express = require('express');
const router = express.Router();
const { register, login, getPerfil } = require('./auth.controller');
const { verificarToken } = require('./auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', verificarToken, getPerfil);

module.exports = router;
