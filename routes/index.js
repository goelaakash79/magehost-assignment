const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/feed', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/feed', (req, res) => {
  console.log(req.post);
});

module.exports = router;
