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
      const token = jwt.sign({ id: cobrador._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      res.json({
        mensagem: "Login realizado com Sucesso!",
        token,
        cobrador: { id: cobrador._id, nome: cobrador.nome },
      });
    } catch (error) {
      res
        .status(500)
        .json({ mensagem: "Erro no servidor!", error: error.message });
    }
  };