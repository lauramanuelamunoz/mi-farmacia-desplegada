const pool = require('../../config/database');

const getVentas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        let query = `
            SELECT v.*, u.nombre as usuario_nombre 
            FROM ventas v 
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (fecha_inicio) {
            query += ` AND v.fecha >= $${params.length + 1}`;
            params.push(fecha_inicio);
        }

        if (fecha_fin) {
            query += ` AND v.fecha <= $${params.length + 1}`;
            params.push(fecha_fin);
        }

        query += ' ORDER BY v.fecha DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;

        const ventaResult = await pool.query(
            `SELECT v.*, u.nombre as usuario_nombre 
             FROM ventas v 
             LEFT JOIN usuarios u ON v.usuario_id = u.id 
             WHERE v.id = $1`,
            [id]
        );

        if (ventaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const detalleResult = await pool.query(
            `SELECT dv.*, p.nombre as producto_nombre 
             FROM detalle_ventas dv 
             LEFT JOIN productos p ON dv.producto_id = p.id 
             WHERE dv.venta_id = $1`,
            [id]
        );

        const venta = ventaResult.rows[0];
        venta.detalles = detalleResult.rows;

        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createVenta = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { detalles, metodo_pago } = req.body;
        const usuario_id = req.usuario.id;

        if (!detalles || detalles.length === 0) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(400).json({ error: 'La venta debe tener al menos un producto' });
        }

        let total = 0;

        for (const item of detalles) {
            const productoResult = await client.query(
                'SELECT precio, stock FROM productos WHERE id = $1 FOR UPDATE',
                [item.producto_id]
            );

            if (productoResult.rows.length === 0) {
                throw new Error(`Producto ${item.producto_id} no encontrado`);
            }

            const producto = productoResult.rows[0];

            if (producto.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${item.producto_id}`);
            }

            const subtotal = Number(producto.precio) * item.cantidad;
            total += subtotal;
            item.precio_unitario = Number(producto.precio);
            item.subtotal = subtotal;
        }

        const ventaResult = await client.query(
            `INSERT INTO ventas (usuario_id, total, metodo_pago)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [usuario_id, total, metodo_pago]
        );

        const ventaId = ventaResult.rows[0].id;

        for (const item of detalles) {
            await client.query(
                `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
            );

            await client.query(
                `UPDATE productos
                 SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [item.cantidad, item.producto_id]
            );
        }

        await client.query('COMMIT');
        client.release();

        const ventaCompleta = await pool.query(
            `SELECT v.*, u.nombre as usuario_nombre 
             FROM ventas v 
             LEFT JOIN usuarios u ON v.usuario_id = u.id 
             WHERE v.id = $1`,
            [ventaId]
        );

        res.status(201).json(ventaCompleta.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        res.status(500).json({ error: error.message });
    }
};

const getEstadisticas = async (req, res) => {
    try {
        const ventasHoy = await pool.query(
            'SELECT COALESCE(SUM(total), 0) as total FROM ventas WHERE DATE(fecha) = CURRENT_DATE'
        );

        const totalVentas = await pool.query(
            'SELECT COUNT(*) as total FROM ventas'
        );

        const productosTop = await pool.query(
            `SELECT p.id, p.nombre, SUM(dv.cantidad) as total_vendido 
             FROM productos p 
             JOIN detalle_ventas dv ON p.id = dv.producto_id 
             GROUP BY p.id, p.nombre 
             ORDER BY total_vendido DESC 
             LIMIT 10`
        );

        const totalProductos = await pool.query(
            'SELECT COUNT(*) as total FROM productos'
        );

        const totalUsuarios = await pool.query(
            'SELECT COUNT(*) as total FROM usuarios'
        );

        res.json({
            ventasHoy: Number(ventasHoy.rows[0].total),
            totalVentas: Number(totalVentas.rows[0].total),
            totalProductos: Number(totalProductos.rows[0].total),
            totalUsuarios: Number(totalUsuarios.rows[0].total),
            productosTop: productosTop.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getVentas,
    getVentaById,
    createVenta,
    getEstadisticas
};
