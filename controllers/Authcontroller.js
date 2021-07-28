const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
var createError = require("http-errors");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statuscode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  // console.log(user);

  const {name,email}=user;

  res.status(statuscode).json({
    status: "success",
    data:{
        name,
        email,
        token
    }
  });
  return;
};

exports.checkuser = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
//   console.log("inside check user", user);
  if (user) {
    res.status(200).json({
      exist:true,
      error: "user with email already exists",
    });
    return;
  }
  
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    // console.log("res.cookie signup",req.cookies.jwt)
    if (!email || !name || !password || !passwordConfirm) {
      res.status(400).json({
        data: "please provide  all the required data",
      });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    if (newUser) {
      createSendToken(newUser, 201, req, res);
      return;
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      data: "please provide  all the required data",
      message: err,
    });
    return;
    // next(new createError[500](["Internal server error"]))
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log("res.cookie login",req.cookies.jwt)
    if (!email || !password) {
      res.status(400).json({
        message: "please give email or password",
      });
      return;
      // return next(new createError[401](["please give email or password"]));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(400).json({
        message: "user doesn't exist or incorrect password is incorrect",
      });
      return;
      // return next(new createError[404](["no user found"]))
    } else {
      createSendToken(user, 200, req, res);
    }
  } catch (err) {
    console.log(err);
    // res.status(500).json({
    //     message:"Internal server error try again later"
    // })
    // return next(new createError[404](["no user found"]))
  }
};

exports.protect = async (req, res, next) => {
  let token;
  // console.log("res.cookie protect",req.cookies)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("token form the header ",token)
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    // console.log("token form the cookie ", token);
  }

  if (!token) {
    res.status(401).json({
      message: "Youre not authorized please sign in or log in",
    });
    return;
    // return next(new createError[401](["No token found"]))
  }
  let decoded=null;
  try{
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log("decoded token ",decoded);
  }catch(err){
    console.log(err)
    res.status(401).json({
      message:"action not authorized try again later"
    })
    return;
  }
  

  const currentUser = await User.findById(decoded.id);
  // console.log("current user ",currentUser);

  if (!currentUser) {
    res.status(400).json({
      message: "No such user exists please sign up",
    });
    return;
    // return next(new createError[401](["No user found"]));
  }

  req.user = currentUser;

  next();
};

exports.oneuser = async (req, res) => {
  const { email } = req.body;
  // console.log(req.user)
  const user = await User.findOne({ email });

  res.status(200).json({
    user,
  });
};

exports.logout=(req,res)=>{
  res.cookie('jwt','loggedout',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
});
  res.status(200).json({status:'success'});
}
