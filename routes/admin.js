require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

router.get('/dashboard', authenticateToken, (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, data) => {
    if (err) res.sendStatus(403);
    else res.json({ data });
  })
  // res.render('admin/admin-dashboard');
});

router.get('/login', (req, res, next) => {
  res.json({
    message: 'Welcome to the API'
  });
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  // let { username, password } = req.body;
  // console.log(username, password);

  // AUTHENTICATING ADMIN
  // Hashing Entered Password
  // const hashPassword = await bcrypt.hash(password, 10);

  try {
    // Checking database for username
    // const user = await prisma.Admin.findUnique({
    //   where: { name: username }
    // });

    // Comparing Entered Password and Password on the database
    // const comparePassword = await bcrypt.compare(hashPassword, user.password);

    // Checking if Password Exist / Incorrect
    // if (comparePassword == null)
    //   res.status(400).send("User doesn't Exist");
    // else
    //   res.status(200).send("User Avaiable");

    // console.log(user);

    // AUTHORIZING ADMIN
    const user = {
      id: 1,
      username: 'admin',
      password: 'admin123'
    }

    jwt.sign({ user }, 'secretkey', { expiresIn: '20s' }, (err, token) => {
      res.json({ token });
    });

  } catch (error) {
    res.status(400).send("User doesn't Exist!!!");
    next(error);
  }
});

function authenticateToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;