var express = require('express');
var router = express.Router();
const { addToUserFavorites, createUser, signIn, signOut } = require("../users/Controller/usersController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-user", createUser);

router.get("/sign-out", signOut);

router.post("/sign-in", signIn);

// router.get("/get-all-users", getAllUsers);

router.post("/add-to-user-favorites", addToUserFavorites);


module.exports = router;
