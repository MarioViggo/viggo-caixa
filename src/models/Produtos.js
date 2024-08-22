const { Schema, model, mongoose } = require('mongoose');

const ProdutosSchema = new Schema({
    descricao: {
        type: String, 
        required: true,
    },
    codigo_sequencial: {
        type: String, 
        required: true,
    },
    codigo_de_barras: [Buffer],
    status: {
        type: String,
        enum: ['ativo', 'inativo'], 
        required: true,
    },
    estoque: {
        type: Number, 
        required: true,
    },
    imagens: [{Buffer}],
}, { timestamps: true });


module.exports = model('Produtos', ProdutosSchema);