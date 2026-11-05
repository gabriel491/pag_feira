const express = require('express');
const router = express.Router();
const feiranteController = require('../controllers/feiranteController');
// Importa o segurança (Middleware)
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas de Criar e Listar feirantes
router.post('/', authMiddleware, feiranteController.criar);
router.get('/', authMiddleware, feiranteController.listar);

// Rotas de Feirantes Inativos
router.get('/inativos', authMiddleware, feiranteController.listarInativos);
router.get('/:id', authMiddleware, feiranteController.buscarPorId);

// authMiddleware foi removido
router.get('/:id', feiranteController.buscarPorId);

// Rotas de Editar, Exluir e Inativar feirante
router.put('/:id', authMiddleware, feiranteController.editar);
router.delete('/:id', authMiddleware, feiranteController.excluir);
router.delete('/definitivo/:id', authMiddleware, feiranteController.excluirDefinitivamente);

module.exports = router;