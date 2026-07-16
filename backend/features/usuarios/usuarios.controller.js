const pool = require('../../config/database');
const bcrypt = require('bcrypt');

const getUsuarios = async (req, res) => {
    try {
        const [result] = await pool.query(
            'SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY id DESC'
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?',
            [id]
        );
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, rol || 'usuario']
        );
        
        const [usuario] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [result.insertId]);
        
        res.status(201).json(usuario[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        res.status(500).json({ error: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;
        
        await pool.query(
            'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
            [nombre, email, rol, id]
        );
        
        const [result] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que no sea el propio usuario
        if (req.usuario.id === parseInt(id)) {
            return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
        }
        
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};