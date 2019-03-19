var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  console.log(req.post)
});

module.exports = router;
