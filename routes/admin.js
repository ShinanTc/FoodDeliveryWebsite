require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
var md5 = require('md5');

const prisma = new PrismaClient();

router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  try {
    let { username, password } = req.body;
    console.log(username, password);

    // Salting
    // Converting String to Character Array
    const usingSplit = password.split('');
    
    // Adding '&' symbol to the end of the Array
    usingSplit.push('&');
    
    // Adding '&' symbol to the beginning of the Array
    usingSplit.unshift('&');

    // Converting Character Array back to String
    const joinSplit = usingSplit.join('');
    password = md5(joinSplit);

    // Checking database for username and password
    const user = await prisma.Admin.findMany({
      where: { name: username, password }
    });

    console.log(user);

    if (user.length === 0)
      console.log("Authentication Failed!");
    else {
      res.render('admin/admin-home');
      console.log("Authentication Successfull!");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;