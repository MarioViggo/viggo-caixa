
let usuarioModel = require('../models/Usuario')
const jwt = require('jsonwebtoken');
exports.login = async(req, res, next) => {
    // add hash md5   
    const usuario = await usuarioModel.findOne({email: req.body.email, password: req.body.password})
    if (usuario) {
        let id = usuario._id 
        const token = jwt.sign({usuario}, process.env.SECRET, {
            expiresIn: 3600
          });
          usuario.password = ""

          return res.json({ auth: true, token: token, user: usuario });
    }

    return res.status(500).send("Login recusado!");
};

exports.cadastrarAdmin = async (req, res) => {
    const { email, password } = req.body
   
    try {
        const usuario = new usuarioModel({
            email,
            password
        })
    
        await usuario.save()
    
        res.status(201).send(usuario);
    } catch (err) {
        console.log(err)
        return res.status(500).send({error: err})
    }
};