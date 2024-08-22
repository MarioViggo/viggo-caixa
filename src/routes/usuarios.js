const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController')
router.post('/login', controller.login);
router.post('/cadastrarAdmin', controller.cadastrarAdmin);
router.post('/cadastrarFuncionario', controller.cadastrarFuncionario);
router.delete('/deletarFuncionario/:funcionarioId', controller.deletarFuncionario);
router.delete('/editarFuncionario/:funcionarioId', controller.editarFuncionario);

module.exports = router;
