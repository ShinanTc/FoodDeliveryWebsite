const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();

const prisma = new PrismaClient();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const foods = await prisma.Foods.findMany({})
  res.render('index', { foods });
});

module.exports = router;