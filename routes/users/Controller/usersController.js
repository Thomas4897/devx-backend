const { v4: uuidv4 } = require('uuid');
const User = require("../Model/User")
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const cleanUser = (userDocument) => {
  return {
    id: userDocument.id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    image: userDocument.image
    // isAdmin: userDocument.isAdmin,
  }
}

const getToken = (userId) => {
  //! Generate a token that he user can use to indicate that they are logged in
  //* 'iat' stands for issued at time
  const token = jwt.sign({ userId, iat: Date.now() }, process.env.JWT_SECRET_KEY);

  //! provide that token to the client
  return token;
};

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, image, email, password } = req.body;
    const foundUser = await User.findOne({ email: email });

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    // Creating a New User Object;
    if (foundUser === null) {
      let newUser = new User({
        id: uuidv4(),
        firstName: firstName,
        lastName: lastName,
        image: image,
        email: email,
        password: hashedPassword,
      });

      // Use .save() to save new user object to DB
      let savedUser = await newUser.save();

      const token = getToken(savedUser._id)

      res.cookie('session_token', token)
      // console.log('savedUser:', cleanUser(savedUser));
      res.status(200).json({
        message: "User Successfully Created.",
        payload: { user: cleanUser(savedUser) },
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

const signIn = async (req, res, next) => {

  try {
    const {
      email,
      password
    } = req.body.credentials

    const foundUser = await User.findOne({ email: email })

    // console.log('user:', foundUser)

    if (!foundUser) {

      return res.status(401).json({ error: "User not found" })
    }

    //! If user is found check the password
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    console.log('passwordMatch:', passwordMatch)
    if (!passwordMatch) {
      return res.status(401).json({ error: "User and Password do not match" })
    }

    const token = getToken(foundUser._id)

    res.cookie('session_token', token),

      res.send({ user: cleanUser(foundUser) })
  } catch (error) {
    console.log("error:", error)
    res.send({
      message: error.message,
      error: error,
    })

  }
};

const signOut = (req, res, next) => {
  try {
    res.clearCookie('session_token', { httpOnly: true, secure: false }).send('Signed out');
  } catch (error) {
    console.log('error:', error);
  }
}

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

const addToUserFavorites = async (req, res, next) => {
  try {
    const portfolioItemId = req.body.portfolioItemId;

    const userId = req.user.id;

    let foundUser = await User.findOne({ id: userId });

    // Creating a New User Object;
    if (foundUser) {

      if (foundUser.favorites.includes(portfolioItemId)) {
        const updatedUserFavorites = foundUser.favorites.filter((e) => e !== portfolioItemId)

        foundUser.favorites = updatedUserFavorites
        await foundUser.save();

        res.status(200).json({
          message: "Removed from favorites",
        });
      } else {
        foundUser.favorites.push(portfolioItemId)
        foundUser.save()

        res.status(200).json({
          message: "Saved to favorites",
        });
      }
    } else {
      res.status(200).json({
        message: "An Error has occured.",

      });
    }

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  signIn,
  signOut,
  createUser,
  addToUserFavorites,
}