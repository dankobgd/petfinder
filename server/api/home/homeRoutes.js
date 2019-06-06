const router = require('express').Router();

router.get('/', async (req, res, next) => {
  res.json({ msg: 'index' });
});

module.exports = router;
