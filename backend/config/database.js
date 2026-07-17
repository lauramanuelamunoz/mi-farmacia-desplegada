const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionUrl =
    process.env.MYSQL_PUBLIC_URL ||
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL ||
    process.env.DB_URL;

const baseConfig = connectionUrl
    ? (() => {
        const parsedUrl = new URL(connectionUrl);

        return {
            host: parsedUrl.hostname,
            user: decodeURIComponent(parsedUrl.username),
            password: decodeURIComponent(parsedUrl.password),
            database: parsedUrl.pathname.replace(/^\//, ''),
            port: Number(parsedUrl.port) || 3306,
        };
    })()
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'farmacia_db',
        port: Number(process.env.DB_PORT) || 3306,
    };

const pool = mysql.createPool({
    ...baseConfig,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
});

// Probar conexión
pool.getConnection()
    .then(connection => {
        console.log(`✅ Conexión exitosa a MySQL (${baseConfig.host}:${baseConfig.port}/${baseConfig.database})`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a MySQL:', err.stack);
    });

module.exports = pool;
