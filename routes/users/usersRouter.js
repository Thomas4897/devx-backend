var express = require('express');
var router = express.Router();
const { checkIsEmpty } = require("../../utils/checkIsEmpty")
const { getAllUsers, createUser, signIn, signOut } = require("../users/Controller/usersController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-user", checkIsEmpty, createUser);

router.get("/sign-out", signOut);

router.post("/sign-in", signIn);

router.get("/get-all-users", getAllUsers);

module.exports = router;
