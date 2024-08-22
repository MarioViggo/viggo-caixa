const { Schema, model, mongoose } = require('mongoose');

const UsuarioSchema = new Schema({
    email: {
        type: String, 
        required: true,
    },
    nome: {
        type: String, 
        required: true,
    },
    documento: {
        type: String, 
        required: true,
    },
    nickname: {
        type: String, 
    },
    senha: {
        type: String, 
        required: true,
    },
    nivel_de_acesso: {
        type: String, 
        required: true,
        enum: ['funcionario', 'admin'],
        default: 'funcionario'
    },
}, { timestamps: true });


module.exports = model('Usuarios', UsuarioSchema);