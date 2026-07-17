-- Script para PostgreSQL
-- Crea la base de datos manualmente y conéctate a ella antes de ejecutar este archivo.
-- Ejemplo:
CREATE DATABASE farmacia_db;
-- \c farmacia_db;

-- Tipo ENUM para roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
        CREATE TYPE rol_usuario AS ENUM ('admin', 'usuario');
    END IF;
END $$;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol rol_usuario DEFAULT 'usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    categoria_id INTEGER,
    codigo_barras VARCHAR(50) UNIQUE,
    fecha_vencimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ventas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalle_ventas_venta
        FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_ventas_producto
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Triggers para updated_at
DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categorias_updated_at ON categorias;
CREATE TRIGGER trg_categorias_updated_at
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_productos_updated_at ON productos;
CREATE TRIGGER trg_productos_updated_at
BEFORE UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Insertar datos de prueba
-- Insertar administrador por defecto (password: admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@farmacia.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertar categorías de prueba
INSERT INTO categorias (nombre, descripcion) VALUES
('Medicamentos', 'Medicamentos de venta libre y con receta'),
('Cuidado Personal', 'Productos de cuidado personal e higiene'),
('Vitaminas y Suplementos', 'Vitaminas, minerales y suplementos dietéticos')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar productos de prueba
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Paracetamol 500mg', 'Analgésico y antipirético', 5.50, 100, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Paracetamol 500mg');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Ibuprofeno 400mg', 'Anti-inflamatorio no esteroideo', 7.80, 80, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Ibuprofeno 400mg');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Jabón Antibacterial', 'Jabón para manos con protección antibacterial', 3.20, 150, 2
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Jabón Antibacterial');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Vitamina C 1000mg', 'Suplemento vitamínico', 12.50, 60, 3
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Vitamina C 1000mg');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Alcohol en Gel', 'Alcohol antiséptico en gel', 4.90, 200, 2
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Alcohol en Gel');
