import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── GET /api/selecoes ────────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM selecoes ORDER BY ranking_fifa ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar seleções:', err);
    return res.status(500).json({ erro: 'Erro ao buscar seleções.' });
  }
});

// ── GET /api/selecoes/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [selecao, jogadores] = await Promise.all([
      pool.query('SELECT * FROM selecoes WHERE id = $1', [id]),
      pool.query(
        'SELECT * FROM jogadores WHERE selecao_id = $1 ORDER BY numero ASC NULLS LAST',
        [id]
      ),
    ]);

    if (selecao.rows.length === 0) {
      return res.status(404).json({ erro: 'Seleção não encontrada.' });
    }

    return res.json({ ...selecao.rows[0], jogadores: jogadores.rows });
  } catch (err) {
    console.error('Erro ao buscar seleção:', err);
    return res.status(500).json({ erro: 'Erro ao buscar seleção.' });
  }
});

export default router;
