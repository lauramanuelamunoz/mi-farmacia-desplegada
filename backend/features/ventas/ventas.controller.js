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
            query += ` AND v.fecha >= ?`;
            params.push(fecha_inicio);
        }

        if (fecha_fin) {
            query += ` AND v.fecha <= ?`;
            params.push(fecha_fin);
        }

        query += ' ORDER BY v.fecha DESC';
        
        const [result] = await pool.query(query, params);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [ventaResult] = await pool.query(
            `SELECT v.*, u.nombre as usuario_nombre 
             FROM ventas v 
             LEFT JOIN usuarios u ON v.usuario_id = u.id 
             WHERE v.id = ?`,
            [id]
        );
        
        if (ventaResult.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        
        const [detalleResult] = await pool.query(
            `SELECT dv.*, p.nombre as producto_nombre 
             FROM detalle_ventas dv 
             LEFT JOIN productos p ON dv.producto_id = p.id 
             WHERE dv.venta_id = ?`,
            [id]
        );
        
        const venta = ventaResult[0];
        venta.detalles = detalleResult;
        
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createVenta = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { detalles, metodo_pago } = req.body;
        const usuario_id = req.usuario.id;
        
        if (!detalles || detalles.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ error: 'La venta debe tener al menos un producto' });
        }
        
        let total = 0;
        
        // Calcular total y verificar stock
        for (const item of detalles) {
            const [producto] = await connection.query(
                'SELECT precio, stock FROM productos WHERE id = ?',
                [item.producto_id]
            );
            
            if (producto.length === 0) {
                throw new Error(`Producto ${item.producto_id} no encontrado`);
            }
            
            if (producto[0].stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${item.producto_id}`);
            }
            
            const subtotal = producto[0].precio * item.cantidad;
            total += subtotal;
            item.precio_unitario = producto[0].precio;
            item.subtotal = subtotal;
        }
        
        // Crear venta
        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (usuario_id, total, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, total, metodo_pago]
        );
        
        const ventaId = ventaResult.insertId;
        
        // Insertar detalles y actualizar stock
        for (const item of detalles) {
            await connection.query(
                `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
            );
            
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.producto_id]
            );
        }
        
        await connection.commit();
        connection.release();
        
        // Obtener venta completa
        const [ventaCompleta] = await pool.query(
            `SELECT v.*, u.nombre as usuario_nombre 
             FROM ventas v 
             LEFT JOIN usuarios u ON v.usuario_id = u.id 
             WHERE v.id = ?`,
            [ventaId]
        );
        
        res.status(201).json(ventaCompleta[0]);
    } catch (error) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: error.message });
    }
};

const getEstadisticas = async (req, res) => {
    try {
        // Ventas del día
        const [ventasHoy] = await pool.query(
            "SELECT COALESCE(SUM(total), 0) as total FROM ventas WHERE DATE(fecha) = CURDATE()"
        );
        
        // Total de ventas
        const [totalVentas] = await pool.query(
            "SELECT COUNT(*) as total FROM ventas"
        );
        
        // Productos más vendidos
        const [productosTop] = await pool.query(
            `SELECT p.id, p.nombre, SUM(dv.cantidad) as total_vendido 
             FROM productos p 
             JOIN detalle_ventas dv ON p.id = dv.producto_id 
             GROUP BY p.id, p.nombre 
             ORDER BY total_vendido DESC 
             LIMIT 10`
        );
        
        // Total de productos
        const [totalProductos] = await pool.query(
            "SELECT COUNT(*) as total FROM productos"
        );
        
        // Total de usuarios
        const [totalUsuarios] = await pool.query(
            "SELECT COUNT(*) as total FROM usuarios"
        );
        
        res.json({
            ventasHoy: parseFloat(ventasHoy[0].total),
            totalVentas: parseInt(totalVentas[0].total),
            totalProductos: parseInt(totalProductos[0].total),
            totalUsuarios: parseInt(totalUsuarios[0].total),
            productosTop: productosTop
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