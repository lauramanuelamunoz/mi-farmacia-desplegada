const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PUBLIC_URL ||
  process.env.DB_URL;

const useSSL = process.env.DB_SSL === 'true' || !!connectionString;

const getPgConfig = (databaseOverride) => {
  // Si hay una connection string (Railway, Render, etc.), la usamos como base
  // y solo sobreescribimos la base de datos si se solicita una distinta
  // (por ejemplo, para conectarnos primero a "postgres" y crear la base real).
  if (connectionString) {
    if (databaseOverride) {
      const url = new URL(connectionString);
      url.pathname = `/${databaseOverride}`;
      return {
        connectionString: url.toString(),
        ssl: useSSL ? { rejectUnauthorized: false } : false,
      };
    }

    return {
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    };
  }

  // Fallback para desarrollo local con variables PG* sueltas
  return {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: databaseOverride || process.env.PGDATABASE || 'farmacia_db',
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
};

const splitSqlStatements = (sql) => {
  // 1. Elimina comentarios multilínea /* ... */
  const noBlockComments = sql.replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Elimina comentarios de una línea --
  const sanitizedSql = noBlockComments
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  const statements = [];
  let current = '';
  let inDollarBlock = false;

  for (let i = 0; i < sanitizedSql.length; i += 1) {
    const currentChar = sanitizedSql[i];
    const nextChar = sanitizedSql[i + 1];

    if (currentChar === '$' && nextChar === '$') {
      inDollarBlock = !inDollarBlock;
      current += '$$';
      i += 1;
      continue;
    }

    if (currentChar === ';' && !inDollarBlock) {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = '';
      continue;
    }

    current += currentChar;
  }

  const trimmed = current.trim();
  if (trimmed) {
    statements.push(trimmed);
  }

  return statements;
};

const ensureDatabaseExists = async (database) => {
  // En Railway (y otros hosts con DATABASE_URL) la base de datos ya viene
  // creada de fábrica: no tenemos permisos ni necesidad de crear otra,
  // así que simplemente seguimos adelante y aplicamos el esquema sobre
  // la base indicada en la connection string.
  if (connectionString) {
    console.log('Usando DATABASE_URL: se omite creación manual de base de datos.');
    return;
  }

  const adminClient = new Client(getPgConfig('postgres'));
  await adminClient.connect();

  try {
    const exists = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [database]
    );

    if (exists.rowCount === 0) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(database)) {
        throw new Error('Nombre de base de datos inválido para creación automática');
      }

      await adminClient.query(`CREATE DATABASE ${database}`);
      console.log(`Base de datos creada: ${database}`);
    } else {
      console.log(`Base de datos existente: ${database}`);
    }
  } finally {
    await adminClient.end();
  }
};

const applySchema = async () => {
  const database = process.env.PGDATABASE || 'farmacia_db';
  const sqlPath = path.join(__dirname, '..', 'database.sql');

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`No se encontró el archivo SQL en la ruta: ${sqlPath}`);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = splitSqlStatements(sql);

  await ensureDatabaseExists(database);

  const client = new Client(getPgConfig(connectionString ? undefined : database));
  await client.connect();

  try {
    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (err) {
        console.error('\n Error al ejecutar la siguiente sentencia SQL:');
        console.error('--------------------------------------------------');
        console.error(statement);
        console.error('--------------------------------------------------');
        throw err;
      }
    }
    console.log('Esquema PostgreSQL aplicado correctamente');
  } finally {
    await client.end();
  }
};

applySchema().catch((error) => {
  console.error('\n' + error.message);
  process.exit(1);
});
