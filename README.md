# 🎯 Lumina - Plataforma de Análise de Sentimento e Feedback

<div align="center">
  <img src="docs/logo.svg" alt="Lumina Logo" width="200"/>
  
  **Transforme feedbacks em insights acionáveis com IA**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
</div>

---

## 📋 Visão Geral

**Lumina** é uma plataforma SaaS de análise de sentimento que permite empresas e profissionais analisarem feedbacks de clientes em escala. Cole um link de produto ou faça upload de um CSV com avaliações e obtenha insights instantâneos.

### ✨ Funcionalidades Principais

- 🔗 **Análise por URL** - Cole links de produtos (Amazon, Mercado Livre, etc.)
- 📊 **Upload de CSV** - Importe suas próprias avaliações
- 🤖 **NLP Avançado** - Análise de sentimento com NLTK e spaCy
- 📈 **Dashboard Interativo** - Visualizações em tempo real
- 🔐 **Autenticação Segura** - Integração com Clerk
- 💳 **Pagamentos** - Planos com Stripe
- 📱 **Responsivo** - Funciona em qualquer dispositivo

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14 + TypeScript)           │
│              Landing Page • Dashboard • Auth UI                 │
│                    Tailwind CSS + ShadcnUI                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                   API Gateway (Node.js + Express)               │
│           Authentication • Payments • User Management           │
│                    Prisma ORM + PostgreSQL                      │
└────────────┬─────────────────────────────────┬──────────────────┘
             │                                 │
┌────────────▼────────────┐     ┌──────────────▼──────────────────┐
│      PostgreSQL         │     │      Python NLP Engine          │
│   (Dados Persistentes)  │     │   FastAPI + NLTK + spaCy        │
└─────────────────────────┘     │   Análise de Sentimento         │
                                └─────────────────────────────────┘
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (recomendado)

### Instalação com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lumina.git
cd lumina

# Copie as variáveis de ambiente
cp .env.example .env

# Inicie todos os serviços
docker-compose up -d

# Acesse em http://localhost:3000
```

### Instalação Manual

#### 1. Backend Python (NLP Engine)

```bash
cd apps/nlp-engine
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download pt_core_news_lg
python -m spacy download en_core_web_lg
uvicorn main:app --reload --port 8000
```

#### 2. Backend Node.js (API Gateway)

```bash
cd apps/api-gateway
npm install
npx prisma generate
npx prisma db push
npm run dev
```

#### 3. Frontend Next.js

```bash
cd apps/web
npm install
npm run dev
```

---

## 📁 Estrutura do Projeto

```
lumina/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── app/                # App Router
│   │   ├── components/         # Componentes React
│   │   ├── lib/                # Utilitários
│   │   └── styles/             # Estilos globais
│   │
│   ├── api-gateway/            # Backend Node.js
│   │   ├── src/
│   │   │   ├── controllers/    # Controllers
│   │   │   ├── middlewares/    # Middlewares
│   │   │   ├── routes/         # Rotas
│   │   │   ├── services/       # Lógica de negócio
│   │   │   └── prisma/         # Schema do banco
│   │   └── package.json
│   │
│   └── nlp-engine/             # Backend Python
│       ├── api/                # Endpoints FastAPI
│       ├── services/           # Serviços NLP
│       ├── models/             # Modelos de dados
│       └── requirements.txt
│
├── packages/                   # Pacotes compartilhados
│   └── shared-types/           # TypeScript types
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lumina"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# NLP Engine
NLP_ENGINE_URL=http://localhost:8000

# Redis (opcional)
REDIS_URL=redis://localhost:6379
```

---

## 📊 Screenshots

<div align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="800"/>
  <p><em>Dashboard principal com métricas em tempo real</em></p>
</div>

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **ShadcnUI** - Componentes acessíveis
- **Recharts** - Gráficos interativos
- **Clerk** - Autenticação

### Backend Node.js
- **Express** - Framework web
- **Prisma** - ORM type-safe
- **Stripe** - Processamento de pagamentos
- **Zod** - Validação de schemas

### Backend Python
- **FastAPI** - API de alta performance
- **NLTK** - Natural Language Toolkit
- **spaCy** - NLP industrial-strength
- **TextBlob** - Análise de sentimento simplificada
- **Pydantic** - Validação de dados

### Infraestrutura
- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache e filas
- **Docker** - Containerização

---

## 📈 Planos e Preços

| Recurso | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Análises/mês | 100 | 5.000 | Ilimitado |
| Upload CSV | ✅ | ✅ | ✅ |
| Scraping de URLs | ❌ | ✅ | ✅ |
| Exportar relatórios | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Suporte | Community | Email | Dedicado |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Desenvolvido com ❤️ para fins de portfólio</p>
  <p>
    <a href="https://github.com/seu-usuario">GitHub</a> •
    <a href="https://linkedin.com/in/seu-usuario">LinkedIn</a>
  </p>
</div>
