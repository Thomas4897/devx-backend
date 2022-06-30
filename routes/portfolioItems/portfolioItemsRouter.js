var express = require('express');
var router = express.Router();
// const { checkIsEmpty } = require("../../utils/checkIsEmpty")
const { createPortfolioItem, getAllPortfolioItems, getUserPortfolioItems } = require("../portfolioItems/Controller/portfolioItemController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-portfolio-item", createPortfolioItem);
// router.post("/create-portfolio-item", function(req, res, next) {
//   res.send('Hello from /create-portfolio-item');
// });


// router.get("/sign-out", signOut);

// router.post("/sign-in", signIn);

router.post("/get-all-portfolio-items", getAllPortfolioItems);

router.post("/get-user-portfolio-items", getUserPortfolioItems);


module.exports = router;
