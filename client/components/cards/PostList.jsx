import React, { useState, useContext } from "react";
import {
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import parse from "html-react-parser";

const PostList = ({
  posts,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  handleRemoveComment,
  addComment,
}) => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    overflow: "hidden",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#f9f9f9",
  };

  const userInfoStyle = {
    marginLeft: "10px",
  };

  const usernameStyle = {
    fontWeight: "bold",
  };

  const timeStyle = {
    fontSize: "0.75rem",
    color: "#888",
    marginLeft: "5px",
  };

  const userAboutStyle = {
    fontSize: "0.75rem",
    color: "#aaa",
    marginTop: "5px",
  };

  const contentStyle = {
    padding: "15px",
  };

  const imageStyle = {
    width: "100%",
    maxHeight: "400px",
    objectFit: "cover",
  };

  const actionsStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 15px",
    backgroundColor: "#f9f9f9",
    borderTop: "1px solid #eee",
  };

  const actionsLeftStyle = {
    display: "flex",
    alignItems: "center",
  };

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    handleComment(post);
  };

  const handleAddComment = async () => {
    if (selectedPost) {
      await addComment(selectedPost._id, commentInput);
      setCommentInput("");
      setIsModalOpen(false);
      setSelectedPost(null);
    }
  };

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} style={cardStyle}>
            <div style={headerStyle}>
              <Avatar
                src={post.postedBy?.image?.url || ""}
                alt={post.postedBy?.username || ""}
                sx={{ width: 40, height: 40 }}
              >
                {!post.postedBy?.image?.url && post.postedBy?.username.charAt(0)}
              </Avatar>
              <div style={userInfoStyle}>
                <span style={usernameStyle}>{post.postedBy.username}</span>
                <span style={timeStyle}>{moment(post.createdAt).fromNow()}</span>
                {post.postedBy.about && (
                  <div style={userAboutStyle}>
                    {post.postedBy.about.length > 20
                      ? `${post.postedBy.about.slice(0, 20)}...`
                      : post.postedBy.about}
                  </div>
                )}
              </div>
            </div>
            <div style={contentStyle}>{parse(post.content)}</div>
            {post.image && (
              <img src={post.image.url} alt="Post" style={imageStyle} />
            )}
            <div style={actionsStyle}>
              <div style={actionsLeftStyle}>
                <IconButton
                  onClick={() =>
                    post.likes.includes(state?.user?._id)
                      ? handleUnlike(post._id)
                      : handleLike(post._id)
                  }
                >
                  {post.likes.includes(state?.user?._id) ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                </IconButton>
                <span>{post.likes.length} likes</span>
                <IconButton onClick={() => handleCommentClick(post)}>
                  <CommentIcon />
                </IconButton>
                <span>
                  <Link href={`/post/${post._id}`}>
                    {post.comments.length} comments
                  </Link>
                </span>
              </div>
              {state?.user._id === post.postedBy._id && (
                <div>
                  <IconButton onClick={() => router.push(`/user/post/${post._id}`)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post)}>
                    <DeleteOutlined />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export default PostList;
