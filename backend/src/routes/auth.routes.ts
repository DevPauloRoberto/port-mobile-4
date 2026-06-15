import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, nome, email, pais_favorito FROM usuarios WHERE email = $1 AND senha = $2',
      [email.trim().toLowerCase(), senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    return res.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// ── POST /api/auth/cadastro ──────────────────────────────────────────────────
router.post('/cadastro', async (req: Request, res: Response) => {
  const { nome, email, senha, pais_favorito } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, pais_favorito)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, pais_favorito`,
      [nome.trim(), email.trim().toLowerCase(), senha, pais_favorito || null]
    );

    return res.status(201).json({ usuario: result.rows[0] });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }
    console.error('Erro no cadastro:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// ── POST /api/auth/solicitar-senha ───────────────────────────────────────────
router.post('/solicitar-senha', async (req: Request, res: Response) => {
  const { email, nova_senha } = req.body;

  if (!email || !nova_senha) {
    return res.status(400).json({ erro: 'E-mail e nova senha são obrigatórios.' });
  }

  if (nova_senha.length < 6) {
    return res.status(400).json({ erro: 'A nova senha deve ter no mínimo 6 caracteres.' });
  }

  try {
    const result = await pool.query(
      'UPDATE usuarios SET senha = $1 WHERE email = $2 RETURNING id, nome, email',
      [nova_senha, email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'E-mail não encontrado.' });
    }

    return res.json({ mensagem: 'Senha atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// ── PUT /api/auth/perfil/:id ─────────────────────────────────────────────────
router.put('/perfil/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, pais_favorito } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }

  try {
    const result = await pool.query(
      `UPDATE usuarios SET nome = $1, pais_favorito = $2
       WHERE id = $3
       RETURNING id, nome, email, pais_favorito`,
      [nome.trim(), pais_favorito || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

export default router;
