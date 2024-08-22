const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const router = express.Router();
const multer = require('multer');

//Rotas
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const index = require('./routes/index');
const usuariosRoute = require('./routes/usuarios');
const vendasRoute = require('./routes/vendas');
const produtosRoute = require('./routes/produtos');
const upload = multer({ dest: 'cadastrarProduto/' });
const maxFotos = 3;
require('./mongodb');
var cors = require('cors');
app.use(cors());
//app.use(multer().single('codigo_de_barras'))
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use('/', jsonParser, index);
app.use('/usuarios', jsonParser, usuariosRoute);
app.use('/vendas', jsonParser, vendasRoute);
app.use('/produtos', multer().fields([{name: 'codigo_de_barras', maxCount: 1}, {name: 'imagens', maxCount: 3}]), produtosRoute);
module.exports = app;
