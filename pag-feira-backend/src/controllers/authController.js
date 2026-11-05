const Cobrador = require("../models/Cobrador");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Função para registrar um novo cobrador
exports.registrar = async (req, res) => {
  try {
    const { nome, login, senha } = req.body;

    // verifica se o login já existe
    const cobradorExiste = await Cobrador.findOne({ login });
    if (cobradorExiste) {
      return res.status(400).json({ mensagem: "Este login já está em uso." });
    }

    // Criptografa a senha antes de salvar no banco (10 rounds de salt)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Cria novo cobrador
    const novoCobrador = await Cobrador.create({
      nome,
      login,
      senha: senhaCriptografada,
    });

    res.status(201).json({
      mensagem: "Cobrador cadastrado com Sucesso!",
      cobrador: {
        id: novoCobrador._id,
        nome: novoCobrador.nome,
        login: novoCobrador.login,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor", erro: error.message });
  }
};

// Função para fazer o login e gerar o Token
exports.login = async (req, res) => {
    try {
      const { login, senha } = req.body;

      // Busca o cobrador no banco
      const cobrador = await Cobrador.findOne({ login });
      if (!cobrador) {
        return res.status(401).json({ mensagem: "Login ou Senha inválidos." });
      }

      // Compara a senha digitada com a senha criptografada do banco
      const senhaValida = await bcrypt.compare(senha, cobrador.senha);
      if (!senhaValida) {
        return res.status(401).json({ mensagem: "Login ou Senha inválidos." });
      }

      // Se a senha estiver correta, gera o Token JWT
      // O token vai guardar o ID do cobrador e expirar em 12 horas
      const token = jwt.sign(
        { 
          id: cobrador._id, 
          login: cobrador.login, 
          nome: cobrador.nome 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: "12h" } // Mantendo 10s para testes, ou volte para "12h"
      );

      // Refresh Token (longa duração)
      const refreshToken = jwt.sign({ id: cobrador._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "90d",
      })

      // Enviando o Refresh Token como Cookie HttpOnly
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Deixe false no localhost. Em produção (com HTTPS), mude para true!
        maxAge: 90 * 24 * 60 * 60 * 1000 // 90 dias em milissegundos
      })

      // Devolvendo apenas o Access Token no JSON
      res.json({
        mensagem: "Login realizado com Sucesso!",
        token,
        cobrador: { id: cobrador._id, nome: cobrador.nome },
      });
    } catch (error) {
      console.error("Erro no login:", error);

      res
        .status(500)
        .json({ mensagem: "Erro no servidor!", error: error.message });
    }
};

// Função para renovar o Access Token usando o Cookie HttpOnly
exports.renovarToken = async (req, res) => {
  // Recupera o cookie enviado pelo navegador
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return res.status(401).json({ mensagem: "Refresh Token não fornecido." });
  }

  try {
    // Valida a assinatura com a chave secreta do refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 1. Vai à base de dados buscar o nome e o login do cobrador
    const cobrador = await Cobrador.findById(decoded.id);

    if (!cobrador) {
       return res.status(404).json({ mensagem: "Utilizador não encontrado." });
    }

    // 2. Emite um novo Access Token já com os dados completos
    const novoAccessToken = jwt.sign(
      { 
        id: cobrador._id,
        login: cobrador.login,
        nome: cobrador.nome 
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" } // Mude para 10s de novo para facilitar os nossos testes
    );

    // Devolve o novo token em formato JSON
    return res.json({
      token: novoAccessToken,
    });
  } catch (error) {
    // Cai aqui se o token estiver expirado ou adulterado
    return res.status(403).json({ mensagem: "Sessão expirada. Faça login novamente." });
  }
};