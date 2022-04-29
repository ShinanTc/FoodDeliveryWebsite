require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ dest: '/public' });

// ADMIN - DASHBOARD
router.get('/dashboard', verifyToken, (req, res, next) => {
  res.render('admin/admin-dashboard');
});

// ADMIN - LOGIN
router.get('/login', (req, res, next) => {
  res.render('admin/admin-login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // Hashing Entered Password
  const hashPassword = await bcrypt.hash(password, 10);

  // Checking database for username
  const user = await prisma.Admin.findUnique({
    where: { name: username }
  });

  const comparePassword = await bcrypt.compare(hashPassword, user.password);

  // Checking if the password exist or not
  if (comparePassword == null)
    res.status(400).send("Password is Incorrect");
  else {

    // Hashing User id
    const hashedId = await bcrypt.hash(`${user.id}`, 10);

    // Signing JWT token
    const accessToken = jwt.sign({ id: hashedId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
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

  const filePath = `/images/${filename}`;

  file.mv(`./public/images/${filename}`, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("File Uploaded!!!");
    }
  });


  try {
    const createdFood = await prisma.Foods.create({
      data: {
        productName: productname,
        imageUrl: filePath
      }
    });

  } catch (error) {
    res.status(500).send(error.message);
  }

});

// ADMIN - VIEW PRODUCTS
router.get('/view-products', verifyToken, async (req, res, next) => {
  const foods = await prisma.Foods.findMany();
  res.render('admin/admin-view-products', { foods });
});

// ADMIN - DELETE PRODUCT
router.delete('/del-product/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedFood = await prisma.Foods.delete({
      where: {
        id: Number(id),
      },
    });
    res.redirect('/admin/view-products');
    console.log(deletedFood);

  } catch (error) {
    res.send(error);
  }


  console.log(food);
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
