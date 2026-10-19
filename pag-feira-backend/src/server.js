require('dotenv').config();
const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db');

// Importar as rotas
const authRoutes = require('./routes/authRoutes')
const feiranteRoutes = require('./routes/feiranteRoutes')
const pagamentoRoutes = require('./routes/pagamentoRoutes');

const app = express();

connectDB();

// Middlewares Globais
app.use(cors())
app.use(express.json())

// Configurar as rotas no app
app.use('/api/auth', authRoutes)
app.use('/api/feirantes', feiranteRoutes)
app.use('/api/pagamentos', pagamentoRoutes)

// Rota de Teste
app.get('/', (req, res) => {
    res.json("mensagem: 'API do PagFeira rodando com sucesso!")
})

// Inicialização
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Porta rodando na porta: ${PORT}`);  
})