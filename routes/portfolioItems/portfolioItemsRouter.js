var express = require('express');
var router = express.Router();
const { createPortfolioItem, getAllPortfolioItems, getUserPortfolioItems } = require("../portfolioItems/Controller/portfolioItemController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-portfolio-item", createPortfolioItem);

router.post("/get-all-portfolio-items", getAllPortfolioItems);

router.post("/get-user-portfolio-items", getUserPortfolioItems);


module.exports = router;
