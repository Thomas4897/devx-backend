var express = require('express');
var router = express.Router();
const { checkIsEmpty } = require("../../utils/checkIsEmpty")
const { getUser, getAllUsers, createUser } = require("../users/Controller/usersController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/get-user/:email/:password", getUser);

router.get("/get-all-users", getAllUsers);


router.post("/create-user", checkIsEmpty, createUser);

module.exports = router;
