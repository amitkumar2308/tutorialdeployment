import express from 'express';
import formidable from 'express-formidable'
import { requireSignIn } from '../middleware/index.js';
import {createPost,uploadImage,postByUser,userPost,updatePost, deletePost,likepost,unlikepost,addComment,removeComment,postByCurrentUser} from "../controllers/post.js";

const router = express.Router();

//post-rendering


router.post("/create-post", requireSignIn,createPost);
router.post ("/upload-image",requireSignIn,formidable({maxFileSize: 5 *1024 * 1024}),uploadImage);
router.get("/user-posts",requireSignIn,postByUser);
router.get("/user-post/:_id",requireSignIn, userPost);
router.get("/postByCurrentUser",requireSignIn, postByCurrentUser);
router.put("/update-post/:_id",requireSignIn, updatePost);
router.delete("/delete-post/:_id",requireSignIn, deletePost);

//like and unlike post
router.put("/like-post", requireSignIn, likepost);
router.put("/unlike-post", requireSignIn, unlikepost);




//add comment
router.put("/add-comment", requireSignIn,addComment);
router.delete("/remove-comment", requireSignIn,removeComment);

// Route to fetch posts from users whom the current user is following


export default router;
