import User from"../models/user.js";
import { hashPassword,comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {nanoid} from 'nanoid';
import user from "../models/user.js";
import { sendTokenEmail } from "./emailconfig.js";


dotenv.config();

export const register = async (req, res) => {
  const { username, email, password, confirmpassword } = req.body;
  // validation
  if (!username) return res.status(400).json({ error: "Username is Required" });
  if (!email) return res.status(400).json({ error: "Email is Required" });
  if (!password || password.length < 6)
    return res.status(400).json({ error: "Password should be 6 characters long" });
  if (password !== confirmpassword) return res.status(400).json({ error: "Password and Confirm Password doesn't match" });
  // check if user already exists
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ error: "Email already exists" }); // send msg if email already exists

  // hashed password
  const hashedPassword = await hashPassword(password);
  const user = new User({ username, email, password: hashedPassword, name: nanoid(6) });
  try {
      await user.save();
      console.log("Registered User =>", user);
      return res.json({ ok: true });
  } catch (error) {
      console.log("REGISTRATION FAILED =>", error);
      return res.status(400).json({ error: "Registration failed. Please try again later." });
  }
};


// for login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //*Check if our database has user with that username
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("user Does not exist");

    //check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Incorrect Credentials");

    // create a jwt token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // to create sign token

    // we are not saving user password and secret
    user.password = undefined;
    user.secret = undefined;

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log("ERROR WHILE LOGIN =>", err);
    return res.status(400).send("Error, Try again");
  }
};


export const currentUser = async(req,res)=>{
    //console.log(req.auth);
    try {
        const user = await User.findById(req.auth._id);
        res.json({ok:true}); 
    } catch (error) {
        console.log("Error while verifiying token =>",error);
        res.sendStatus(400);
    }
}

//forgot password

export const forgotPassword = async(req,res) =>{
    const {email, newpassword,confirmpassword} = req.body;

    //validation
    if(!newpassword || newpassword.length < 6){
        return res.json({
            error:"New Password field is Required (Password must be 6 characters)"
        })
    }
    if(!confirmpassword){
        return res.json({
            error:"Secret is required"
        })
    }
    const user = await User.findOne({email});
    if(!user){
        return res.json({
            error: "We are unable to verify you, Please Enter Valid Credentials"
        })
    }

    try {
        const hashed = await hashPassword(newpassword);
        await User.findByIdAndUpdate(user._id,{password:hashed});
        return res.json({
            success: "Congrats ,Now you can login with your new password"
        })
    } catch (error) {
        console.log("Error While forgotting password =>",error);
        return res.json({
            error: "Something Went wrong, Try again"
        })
    }
}

//reset password

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({
              error: "Email not found. Please enter a valid email address."
          });
      }

      // Generate a unique token
      const token = nanoid();

      // Store token and expiration time in user document
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      // Send email with token to the user
      await sendTokenEmail(email, token);

      return res.status(200).json({
          success: "Password reset link sent to your email address."
      });
  } catch (error) {
      console.error('Error while sending password reset link:', error);
      return res.status(500).json({
          error: "Something went wrong. Please try again later."
      });
  }
};






//profileupdate
export const profileUpdate = async (req, res) => {
    try {
      // console.log(req.body);
      const data = {};
      if (req.body.username) {
        data.username = req.body.username;
      }
      if (req.body.name) {
        data.name = req.body.name;
      }
      if (req.body.about) {
        data.about = req.body.about;
      }
      if (req.body.password) {
        if (req.body.password < 6) {
          return res.json({
            error: "Password is required and should be min 6 charector long",
          });
        } else {
          data.password = req.body.password;
        }
      }
      if (req.body.image) {
        data.image = req.body.image;
      }
  
      let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
      user.password = undefined;
      user.secret = undefined;
  
      res.json(user);
    } catch (error) {
      if (error.code == 1100) {
        return res.json({ error: "Duplicate Username" });
      }
      console.log("Error while profile updating server =>", error);
    }
  };

  //to find user

  export const findPeople = async(req,res) =>{
    try {
      const user = await User.findById(req.auth._id);
      let following = user.following;
      following.push(user._id);
      //get information of all user except user in following
      const people = await User.find({_id: {$nin:following}}).limit(10);
      res.json(people);
    } catch (error) {
      console.log(error )
    }
  }
  

  //middleware
  // middeware => when click on follow my id add on that user followers array
export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log("Error whiel addFollower middleware controler =>", error);
  }
};

//Follow people -> that user _id add in my following array
export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (error) {
    console.log("Error userFollow controller => ", error);
  }
};

//Following page show the all follwoing user
export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following });
    res.json(following);
  } catch (error) {
    console.log("error from controller userFollowing", error);
  }
};

//Following page show the all follwoing user
export const userFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const followers = await User.find({ _id: user.followers });
    res.json(followers);
  } catch (error) {
    console.log("error from controller userFollowing", error);
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return user profile information
    res.json({
      name: user.name,
      username: user.username,
      about: user.about,
      image: user.image,
      // Add any other fields you want to include in the profile
    });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



//middleware
export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log("removeFollower =>", error);
  }
};


export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log("userUnfollow =>", error);
  }
};
