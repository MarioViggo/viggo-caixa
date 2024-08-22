const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const router = express.Router();
//Rotas
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const index = require('./routes/index');
const alunoRoute = require('./routes/alunos');
const paymentRoute = require('./routes/payment');
const authRoute = require('./routes/auth');
require('./mongodb');
var cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use('/', jsonParser, index);
app.use('/alunos', jsonParser, alunoRoute);
app.use('/payment', jsonParser, paymentRoute);
app.use('/auth', jsonParser, authRoute);
module.exports = app;
