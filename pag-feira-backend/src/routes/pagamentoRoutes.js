const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas (Apenas cobradores logados podem acessar)
router.post('/', authMiddleware, pagamentoController.registrarPagamento);
router.get('/hoje', authMiddleware, pagamentoController.listarPagamentosDeHoje);

module.exports = router;