# 🏛️ Instruções de Configuração - Plataforma de Gestão Jurídica

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download aqui](https://nodejs.org)
- **PostgreSQL** - [Download aqui](https://www.postgresql.org/download/)
- **Git** - [Download aqui](https://git-scm.com/)

## 🚀 Configuração Rápida

### 1. Clonar e Instalar Dependências

```bash
# No diretório atual (já clonado)
cd plataforma_gestao

# Instalar dependências do monorepo
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install

# Voltar para o diretório raiz
cd ..
```

### 2. Configurar Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb plataforma_gestao_db

# Ou via psql:
psql -U postgres
CREATE DATABASE plataforma_gestao_db;
\q
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp backend/env.example backend/.env

# Editar o arquivo .env com suas configurações
```

**Configurar o arquivo `backend/.env`:**

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/plataforma_gestao_db"

# Configurações do Servidor
PORT=3001
NODE_ENV=development

# JWT (usar uma chave segura em produção)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_123456789
JWT_EXPIRES_IN=7d

# Email (configurar para produção)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_ou_app_password
EMAIL_FROM=noreply@plataformagestao.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Executar Migrações e Seed

```bash
# Executar migrações do banco
cd backend
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate

# Popular banco com dados de teste
npm run db:seed
```

### 5. Executar o Projeto

```bash
# Voltar para o diretório raiz
cd ..

# Executar backend e frontend simultaneamente
npm run dev
```

**Ou executar separadamente:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🌐 Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 👤 Usuários de Teste

Após executar o seed, você pode fazer login com:

| Tipo | Email | Senha | Permissões |
|------|-------|-------|------------|
| **Admin** | admin@plataformagestao.com | Admin123! | Acesso total |
| **Advogado** | joao.silva@escritorio.com | Advogado123! | Gestão de processos |
| **Advogado** | maria.santos@escritorio.com | Advogado123! | Gestão de processos |
| **Assistente** | ana.oliveira@escritorio.com | Assistente123! | Acesso limitado |

## 🛠️ Comandos Úteis

### Backend

```bash
cd backend

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Testes
npm test

# Banco de dados
npm run db:migrate    # Executar migrações
npm run db:generate   # Gerar cliente Prisma
npm run db:studio     # Abrir Prisma Studio
npm run db:seed       # Popular com dados de teste
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📂 Estrutura do Projeto

```
plataforma_gestao/
├── backend/                 # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── middleware/      # Middlewares (auth, error handling)
│   │   ├── routes/          # Definição das rotas
│   │   ├── services/        # Lógica de negócio
│   │   ├── utils/           # Utilitários (email, password)
│   │   ├── config/          # Configurações (database)
│   │   ├── validators/      # Validação de dados (Joi)
│   │   └── database/        # Seed e configurações do BD
│   ├── prisma/              # Schema e migrações do Prisma
│   └── package.json
├── frontend/                # Interface web (React + Tailwind)
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── contexts/        # Contextos do React (Auth)
│   │   ├── services/        # Chamadas para API
│   │   └── App.tsx
│   └── package.json
├── package.json             # Configuração do monorepo
└── README.md
```

## 🎯 Funcionalidades Implementadas

### ✅ Funcionalidades Principais

- **Autenticação JWT** - Login seguro com diferentes níveis de acesso
- **Dashboard** - Visão geral com estatísticas e métricas
- **Gestão de Clientes** - CRUD completo com busca e filtros
- **Gestão de Processos** - Listagem, busca e informações detalhadas
- **Gestão de Tarefas** - Sistema de tarefas com status e prioridades
- **Gestão de Usuários** - Administração de usuários do sistema

### 🎨 Interface

- **Design Moderno** - Interface limpa e profissional
- **Responsivo** - Funciona em desktop, tablet e mobile
- **Navegação Intuitiva** - Sidebar e breadcrumbs
- **Feedback Visual** - Notificações toast e estados de loading
- **Componentes Reutilizáveis** - Sistema de design consistente

### 🔒 Segurança

- **Autenticação JWT** - Tokens seguros com expiração
- **Controle de Acesso** - Diferentes níveis de permissão
- **Validação de Dados** - Validação no frontend e backend
- **Rate Limiting** - Proteção contra spam e ataques
- **Senhas Seguras** - Hash com bcrypt e validação de força

## 🚀 Deploy em Produção

### Backend (Railway/Heroku)

1. Configurar variáveis de ambiente
2. Configurar banco PostgreSQL
3. Executar migrações: `npx prisma migrate deploy`
4. Build: `npm run build`

### Frontend (Vercel/Netlify)

1. Configurar variável `VITE_API_URL`
2. Build: `npm run build`
3. Deploy da pasta `dist/`

## 🐛 Troubleshooting

### Erro de Conexão com Banco

```bash
# Verificar se PostgreSQL está rodando
pg_ctl status

# Reiniciar PostgreSQL
pg_ctl restart
```

### Erro de Migrações

```bash
# Reset do banco (cuidado - apaga todos os dados)
cd backend
npx prisma migrate reset

# Executar seed novamente
npm run db:seed
```

### Erro de Dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar logs no terminal
2. Consultar documentação do Prisma: https://prisma.io/docs
3. Verificar issues no GitHub do projeto

## 🎉 Próximos Passos

O MVP está funcional! Para expandir:

1. **Implementar formulários** para criação/edição
2. **Adicionar calendário** para audiências e prazos
3. **Sistema de notificações** por email
4. **Upload de arquivos** para documentos
5. **Relatórios** e exportação de dados
6. **Integração** com sistemas externos
7. **Testes automatizados** mais abrangentes

---

✨ **Parabéns! Sua plataforma de gestão jurídica está pronta para uso!** ⚖️ 