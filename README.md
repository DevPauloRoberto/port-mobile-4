# ⚽ Copa do Mundo 2026 – App Ionic/Angular + Node.js + PostgreSQL

Aplicativo mobile sobre a **FIFA World Cup 2026** desenvolvido com Ionic + Angular (NgModules) no front-end, Node.js/Express/TypeScript no back-end e PostgreSQL como banco de dados.  
Toda a infra é orquestrada via **Docker Compose**.

---

## 🗂️ Estrutura do Projeto

```
port-4-mobile/            ← raiz do monorepo
├── docker-compose.yml    ← orquestra os 3 containers
├── backend/              ← API Node.js/Express/TypeScript
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts
│       ├── db/
│       │   ├── connection.ts
│       │   └── init.ts       ← cria tabelas + seed
│       └── routes/
│           ├── auth.routes.ts
│           ├── teams.routes.ts
│           ├── groups.routes.ts
│           └── matches.routes.ts
└── port-4-mobile/        ← Ionic/Angular front-end
    ├── Dockerfile
    ├── nginx.conf
    └── src/app/
        ├── guards/auth.guard.ts
        ├── services/
        │   ├── auth.service.ts
        │   ├── selecoes.service.ts
        │   ├── partidas.service.ts
        │   └── grupos.service.ts
        └── pages/
            ├── login/          ← Tela 1
            ├── cadastro/       ← Tela 2
            ├── esqueci-senha/  ← Tela 3
            ├── tabs/           ← Shell de navegação
            ├── home/           ← Tela 4 – Dashboard
            ├── grupos/         ← Tela 5 – Classificação
            ├── partidas/       ← Tela 6 – Agenda
            ├── perfil/         ← Tela 7 – Perfil/Logout
            └── selecao-detalhe/← Tela 8 – Detalhe da Seleção
```

---

## 🚀 Rodar com Docker (produção)

```bash
# Na raiz (onde está docker-compose.yml)
cd c:\Users\Paulo\OneDrive\Desktop\port-4-mobile

docker-compose up --build
```

| Serviço   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:8080       |
| Backend   | http://localhost:3000/api  |
| PostgreSQL| localhost:5432             |

---

## 💻 Rodar em desenvolvimento local

### Back-end
```bash
cd backend
npm install
npm run dev        # ts-node-dev com hot-reload
```
> API disponível em: `http://localhost:3000`

### Front-end
```bash
cd port-4-mobile
npm install
npm start          # ng serve
```
> App disponível em: `http://localhost:4200`

---

## 🗃️ Banco de Dados

Ao iniciar o back-end, o arquivo `src/db/init.ts` cria automaticamente as tabelas e popula os dados iniciais:

| Tabela          | Descrição                              |
|-----------------|----------------------------------------|
| `usuarios`      | Contas dos usuários                    |
| `selecoes`      | 16 seleções participantes              |
| `jogadores`     | Elenco das seleções (26+ jogadores)    |
| `partidas`      | 10 partidas da fase de grupos          |
| `classificacao` | Pontuação por grupo                    |

---

## 📱 Telas do App

| # | Tela                | Rota                  | Descrição                              |
|---|---------------------|-----------------------|----------------------------------------|
| 1 | Login               | `/login`              | E-mail + senha, link esqueci senha     |
| 2 | Cadastro            | `/cadastro`           | Nome, e-mail, senha, país favorito     |
| 3 | Esqueci Senha       | `/esqueci-senha`      | Redefinição de senha via e-mail        |
| 4 | Home / Dashboard    | `/tabs/home`          | Stats, próximas partidas, seleções     |
| 5 | Grupos              | `/tabs/grupos`        | Tabela de classificação por grupo A–H  |
| 6 | Partidas            | `/tabs/partidas`      | Agenda com filtro por grupo            |
| 7 | Perfil              | `/tabs/perfil`        | Edição de perfil + logout              |
| 8 | Detalhe da Seleção  | `/selecao/:id`        | Info + elenco completo do banco        |

---

## 🔗 Endpoints da API

### Auth
| Método | Rota                        | Descrição            |
|--------|-----------------------------|----------------------|
| POST   | `/api/auth/login`           | Login                |
| POST   | `/api/auth/cadastro`        | Criar conta          |
| POST   | `/api/auth/solicitar-senha` | Redefinir senha      |
| PUT    | `/api/auth/perfil/:id`      | Atualizar perfil     |

### Seleções
| Método | Rota                 | Descrição              |
|--------|----------------------|------------------------|
| GET    | `/api/selecoes`      | Listar todas           |
| GET    | `/api/selecoes/:id`  | Detalhe + jogadores    |

### Grupos
| Método | Rota              | Descrição                   |
|--------|-------------------|-----------------------------|
| GET    | `/api/grupos`     | Classificação geral         |
| GET    | `/api/grupos/:g`  | Classificação de um grupo   |

### Partidas
| Método | Rota                      | Descrição             |
|--------|---------------------------|-----------------------|
| GET    | `/api/partidas`           | Todas as partidas     |
| GET    | `/api/partidas/fase/:f`   | Filtrar por fase      |

---

## ♿ Acessibilidade

- `aria-label` em todos os elementos interativos
- `role` semântico (main, list, listitem, tablist, tab, form, article…)
- `aria-live` e `aria-required` nos formulários
- Navegação completa por teclado (`Tab` + `Enter`)
- `focus-visible` com anel dourado (#FFD700)
- Textos de loading com `aria-label="Carregando…"`

---

## 🧰 Tecnologias

| Camada    | Tecnologia                        |
|-----------|-----------------------------------|
| Frontend  | Ionic 8 + Angular 20 (NgModules)  |
| Backend   | Node.js + Express + TypeScript    |
| Banco     | PostgreSQL 15                     |
| Container | Docker + Docker Compose           |
| Servidor  | Nginx (produção)                  |
