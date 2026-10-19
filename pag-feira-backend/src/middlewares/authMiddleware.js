const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // O token geralmente vem no cabeçalho Authorization no formato: "Bearer <token>"
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' })
    }

    // Separa o "Bearer" do token em si
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token malformado.' })
    }

    try {
        // Verifica se o token é válido usando a chave secreta do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Anexa os dados do cobrador (como o ID) na requisição (req) para usarmos nos próximos controllers
        req.cobrador = decoded;

        // Libera a passagem para a rota
        next();
    } catch (error) {
         res.status(401).json({ mensagem: 'Token inválido ou expirado.' })
    }
}