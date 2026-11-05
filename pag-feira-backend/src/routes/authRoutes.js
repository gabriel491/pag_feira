const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para cadastrar um cobrador (POST /api/auth/register)
router.post('/registrar', authController.registrar);

// Rota para fazer login (POST /api/auth/login)
router.post('/login', authController.login);

router.post('/renovar-token', authController.renovarToken); 

module.exports = router;