const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
    feiranteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feirante',
        required: true
    },
    cobradorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Cobrador',
        required: true
    },
    valorPago: {
        type: Number,
        required: true // Salva o valor exato pago no dia, garantindo precisão no fechamento do caixa
    },
    dataPagamento: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Pagamento', pagamentoSchema)