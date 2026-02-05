const express = require('express');
const router = express.Router();
const controller = require('../controllers/votos.controller');


router.post('/', controller.votar);
router.get('/apuracao', controller.apuracao);
router.get('/status', controller.statusUrna);
router.post('/liberar', controller.liberarUrna);



module.exports = router;
