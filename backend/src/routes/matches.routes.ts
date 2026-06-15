import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── GET /api/partidas ────────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        sc.nome  AS casa_nome,  sc.codigo  AS casa_codigo,
        sf.nome  AS fora_nome,  sf.codigo  AS fora_codigo
      FROM  partidas p
      JOIN  selecoes sc ON p.selecao_casa_id = sc.id
      JOIN  selecoes sf ON p.selecao_fora_id = sf.id
      ORDER BY p.data_hora ASC
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar partidas:', err);
    return res.status(500).json({ erro: 'Erro ao buscar partidas.' });
  }
});

// ── GET /api/partidas/fase/:fase ─────────────────────────────────────────────
router.get('/fase/:fase', async (req: Request, res: Response) => {
  const { fase } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        sc.nome AS casa_nome, sc.codigo AS casa_codigo,
        sf.nome AS fora_nome, sf.codigo AS fora_codigo
      FROM  partidas p
      JOIN  selecoes sc ON p.selecao_casa_id = sc.id
      JOIN  selecoes sf ON p.selecao_fora_id = sf.id
      WHERE p.fase = $1
      ORDER BY p.data_hora ASC
    `, [fase]);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao filtrar partidas:', err);
    return res.status(500).json({ erro: 'Erro ao filtrar partidas.' });
  }
});

export default router;
