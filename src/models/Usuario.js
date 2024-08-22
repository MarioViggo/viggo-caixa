const { Schema, model, mongoose } = require('mongoose');

const UsuarioSchema = new Schema({
    email: {
        type: String, 
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    tipo: {
        type: String, 
    },
}, { timestamps: true });


module.exports = model('Usuarios', UsuarioSchema);