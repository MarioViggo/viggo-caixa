const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController')


router.post('/cadastrarProduto',  controller.cadastrarProduto);

module.exports = router;
