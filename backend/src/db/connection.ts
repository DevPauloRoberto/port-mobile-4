import { Pool } from 'pg';

const pool = new Pool({
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432'),
  database: process.env['DB_NAME'] || 'copa2026',
  user: process.env['DB_USER'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres123',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
});

export default pool;
