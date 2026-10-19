const mongoose = require('mongoose');

const feiranteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: false // Opcional, pois alguns preferem papel
    },
    qtdBancasZinco: {
        type: Number,
        default: 0,
        required: true // R$ 10 cada
    },
    qtdBancasMadeira: {
        type: Number,
        default: 0,
        required: true // R$ 5 cada
    },
    ativo: {
        type: Boolean,
        default: true // Permite ocultar feirantes que pararam de ir à feira sem deletar o histórico
    }
}, { timestamps: true });

// Podemos criar um "Campo Virtual" que calcula automaticamente o valor total do aluguel
feiranteSchema.virtual('valorTotal').get(function() {
    return (this.qtdBancasZinco * 10) + (this.qtdBancasMadeira * 5 )
})

// Força o Mongoose a enviar os campos virtuais quando a API responder em JSON]
feiranteSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Feirante', feiranteSchema)