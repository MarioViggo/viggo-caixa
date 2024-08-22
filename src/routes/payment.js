const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController')
//router.post('/pagamento', controller.store);

// credit_card
router.post('/signature', controller.signature);
router.post('/anual-2', controller.anual2);
router.post('/anual-3', controller.anual3);
router.post('/mensal-2', controller.mensal2);
router.post('/mensal-3', controller.mensal3);
router.post('/trimestral-2', controller.trimestral2);
router.post('/trimestral-3', controller.trimestral3);
router.post('/semestral-2', controller.semestral2);
router.post('/semestral-3', controller.semestral3);
router.post('/boleto', controller.boleto);
router.post('/pix', controller.pix);
router.post('/invoice', controller.invoice);


// boleto 


// pix 
module.exports = router;
