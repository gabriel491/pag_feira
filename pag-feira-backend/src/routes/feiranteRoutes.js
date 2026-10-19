const express = require('express');
const router = express.Router();
const feiranteController = require('../controllers/feiranteController');
// Importa o segurança (Middleware)
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas (Note que o authMiddleware entra no meio, antes do controller)
router.post('/', authMiddleware, feiranteController.criar);
router.get('/', authMiddleware, feiranteController.listar);
router.put('/:id', authMiddleware, feiranteController.editar);
router.delete('/:id', authMiddleware, feiranteController.excluir);

module.exports = router;