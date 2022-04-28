require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const prisma = new PrismaClient();

router.get('/dashboard', verifyToken, (req, res, next) => {
  res.render('admin/admin-dashboard');
});

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  //    Hashing Entered Password
  const hashPassword = await bcrypt.hash(password, 10);

  //     // Checking database for username
  const user = await prisma.Admin.findUnique({
    where: { name: username }
  });

  const comparePassword = await bcrypt.compare(hashPassword, user.password);

  if (comparePassword == null)
    res.status(400).send("Password is Incorrect");
  else {
    const accessToken = jwt.sign({ user }, 'secretkey');
    res.cookie("token", accessToken, { httpOnly: true });

    res.redirect('/admin/dashboard');
  }

})



module.exports = router;