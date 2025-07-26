const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

module.exports = router;
