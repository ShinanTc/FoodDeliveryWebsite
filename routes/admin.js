const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();

const prisma = new PrismaClient();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('admin/admin-home');
});

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.Admin.findMany({
      where: {
        name: username,
        password
      }
    });

    if (user.length == 0)
      console.log("Authentication Failed");
    else {
      res.status(200).render('admin/admin-home');
      console.log("Authentication Success");
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;