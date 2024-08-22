let usuarioModel = require('../models/Usuario')
const jwt = require('jsonwebtoken');
exports.decodeIDToken = async (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const idToken = req.headers.authorization.split('Bearer ')[1];
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
      res.setHeader('Content-Security-Policy', "default-src 'self'")
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Referrer-Policy', 'no-referrer')
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
      try {
        const decoded = jwt.verify(idToken, process.env.SECRET)
        const mongoUser = await usuarioModel.findOne({email: decoded.usuario.email})
        if (!mongoUser) {  
          return res.status(403).send('Voce nao está logado!');
        }
  
        if (mongoUser) req['currentUser'] = mongoUser
      } catch (err) {
        console.log(err);
        return res.status(403).send('Voce nao está logado!');
      }
    } else {
      return res.status(403).send('Voce nao está logado!');
    }
  
    next();
  }
  