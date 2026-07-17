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
            const searchParamIndex = params.length + 1;
            query += ` AND (p.nombre ILIKE $${searchParamIndex} OR p.descripcion ILIKE $${searchParamIndex + 1})`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (categoria) {
            query += ` AND p.categoria_id = $${params.length + 1}`;
            params.push(categoria);
        }

        query += ' ORDER BY p.id DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT p.*, c.nombre as categoria_nombre 
             FROM productos p 
             LEFT JOIN categorias c ON p.categoria_id = c.id 
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
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

        const result = await pool.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, codigo_barras, fecha_vencimiento)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [nombre, descripcion, precio, stock, categoria_id, codigo_barras, fecha_vencimiento]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
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

        const result = await pool.query(
            `UPDATE productos
             SET nombre = $1,
                 descripcion = $2,
                 precio = $3,
                 stock = $4,
                 categoria_id = $5,
                 codigo_barras = $6,
                 fecha_vencimiento = $7,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING *`,
            [nombre, descripcion, precio, stock, categoria_id, codigo_barras, fecha_vencimiento, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El código de barras ya existe' });
        }
        res.status(500).json({ error: error.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM productos WHERE id = $1', [id]);

        if (result.rowCount === 0) {
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

        const result = await pool.query(
            `UPDATE productos
             SET stock = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
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
