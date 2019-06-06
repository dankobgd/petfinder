const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ msg: 'users' });
});

module.exports = router;
