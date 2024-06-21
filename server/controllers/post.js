import Post from "../models/posts.js";
import cloudinary from "cloudinary";
import User from "../models/user.js";

//config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const createPost = async (req, res) => {
  // console.log("Post=>", req.body);
  const { content, image } = req.body;
  if (!content.length) {
    return res.json({
      error: "content is required",
    });
  }

  try {
    const post = new Post({ content, image, postedBy: req.auth._id });
    post.save();
    res.json(post);
  } catch (error) {
    console.log("Error while creating post server => ", error);
    res.sendStatus(400);
  }
};

export const uploadImage = async (req, res) => {
  // console.log(req.files.image.path);
  try {
    const result = await cloudinary.uploader.upload(req.files.images.path);
    // console.log(result);
    res.json({
      url: result.secure_url, // https url
      public_id: result.public_id,
    });
  } catch (error) {
    console.log("ERROR WHILE UPLOAD IMAGE SERVER => ", error);
  }
};

// post-rendring
export const postByUser = async (req, res) => {
  try {
    // const posts = await Post.find({ postedBy: req.auth._id })

    //*** this it to render all post but we want only followed user post */

    /*const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);
    //   console.log(posts);
    res.json(posts); */

    const user = await User.findById(req.auth._id);
    let following = user.following;

    // follwoing array contains all the following users Id(whch we did on auth.js- userFollowing) and also we put our id so that our post is also visible
    following.push(req.auth._id);

    const posts = await Post.find({ postedBy: { $in: following } })
    .populate('postedBy',"_id username image about")
    .populate('comments.postedBy', "_id username image about")

    .sort({ createdAt: -1 })
    .limit(2000);

      res.json(posts);
  } catch (error) {
    console.log("ERROR while post-rendring SERVER => ", error);
  }
};

//post-edit
export const userPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    res.json(post);
  } catch (error) {
    console.log("Error while UserPost edit server =>", error);
  }
};

//update post
export const updatePost = async (req, res) => {
  // console.log("Post update", req.body);
  try {
    const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    res.json(post);
  } catch (error) {
    console.log("Error while update post server =>", error);
  }
};

//delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    // remove the image from cloudinary
    if (post.image && post.image.public_id) {
      const image = await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.json({ ok: true });
  } catch (error) {
    console.log("Error while Detlet post server =>", error);
  }
};

//like post
export const likepost = async (req,res) =>{
  try {

    const post = await Post.findByIdAndUpdate(req.body._id, {
      $addToSet: {likes: req.auth._id}
    },{new: true});

    res.json(post);

  } catch (error) {
    console.log("likepost => ",error);
  }
}

//unlike post
export const unlikepost = async (req,res) =>{
  try {

    const post = await Post.findByIdAndUpdate(req.body._id, {
      $pull: {likes: req.auth._id}
    },{new: true});

    res.json(post);
    
  } catch (error) {
    console.log("unlikePost",error);
  }
}

// Controller to add a comment to a post
export const addComment = async (req, res) => {
  try {
    const {postId, comments} = req.body;

    const post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: { text: comments, postedBy: req.auth._id } }
    }, { new: true })
    .populate('postedBy', "_id name username  image")
    .populate('comments.postedBy', "_id name username  image");

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};



export const removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;

    // Find the post by postId and update it
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        // Pull the comment with the given commentId from the comments array
        $pull: { comments: { _id: commentId } }
      },
      { new: true } // Return the updated document
    ).populate("comments.postedBy", "_id name image"); // Populate the comment's postedBy field with the user's details

    if (!post) {
      // If the post with the given postId is not found
      return res.status(404).json({ error: "Post not found" });
    }

    // Send the updated post document as the response
    res.json(post);
  } catch (error) {
    // If an error occurs during the process
    console.log("Remove Comment =>", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const postByCurrentUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.auth._id })
      .populate("postedBy", "_id username image")
      .populate("comments.postedBy", "_id username image")
      .sort({ createdAt: -1 })
      .limit(2000);

    res.json(posts);
  } catch (error) {
    console.log("Error while fetching user posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};


