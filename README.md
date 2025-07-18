# 🏛️ Plataforma de Gestão Jurídica

Uma plataforma web moderna e completa para gestão de escritórios de advocacia, com funcionalidades similares ao ADVBox, mas com interface limpa, moderna e responsiva.

## 🚀 Funcionalidades

- **Gestão de Processos Jurídicos** - Cadastro completo com timeline de movimentações
- **Controle de Prazos** - Calendário jurídico integrado com alertas automáticos
- **Gestão de Tarefas** - Delegação e controle de status por equipe
- **Agenda de Audiências** - Organização completa com notificações
- **Cadastro de Clientes** - Gestão de relacionamento e histórico
- **Sistema de Autenticação** - Controle de acesso por níveis de permissão

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express**
- **PostgreSQL** + **Prisma ORM**
- **JWT** para autenticação
- **Nodemailer** para e-mails
- **Jest** para testes

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** para styling
- **React Router** para navegação
- **Axios** para requisições

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Configuração

1. **Clone o repositório**
```bash
git clone <repo-url>
cd plataforma_gestao
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Configure as variáveis de ambiente no backend/.env
cp backend/.env.example backend/.env
```

4. **Execute as migrações**
```bash
cd backend
npx prisma migrate dev
```

5. **Inicie o desenvolvimento**
```bash
npm run dev
```

## 🏗️ Estrutura do Projeto

```
plataforma_gestao/
├── backend/          # API REST (Node.js + Express)
├── frontend/         # Interface web (React + Tailwind)
├── package.json      # Configuração do monorepo
└── README.md         # Este arquivo
```

## 📱 Interface

A interface foi projetada para ser:
- **Moderna e limpa** - Design minimalista e profissional
- **Responsiva** - Funciona em desktop, tablet e mobile
- **Intuitiva** - Navegação clara e fluxos simples
- **Rápida** - Otimizada para performance

## 🔐 Níveis de Acesso

- **Administrador** - Acesso completo ao sistema
- **Advogado** - Gestão de processos e clientes
- **Assistente** - Suporte operacional limitado

## 🧪 Testes

```bash
npm test
```

## 📄 Licença

Este projeto é privado e proprietário. 