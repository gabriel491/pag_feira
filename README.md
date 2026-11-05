# 🛒 Feira Control - Sistema de Gerenciamento Inteligente

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-yellow)

O **Feira Control** é uma aplicação web moderna e *mobile-first*, desenvolvida para facilitar a gestão de feirantes e a arrecadação diária em feiras livres. O sistema foi projetado para uso dinâmico (cobradores caminhando pela feira), oferecendo uma interface rápida, limpa e com prevenção de toques acidentais (*fat-finger prevention*).

---

## ✨ Funcionalidades Principais

### 👥 Gestão de Feirantes
- **Cadastro Completo:** Registro de nome, WhatsApp e quantidade de bancas (Zinco/Madeira).
- **Cálculo Automático:** O sistema calcula dinamicamente o valor total que cada feirante deve pagar com base em suas bancas.
- **Edição Segura:** Alteração de dados cadastrais protegida por modais intuitivos.
- **Soft Delete (Arquivo Morto):** Feirantes inativos são ocultados da lista principal em vez de excluídos, preservando o histórico financeiro.
- **Reativação:** Restauração fácil de feirantes inativos através do painel de "Arquivo Morto".

### 💰 Controle de Caixa e Pagamentos
- **Cobrança Ágil:** Botão de recebimento rápido que sugere o valor exato da cobrança.
- **Prevenção de Duplicidade:** Trava de segurança no backend (API) que impede que o mesmo feirante seja cobrado duas vezes no mesmo dia.
- **Feedback Visual Instantâneo:** Ao registrar um pagamento, o botão muda automaticamente para "✅ Recebido".
- **Painel Flutuante (Caixa do Dia):** Um painel *sticky* (fixo no topo da tela) que soma e exibe em tempo real toda a arrecadação do dia enquanto o usuário rola a lista.

### 📊 Relatórios e Integrações
- **Fechamento do Dia:** Tela dedicada que compila o total arrecadado, quantidade de pagamentos e a lista de feirantes que pagaram.
- **Integração com WhatsApp:** Geração de um relatório de texto limpo, devidamente formatado, e envio direto via link do WhatsApp para administradores.

### 🔐 Segurança e Autenticação
- **Login Seguro:** Autenticação baseada em JWT (JSON Web Tokens).
- **Renovação de Sessão:** Interceptadores Axios (`axios.interceptors`) configurados para renovar tokens silenciosamente (Refresh Token), prevenindo loops infinitos e quedas de sessão.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React (Vite/CRA):** Biblioteca principal para construção da interface de usuário.
- **Tailwind CSS:** Framework utilitário para estilização rápida, responsiva e moderna.
- **Lucide React:** Biblioteca de ícones SVG leves e consistentes em qualquer dispositivo.
- **React Router Dom:** Gerenciamento de rotas e navegação (Login, Home, Relatório).
- **Axios:** Cliente HTTP para comunicação com a API.
- **jwt-decode:** Decodificação do payload do token JWT no frontend.

### Backend
- **Node.js & Express:** Servidor e framework para a construção da API REST.
- **MongoDB & Mongoose:** Banco de dados NoSQL e modelagem de dados orientada a objetos.
- **JWT (JsonWebToken):** Geração e validação de tokens de acesso.
- **Arquitetura MVC:** Separação clara entre Models, Controllers e Routes.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Você precisará ter instalado na sua máquina:
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/) (Local ou Atlas)
- Git (para clonar o repositório)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/feira-control.git
   cd feira-control
   ```

2. **Configurando o Backend (API):**
   ```bash
   cd backend
   npm install
   ```
   *Crie um arquivo `.env` na raiz da pasta `backend` com as variáveis de ambiente:*
   ```env
   PORT=5000
   MONGO_URI=sua_string_de_conexao_mongodb
   JWT_SECRET=sua_chave_secreta_super_segura
   ```
   *Inicie o servidor:*
   ```bash
   npm start
   ```

3. **Configurando o Frontend:**
   *Abra um novo terminal e vá para a pasta do frontend:*
   ```bash
   cd frontend
   npm install
   ```
   *Inicie a aplicação React:*
   ```bash
   npm run dev
   # ou npm start (dependendo de como o projeto foi criado)
   ```

4. Acesse a aplicação no navegador através de `http://localhost:3000` (ou a porta indicada pelo Vite/React).

---

## 🎨 Decisões de Design (UX/UI)
O sistema foi desenvolvido pensando nas dificuldades reais de um ambiente de feira (sol na tela do celular, barulho, movimentação rápida):
- **Cores contrastantes:** Fundo verde escuro para finanças e modais brancos para foco.
- **Botões Grandes e Afastados:** Para evitar toques acidentais, ações destrutivas (como desativar) estão ocultas dentro do fluxo de edição.
- **Uso de Ícones:** Substituição de emojis nativos por ícones SVG padronizados (`lucide-react`) para garantir a mesma experiência em Android, iOS e Desktop.

---

✍️ Desenvolvido com muita dedicação.