const { Schema, model, mongoose } = require('mongoose');

const VendasSchema = new Schema({
    data_da_venda: {
        type: Date, 
        required: true,
    },
    // se o number nao cobrir a demanda de casas decimais usar o decimal128
    valor_total: {
        type: Number, 
        required: true,
    },
    list_de_produtos: [{
        type: String, 
        required: true,
    }],
    funcionario: {
        type: mongoose.Types.ObjectId, 
        ref: 'Usuario',
    },

}, { timestamps: true });


module.exports = model('Vendas', VendasSchema);