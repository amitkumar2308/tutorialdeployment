import express from "express";
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  userFollowers,
  removeFollower,
  userUnfollow,
  resetPassword
} from "../controllers/auth.js";
import { requireSignIn } from "../middleware/index.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignIn, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/resetpassword", resetPassword);

router.put("/profile-update", requireSignIn, profileUpdate);
router.get("/find-people", requireSignIn, findPeople);
// to follow
router.put("/user-follow", requireSignIn, addFollower, userFollow); //(addFollower is middleware but still it is in the controller)
//following page
router.get("/user-following", requireSignIn, userFollowing);
router.get("/user-followers", requireSignIn, userFollowers);
//unfollow
router.put("/user-unfollow",requireSignIn,removeFollower, userUnfollow);


export default router;
