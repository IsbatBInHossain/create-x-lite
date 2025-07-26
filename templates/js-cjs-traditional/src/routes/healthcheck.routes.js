const { Router } = require('express');
const { getHealth } = require('../controllers/healthcheck.controller.js');

const router = Router();

router.get('/', getHealth);

module.exports = router;
