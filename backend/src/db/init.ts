import { PoolClient } from 'pg';
import pool from './connection';

async function runQuery(client: PoolClient, sql: string): Promise<void> {
  await client.query(sql);
}

export async function initDatabase(): Promise<void> {
  let retries = 8;

  while (retries > 0) {
    try {
      const client = await pool.connect();
      try {
        // ── Tabelas ────────────────────────────────────────────────────────────

        await runQuery(client, `
          CREATE TABLE IF NOT EXISTS usuarios (
            id           SERIAL PRIMARY KEY,
            nome         VARCHAR(100)  NOT NULL,
            email        VARCHAR(150)  UNIQUE NOT NULL,
            senha        VARCHAR(255)  NOT NULL,
            pais_favorito VARCHAR(100),
            criado_em    TIMESTAMP DEFAULT NOW()
          )
        `);

        await runQuery(client, `
          CREATE TABLE IF NOT EXISTS selecoes (
            id            SERIAL PRIMARY KEY,
            nome          VARCHAR(100) NOT NULL,
            codigo        VARCHAR(3)   NOT NULL UNIQUE,
            grupo         VARCHAR(1)   NOT NULL,
            confederacao  VARCHAR(10)  NOT NULL,
            treinador     VARCHAR(100),
            ranking_fifa  INT
          )
        `);

        await runQuery(client, `
          CREATE TABLE IF NOT EXISTS jogadores (
            id         SERIAL PRIMARY KEY,
            nome       VARCHAR(100) NOT NULL,
            posicao    VARCHAR(30)  NOT NULL,
            numero     INT,
            idade      INT,
            clube      VARCHAR(100),
            selecao_id INT REFERENCES selecoes(id) ON DELETE CASCADE
          )
        `);

        await runQuery(client, `
          CREATE TABLE IF NOT EXISTS partidas (
            id                SERIAL PRIMARY KEY,
            selecao_casa_id   INT REFERENCES selecoes(id),
            selecao_fora_id   INT REFERENCES selecoes(id),
            fase              VARCHAR(50)  NOT NULL,
            grupo             VARCHAR(1),
            data_hora         TIMESTAMP,
            estadio           VARCHAR(100),
            cidade            VARCHAR(100),
            gols_casa         INT DEFAULT 0,
            gols_fora         INT DEFAULT 0,
            status            VARCHAR(20)  DEFAULT 'agendada'
          )
        `);

        await runQuery(client, `
          CREATE TABLE IF NOT EXISTS classificacao (
            id           SERIAL PRIMARY KEY,
            selecao_id   INT REFERENCES selecoes(id) ON DELETE CASCADE UNIQUE,
            grupo        VARCHAR(1) NOT NULL,
            pontos       INT DEFAULT 0,
            jogos        INT DEFAULT 0,
            vitorias     INT DEFAULT 0,
            empates      INT DEFAULT 0,
            derrotas     INT DEFAULT 0,
            gols_pro     INT DEFAULT 0,
            gols_contra  INT DEFAULT 0,
            saldo_gols   INT DEFAULT 0
          )
        `);

        // ── Seed ─────────────────────────────────────────────────────────────
        const { rows } = await client.query('SELECT COUNT(*) AS cnt FROM selecoes');
        if (parseInt(rows[0].cnt) === 0) {
          console.log('🌱  Inserindo dados iniciais...');

          await runQuery(client, `
            INSERT INTO selecoes (nome, codigo, grupo, confederacao, treinador, ranking_fifa) VALUES
              ('Brasil',     'BRA', 'E', 'CONMEBOL',  'Dorival Júnior',       5),
              ('Argentina',  'ARG', 'A', 'CONMEBOL',  'Lionel Scaloni',       1),
              ('França',     'FRA', 'D', 'UEFA',      'Didier Deschamps',     2),
              ('Inglaterra', 'ENG', 'B', 'UEFA',      'Gareth Southgate',     3),
              ('Espanha',    'ESP', 'C', 'UEFA',      'Luis de la Fuente',    4),
              ('Portugal',   'POR', 'F', 'UEFA',      'Roberto Martínez',     6),
              ('Alemanha',   'GER', 'G', 'UEFA',      'Julian Nagelsmann',   13),
              ('Holanda',    'NED', 'H', 'UEFA',      'Ronald Koeman',        7),
              ('Uruguai',    'URU', 'A', 'CONMEBOL',  'Marcelo Bielsa',      16),
              ('Colômbia',   'COL', 'B', 'CONMEBOL',  'Néstor Lorenzo',      14),
              ('México',     'MEX', 'C', 'CONCACAF',  'Javier Aguirre',      15),
              ('EUA',        'USA', 'D', 'CONCACAF',  'Mauricio Pochettino', 18),
              ('Japão',      'JPN', 'E', 'AFC',       'Hajime Moriyasu',     17),
              ('Marrocos',   'MAR', 'F', 'CAF',       'Walid Regragui',      14),
              ('Senegal',    'SEN', 'G', 'CAF',       'Aliou Cissé',         20),
              ('Austrália',  'AUS', 'H', 'AFC',       'Tony Popovic',        24)
            ON CONFLICT (codigo) DO NOTHING
          `);

          await runQuery(client, `
            INSERT INTO jogadores (nome, posicao, numero, idade, clube, selecao_id) VALUES
              ('Alisson Becker',      'Goleiro',  1,  33, 'Liverpool',           (SELECT id FROM selecoes WHERE codigo='BRA')),
              ('Marquinhos',          'Zagueiro', 4,  30, 'PSG',                 (SELECT id FROM selecoes WHERE codigo='BRA')),
              ('Casemiro',            'Volante',  5,  34, 'Manchester United',   (SELECT id FROM selecoes WHERE codigo='BRA')),
              ('Vinicius Jr.',        'Atacante', 7,  25, 'Real Madrid',         (SELECT id FROM selecoes WHERE codigo='BRA')),
              ('Rodrygo',             'Atacante', 11, 24, 'Real Madrid',         (SELECT id FROM selecoes WHERE codigo='BRA')),
              ('Endrick',             'Atacante', 9,  19, 'Real Madrid',         (SELECT id FROM selecoes WHERE codigo='BRA')),
              ('Emiliano Martínez',   'Goleiro',  1,  31, 'Aston Villa',         (SELECT id FROM selecoes WHERE codigo='ARG')),
              ('Lionel Messi',        'Atacante', 10, 38, 'Inter Miami',         (SELECT id FROM selecoes WHERE codigo='ARG')),
              ('Lautaro Martínez',    'Atacante', 22, 26, 'Inter de Milão',      (SELECT id FROM selecoes WHERE codigo='ARG')),
              ('Julián Álvarez',      'Atacante', 9,  24, 'Atlético de Madrid',  (SELECT id FROM selecoes WHERE codigo='ARG')),
              ('Kylian Mbappé',       'Atacante', 10, 27, 'Real Madrid',         (SELECT id FROM selecoes WHERE codigo='FRA')),
              ('Antoine Griezmann',   'Meia',     7,  35, 'Atlético de Madrid',  (SELECT id FROM selecoes WHERE codigo='FRA')),
              ('Aurelien Tchouaméni', 'Volante',  8,  24, 'Real Madrid',         (SELECT id FROM selecoes WHERE codigo='FRA')),
              ('Jude Bellingham',     'Meia',     10, 22, 'Real Madrid',         (SELECT id FROM selecoes WHERE codigo='ENG')),
              ('Harry Kane',          'Atacante', 9,  32, 'Bayern de Munique',   (SELECT id FROM selecoes WHERE codigo='ENG')),
              ('Bukayo Saka',         'Atacante', 7,  24, 'Arsenal',             (SELECT id FROM selecoes WHERE codigo='ENG')),
              ('Pedri',               'Meia',     8,  23, 'Barcelona',           (SELECT id FROM selecoes WHERE codigo='ESP')),
              ('Lamine Yamal',        'Atacante', 11, 18, 'Barcelona',           (SELECT id FROM selecoes WHERE codigo='ESP')),
              ('Alejandro Baena',     'Meia',     14, 23, 'Villarreal',          (SELECT id FROM selecoes WHERE codigo='ESP')),
              ('Cristiano Ronaldo',   'Atacante', 7,  41, 'Al-Nassr',            (SELECT id FROM selecoes WHERE codigo='POR')),
              ('Bruno Fernandes',     'Meia',     8,  29, 'Manchester United',   (SELECT id FROM selecoes WHERE codigo='POR')),
              ('Ruben Dias',          'Zagueiro', 3,  27, 'Manchester City',     (SELECT id FROM selecoes WHERE codigo='POR')),
              ('Florian Wirtz',       'Meia',     10, 21, 'Bayer Leverkusen',    (SELECT id FROM selecoes WHERE codigo='GER')),
              ('Jamal Musiala',       'Meia',     14, 21, 'Bayern de Munique',   (SELECT id FROM selecoes WHERE codigo='GER')),
              ('Virgil van Dijk',     'Zagueiro', 4,  33, 'Liverpool',           (SELECT id FROM selecoes WHERE codigo='NED')),
              ('Cody Gakpo',          'Atacante', 11, 25, 'Liverpool',           (SELECT id FROM selecoes WHERE codigo='NED'))
          `);

          await runQuery(client, `
            INSERT INTO classificacao (selecao_id, grupo, pontos, jogos, vitorias, empates, derrotas, gols_pro, gols_contra, saldo_gols)
            SELECT id, grupo, 0, 0, 0, 0, 0, 0, 0, 0 FROM selecoes
            ON CONFLICT (selecao_id) DO NOTHING
          `);

          await runQuery(client, `
            INSERT INTO partidas (selecao_casa_id, selecao_fora_id, fase, grupo, data_hora, estadio, cidade, status) VALUES
              ((SELECT id FROM selecoes WHERE codigo='MEX'),(SELECT id FROM selecoes WHERE codigo='ARG'),'Fase de Grupos','A','2026-06-11 18:00:00','Estadio Azteca','Cidade do México','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='ENG'),(SELECT id FROM selecoes WHERE codigo='COL'),'Fase de Grupos','B','2026-06-12 18:00:00','MetLife Stadium','Nova York','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='ESP'),(SELECT id FROM selecoes WHERE codigo='MEX'),'Fase de Grupos','C','2026-06-13 18:00:00','Estadio BBVA','Monterrey','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='FRA'),(SELECT id FROM selecoes WHERE codigo='USA'),'Fase de Grupos','D','2026-06-14 21:00:00','AT&T Stadium','Dallas','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='BRA'),(SELECT id FROM selecoes WHERE codigo='JPN'),'Fase de Grupos','E','2026-06-15 18:00:00','SoFi Stadium','Los Angeles','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='POR'),(SELECT id FROM selecoes WHERE codigo='MAR'),'Fase de Grupos','F','2026-06-16 21:00:00','BC Place','Vancouver','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='GER'),(SELECT id FROM selecoes WHERE codigo='SEN'),'Fase de Grupos','G','2026-06-17 18:00:00','Lincoln Financial Field','Filadélfia','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='NED'),(SELECT id FROM selecoes WHERE codigo='AUS'),'Fase de Grupos','H','2026-06-18 18:00:00','Levi''s Stadium','San Francisco','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='ARG'),(SELECT id FROM selecoes WHERE codigo='URU'),'Fase de Grupos','A','2026-06-19 21:00:00','MetLife Stadium','Nova York','agendada'),
              ((SELECT id FROM selecoes WHERE codigo='COL'),(SELECT id FROM selecoes WHERE codigo='ENG'),'Fase de Grupos','B','2026-06-20 18:00:00','AT&T Stadium','Dallas','agendada')
          `);

          console.log('✅  Dados iniciais inseridos!');
        }

        console.log('✅  Banco de dados pronto!');
      } finally {
        client.release();
      }
      return;
    } catch (err: any) {
      console.error(`⚠️  Falha na conexão (${retries} tentativas restantes):`, err.message);
      retries--;
      if (retries === 0) throw err;
      await new Promise((r) => setTimeout(r, 4000));
    }
  }
}
