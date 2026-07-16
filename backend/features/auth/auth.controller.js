const pool = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );
        
        // Obtener el usuario creado
        const [usuario] = await pool.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [result.insertId]);
        
        res.status(201).json(usuario[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [result] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (result.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const usuario = result[0];
        const validPassword = await bcrypt.compare(password, usuario.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };