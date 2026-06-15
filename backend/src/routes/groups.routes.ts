import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── GET /api/grupos ──────────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.nome, s.codigo, s.confederacao
      FROM   classificacao c
      JOIN   selecoes s ON c.selecao_id = s.id
      ORDER  BY c.grupo ASC, c.pontos DESC, c.saldo_gols DESC, c.gols_pro DESC
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar grupos:', err);
    return res.status(500).json({ erro: 'Erro ao buscar grupos.' });
  }
});

// ── GET /api/grupos/:grupo ───────────────────────────────────────────────────
router.get('/:grupo', async (req: Request, res: Response) => {
  const { grupo } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.*, s.nome, s.codigo, s.confederacao
      FROM   classificacao c
      JOIN   selecoes s ON c.selecao_id = s.id
      WHERE  c.grupo = $1
      ORDER  BY c.pontos DESC, c.saldo_gols DESC, c.gols_pro DESC
    `, [grupo.toUpperCase()]);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar grupo:', err);
    return res.status(500).json({ erro: 'Erro ao buscar grupo.' });
  }
});

export default router;
