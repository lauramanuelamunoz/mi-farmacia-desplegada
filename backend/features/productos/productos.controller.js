const pool = require('../../config/database');

const getProductos = async (req, res) => {
    try {
        const { search, categoria } = req.query;
        let query = `
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (p.nombre LIKE ? OR p.descripcion LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (categoria) {
            query += ` AND p.categoria_id = ?`;
            params.push(categoria);
        }

        query += ' ORDER BY p.id DESC';
        
        const [result] = await pool.query(query, params);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            `SELECT p.*, c.nombre as categoria_nombre 
             FROM productos p 
             LEFT JOIN categorias c ON p.categoria_id = c.id 
             WHERE p.id = ?`,
            [id]
        );
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProducto = async (req, res) => {
    try {
        const { 
            nombre, 
            descripcion, 
            precio, 
            stock, 
            categoria_id, 
            codigo_barras, 
            fecha_vencimiento 
        } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, codigo_barras, fecha_vencimiento) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion, precio, stock, categoria_id, codigo_barras, fecha_vencimiento]
        );
        
        const [producto] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
        
        res.status(201).json(producto[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El código de barras ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nombre, 
            descripcion, 
            precio, 
            stock, 
            categoria_id, 
            codigo_barras, 
            fecha_vencimiento 
        } = req.body;
        
        await pool.query(
            `UPDATE productos 
             SET nombre = ?, 
                 descripcion = ?, 
                 precio = ?, 
                 stock = ?, 
                 categoria_id = ?, 
                 codigo_barras = ?, 
                 fecha_vencimiento = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [nombre, descripcion, precio, stock, categoria_id, codigo_barras, fecha_vencimiento, id]
        );
        
        const [result] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(result[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El código de barras ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        
        await pool.query(
            'UPDATE productos SET stock = ? WHERE id = ?',
            [stock, id]
        );
        
        const [result] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    actualizarStock
};