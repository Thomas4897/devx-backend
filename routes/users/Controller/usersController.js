const { v4: uuidv4 } = require('uuid');
const User = require("../Model/User")

const createUser = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const foundUser = await User.findOne({ email: email });
      console.log(foundUser);

      // Creating a New User Object;
      if (foundUser === null) {
        let newUser = new User({
          id: uuidv4(),
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        });
  
        // Use .save() to save new user object to DB
        let savedUser = await newUser.save();
  
        res.status(200).json({
          message: "User Successfully Logged In.",
          payload: savedUser,
        });
      } else {
        res.status(200).json({
          message: "Email already exists.",
        });
      }
  
      // res.redirect("/login-form");
    } catch (error) {
      res.status(500).json({
        message: "Login User Error",
        error: error.message,
      });
    }
  };
  
  module.exports = {
    createUser,
  }