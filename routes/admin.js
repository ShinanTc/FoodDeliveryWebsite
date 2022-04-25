require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body;
    console.log(username, password);

    const user = await prisma.Admin.findMany({
      where: { name: username, password }
    });

    console.log(user);

    if (user.length === 0)
      console.log("Authentication Failed!");
    else
      console.log("Authentication Successfull!");

    const accessToken = jwt.sign(user[0], process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });

  } catch (error) {
    next(error);
  }
})

module.exports = router;