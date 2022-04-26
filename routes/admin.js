require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  let { username, password } = req.body;

  // AUTHENTICATING ADMIN
  // Hashing Entered Password
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    // Checking database for username
    const user = await prisma.Admin.findUnique({
      where: { name: username }
    });

    // Comparing Entered Password and Password on the database
    const comparePassword = await bcrypt.compare(hashPassword, user.password);

    // Checking if Password Exist / Incorrect
    if (comparePassword == null)
      res.status(400).send("User doesn't Exist");
    else
      res.status(200).render('admin/admin-home');

    // AUTHORIZING ADMIN
    // jwt.sign()
  } catch (error) {
    next(error);
    res.status(400).send("user doesn't Exist!!!");
  }
});

module.exports = router;