import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/init';
import authRoutes    from './routes/auth.routes';
import teamsRoutes   from './routes/teams.routes';
import groupsRoutes  from './routes/groups.routes';
import matchesRoutes from './routes/matches.routes';

const app  = express();
const PORT = parseInt(process.env['PORT'] || '3000', 10);

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/selecoes', teamsRoutes);
app.use('/api/grupos',   groupsRoutes);
app.use('/api/partidas', matchesRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀  API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Falha ao iniciar servidor:', err);
    process.exit(1);
  }
}

bootstrap();
