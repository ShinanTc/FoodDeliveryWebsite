require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const prisma = new PrismaClient();

// AMDIN - DASHBOARD
router.get('/dashboard', verifyToken, (req, res, next) => {
  res.render('admin/admin-dashboard');
});

// ADMIN - LOGIN
router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  //    Hashing Entered Password
  const hashPassword = await bcrypt.hash(password, 10);

  // Checking database for username
  const user = await prisma.Admin.findUnique({
    where: { name: username }
  });

  const comparePassword = await bcrypt.compare(hashPassword, user.password);

  if (comparePassword == null)
    res.status(400).send("Password is Incorrect");
  else {
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    res.cookie("token", accessToken, { httpOnly: true });

    res.redirect('/admin/dashboard');
  }

});

// ADMIN - ADD PRODUCT
router.get('/add-product', verifyToken, (req, res, next) => {
  res.render('admin/admin-add-product');
});

router.post('/add-product', verifyToken, async (req, res, next) => {
  const { productname } = req.body;

  if (req.files) {
    var file = req.files.productimg;
    var filename = file.name;
  }
  else {
    res.status(400).send("No File Uploaded");
  }

  file.mv(`./public/images/${filename}`, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("File Uploaded!!!")
    }
  });


  try {
    const product = await prisma.Foods.create({
      data: {
        productName: productname,
        imageUrl: file
      }
    });

    console.log(product + 'is pushed =========================================');

  } catch (error) {
    res.status(500).send(error.message);
  }

});

// ADMIN - VIEW PRODUCTS
router.get('/view-products', verifyToken, async (req, res, next) => {
  const foods = await prisma.Foods.findMany({});
  res.render('admin/admin-view-products', { foods });
});

// ADMIN - DELETE PRODUCT
router.get('/del-product', verifyToken, (req, res, next) => {

});

// ADMIN - LOGOUT
router.get('/logout', verifyToken, (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/admin/login');
  } else {
    res.clearCookie("token");
    res.redirect('/admin/login');
  }
});

module.exports = router;
