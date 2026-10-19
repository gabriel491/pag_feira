const mongoose = require('mongoose')

const cobradorSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true,
    },
    ativo: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('cobrador', cobradorSchema)