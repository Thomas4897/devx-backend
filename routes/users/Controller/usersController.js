const { v4: uuidv4 } = require('uuid');
const User = require("../Model/User")
const bcrypt = require('bcryptjs');

const getUser = async (req, res) => {
  //! All of the logic on how to get the product
  try {
    const { email, password } = req.params;

    //! fetches data from the db
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      throw {
        message: "Email not found",
      };
    }

    const comparedPassword = await bcrypt.compare(password, foundUser.password);
 
    if (!comparedPassword) {
      throw {
        message: "Email and Password do not match",
      };
    }
    // res.send({foundUser: foundUser});
    res.status(200).json({
      message: "User Successfully Logged In.",
      payload: foundUser,
    });
  } catch (error) {
    res.send({
      error: error.message
    });

    // res.status(500).json({
    //   error: error.message
    // });
  }
};

const getAllUsers = async (req, res, next) => {
  //! All of the logic on how to get the product
  try {
      //! fetches data from the db
      const foundUsers = await User.find({});
     
      res.send(foundUsers);
  } catch (error) {
      console.log('error', error);
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const foundUser = await User.findOne({ email: email });

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    // Creating a New User Object;
    if (foundUser === null) {
      let newUser = new User({
        id: uuidv4(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });

      // Use .save() to save new user object to DB
      let savedUser = await newUser.save();

      res.status(200).json({
        message: "User Successfully Created.",
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
      error: error.message,
    });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  createUser,
}