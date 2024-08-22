const express = require('express');
const router = express.Router();
const controller = require('../controllers/alunosController')
const { decodeIDToken } = require('../middlewares/auth')

router.post('/cadastrar', controller.cadastrar);
router.post('/cadastrarPlano', controller.cadastrarPlano);
router.get('/obterAlunos', controller.obterAlunos);
router.get('/obterAluno/:cpf', controller.obterAluno);
router.get('/obterRelatorio', controller.obterRelatorio);
router.use(async (req, res, next) => {
  try {
    await decodeIDToken(req, res, next);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
})


module.exports = router;
