var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('admin/admin-home');
});

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

module.exports = router;