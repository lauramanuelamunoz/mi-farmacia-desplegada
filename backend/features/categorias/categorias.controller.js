const pool = require('../../config/database');

const getCategorias = async (req, res) => {
    try {
        const [result] = await pool.query(
            `SELECT c.*, COUNT(p.id) as total_productos 
             FROM categorias c 
             LEFT JOIN productos p ON c.id = p.categoria_id 
             GROUP BY c.id 
             ORDER BY c.nombre`
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            'SELECT * FROM categorias WHERE id = ?',
            [id]
        );
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const [result] = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        
        const [categoria] = await pool.query('SELECT * FROM categorias WHERE id = ?', [result.insertId]);
        
        res.status(201).json(categoria[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        
        await pool.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );
        
        const [result] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si tiene productos asociados
        const [check] = await pool.query(
            'SELECT COUNT(*) as total FROM productos WHERE categoria_id = ?',
            [id]
        );
        
        if (parseInt(check[0].total) > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar la categoría porque tiene productos asociados' 
            });
        }
        
        const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};