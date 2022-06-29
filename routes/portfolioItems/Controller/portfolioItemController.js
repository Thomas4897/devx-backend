const { v4: uuidv4 } = require('uuid');
const User = require("../../users/Model/User")
// const bcrypt = require('bcryptjs');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const PortfolioItem = require('../Model/PortfolioItem');


const cleanPortfolioItem = (userDocument) => {
  return {
    id: userDocument.id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
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

const createPortfolioItem = async (req, res, next) => {
  try {
    const {
      image,
      link,
      title,
      description,
    } = req.body.portfolioItem;

    const {
      authorName,
      authorImage,
    } = req.body.portfolioItem.author;

    const userId = req.body.userId

    const foundUser = await User.findOne({ id: userId });

    // let salt = await bcrypt.genSalt(10);
    // let hashedPassword = await bcrypt.hash(password, salt);

    // Creating a New User Object;
    if (foundUser) {
      let newPortfolioItem = new PortfolioItem({
        id: uuidv4(),
        userId: userId,
        image: image,
        link: link,
        title: title,
        rating: "outstanding",
        description: description,
        author: {
          authorName: foundUser.firstName + " " + foundUser.lastName,
          authorImage: authorImage,
        }
      });

      // Use .save() to save new user object to DB
      let savedPortfolioItem = await newPortfolioItem.save();
      foundUser.portfolioItems.push(newPortfolioItem.id)
      foundUser.save()
      // console.log(foundUser);

      // const token = getToken(savedUser._id)

      // res.cookie('session_token', token)
      // console.log('savedUser:', cleanUser(savedUser));
      res.status(200).json({
        message: "PortfolioItem Successfully Created.",
        payload: { portfolioItem: savedPortfolioItem },
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

const getAllPortfolioItems = async (req, res, next) => {
  //! All of the logic on how to get the product
  try {
    //! fetches data from the db
    const foundPortfolioItems = await PortfolioItem.find({});

    res.send(foundPortfolioItems);
  } catch (error) {
    console.log('error', error);
  }
};

const getUserPortfolioItems = async (req, res, next) => {

  const { userId } = req.body

  //! All of the logic on how to get the product
  try {
    //! fetches data from the db
    const foundPortfolioItems = await PortfolioItem.find({ userId: userId });

    res.send(foundPortfolioItems);
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = {
  createPortfolioItem,
  getAllPortfolioItems,
  getUserPortfolioItems
}
