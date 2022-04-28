const { PrismaClient } = require('@prisma/client');
var express = require('express');
var router = express.Router();

const prisma = new PrismaClient();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;