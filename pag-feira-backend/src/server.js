require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// Importar as rotas
const authRoutes = require('./routes/authRoutes')
const feiranteRoutes = require('./routes/feiranteRoutes')
const pagamentoRoutes = require('./routes/pagamentoRoutes');

const app = express();

connectDB();

// Middlewares Globais
app.use(express.json())
app.use(
  cors({
    // Permite conexões tanto do seu PC (desenvolvimento) quanto da Vercel (produção)
    origin: [
      "https://pag-feira-frontend.vercel.app",
      "http://localhost:5173"
    ], 
    credentials: true,
  })
);

// Configurar as rotas no app
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/feirantes', feiranteRoutes)
app.use('/api/pagamentos', pagamentoRoutes)

// Rota de Teste (Corrigida para retornar um objeto JSON válido)
app.get('/', (req, res) => {
    res.json({ mensagem: "API do PagFeira rodando com sucesso!" })
})

// Inicialização
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);  
})