var express = require('express');
var router = express.Router();

router.get('/checkouts/new', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
