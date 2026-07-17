const { Pool, types } = require('pg');
require('dotenv').config();

types.setTypeParser(1700, (value) => (value === null ? null : parseFloat(value)));
types.setTypeParser(20, (value) => (value === null ? null : parseInt(value, 10)));

const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PUBLIC_URL ||
    process.env.DB_URL;

const baseConfig = connectionString
    ? { connectionString }
    : {
        host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
        user: process.env.PGUSER || process.env.DB_USER || 'postgres',
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
        database: process.env.PGDATABASE || process.env.DB_NAME || 'farmacia_db',
        port: Number(process.env.PGPORT || process.env.DB_PORT) || 5432,
    };

const pool = new Pool({
    ...baseConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.connect()
    .then((client) => {
        const host = connectionString ? 'DATABASE_URL' : baseConfig.host;
        const port = connectionString ? 'DATABASE_URL' : baseConfig.port;
        const database = connectionString ? 'DATABASE_URL' : baseConfig.database;

        console.log(`✅ Conexión exitosa a PostgreSQL (${host}:${port}/${database})`);
        client.release();
    })
    .catch((err) => {
        console.error('❌ Error al conectar a PostgreSQL:', err.message);
    });

module.exports = pool;
