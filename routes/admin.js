require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { compare } = require('bcrypt');

const prisma = new PrismaClient();

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  let { username, password } = req.body;
  console.log(username, password);

  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);

  try {
    // Checking database for username and password
    const user = await prisma.Admin.findMany({
      where: { name: username }
    });

    const comparePassword = await bcrypt.compare(hashPassword, user[0].password);

    if (comparePassword == null)
      res.status(400).send("User doesn't Exist");
    else
      res.render('admin/admin-home');
  } catch (error) {
    next(error);
    res.status(400).send("user doesn't Exist!!!");
  }
});

module.exports = router;