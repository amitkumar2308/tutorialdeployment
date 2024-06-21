import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Avatar, IconButton, TextField, Button } from "@mui/material";
import moment from "moment";
import { DeleteOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import parse from "html-react-parser";

const PostDetail = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/post/${postId}`);
      setPost(data);
    } catch (error) {
      console.log("Error fetching post:", error);
    }
  };

  const addComment = async () => {
    try {
      setCommentLoading(true);
      const { data } = await axios.put("/add-comment", {
        postId: post._id,
        comments: commentInput,
      });
      setCommentLoading(false);
      if (data.error) {
        toast.error(data.error);
      } else {
        setCommentInput("");
        fetchPost(); // Fetch the post again to update comments
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.log("Error adding comment:", error);
      setCommentLoading(false);
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      const response = await axios.delete("/remove-comment", {
        data: { postId: post._id, commentId },
      });
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter(
          (comment) => comment._id !== commentId
        ),
      }));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.log("Error removing comment:", error);
      toast.error("Error deleting comment");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={post.postedBy?.image?.url || ""}
          alt={post.postedBy?.username || ""}
        >
          {!post.postedBy?.image?.url && post.postedBy?.username.charAt(0)}
        </Avatar>
        <div style={{ marginLeft: "10px" }}>
          <span style={{ fontWeight: "bold" }}>{post.postedBy.username}</span>
          <span style={{ marginLeft: "10px", color: "#888" }}>
            {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>{parse(post.content)}</div>
      {post.image && (
        <img
          src={post.image.url}
          alt="Post"
          style={{ width: "100%", marginTop: "20px" }}
        />
      )}
      <div style={{ marginTop: "20px" }}>
        <h3>Comments</h3>
        <div>
          {post.comments.map((comment) => (
            <div key={comment._id} style={{ display: "flex", marginTop: "10px" }}>
              <Avatar
                src={comment.postedBy?.image?.url || ""}
                alt={comment.postedBy?.username || ""}
              >
                {!comment.postedBy?.image?.url &&
                  comment.postedBy?.username.charAt(0)}
              </Avatar>
              <div style={{ marginLeft: "10px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>
                    {comment.postedBy.username}
                  </span>
                  <span style={{ color: "#888" }}>
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                <div>{comment.text}</div>
              </div>
              <IconButton
                onClick={() => handleRemoveComment(comment._id)}
                style={{ marginLeft: "10px" }}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <TextField
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Add a comment"
          />
          <Button
            onClick={addComment}
            variant="contained"
            color="primary"
            style={{ marginLeft: "10px" }}
            disabled={commentLoading}
          >
            {commentLoading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
