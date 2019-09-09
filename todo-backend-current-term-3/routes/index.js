var express = require('express');
var router = express.Router();

var uuidV4 = require('uuid/v4');

let todos = []

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.json(todos);
});

module.exports = router;
