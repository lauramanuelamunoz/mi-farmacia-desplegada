const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const getPgConfig = (databaseOverride) => ({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: databaseOverride || process.env.PGDATABASE || 'farmacia_db',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const splitSqlStatements = (sql) => {
  const sanitizedSql = sql
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
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = splitSqlStatements(sql);

  await ensureDatabaseExists(database);

  const client = new Client(getPgConfig(database));
  await client.connect();

  try {
    for (const statement of statements) {
      await client.query(statement);
    }
    console.log('Esquema PostgreSQL aplicado correctamente');
  } finally {
    await client.end();
  }
};

applySchema().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
