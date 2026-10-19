const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // O await aqui é obrigatório para esperar a conexão responder
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Conectado com sucesso: ${conn.connection.host || 'Cluster Ativo'}`);
  } catch (error) {
    console.error(`Erro ao conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;