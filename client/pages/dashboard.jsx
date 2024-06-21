import React, { useState, useEffect } from "react";
import CreatePostForm from "../components/forms/CreatePostForm.jsx";
import PostList from "../components/cards/PostList.jsx";
import People from "../components/cards/people.jsx";
import Link from "next/link";
import { Modal, Input, Button } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const { TextArea } = Input;

const CommentModal = ({ visible, handleCancel, addComment, commentInput, setCommentInput, commentLoading, currentPost }) => {
  return (
    <Modal
      title="Add Comment"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={commentLoading}
          onClick={addComment}
          style={{ backgroundColor: 'black', borderRadius:"5px" }} // Apply black background color
        >
          Add Comment
        </Button>,
      ]}
    >
      <TextArea
        className="custom-textarea"
        rows={4}
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="Write your comment here..."
      />
    </Modal>
  );
};


const Dashboard = () => {
  const [state, setState] = useState({});
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.token) {
      setState(auth);
      fetchUserPost();
      findPeople();
    } else {
      router.push("/login");
    }
  }, []);

  const fetchUserPost = async () => {
    try {
      const { data } = await axios.get("/postByCurrentUser");
      console.log("Posts data:", data); // Log the fetched data
      const populatedPosts = data.map(post => ({
        ...post,
        comments: post.comments.map(comment => ({
          ...comment,
          text: comment.text
        }))
      }));
      setPosts(populatedPosts);
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (error) {
      console.log(error);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/create-post", { content, image });
      if (data.error) {
        toast.error(data.error);
      } else {
        fetchUserPost();
        toast.success("Post Created");
      }
    } catch (error) {
      console.log("Error in postSubmit =>", error);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("images", file);

    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (error) {
      console.log("Error while uploading image => ", error);
      setUploading(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you Sure?");
      if (!answer) return;
      await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post Deleted");
      fetchUserPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (_id) => {
    try {
      await axios.put("/like-post", { _id });
      fetchUserPost();
    } catch (error) {
      console.log("handleLike =>", error);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      await axios.put("/unlike-post", { _id });
      fetchUserPost();
    } catch (error) {
      console.log("handleUnlike =>", error);
    }
  };

  const handlefollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.success(`Subscribed ${user.username}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async () => {
    try {
      setCommentLoading(true);
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comments: commentInput,
      });
      setCommentLoading(false);
      if (data.error) {
        toast.error(data.error);
      } else {
        setVisible(false);
        fetchUserPost();
        setCommentInput("");
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.log(error);
      setCommentLoading(false);
    }
  };
  const handleRemoveComment = async (postId, commentId) => {
    try {
      const response = await axios.delete("/remove-comment", {
        data: { postId, commentId } // Pass data in the request body for DELETE method
      });
      // If successful, update the state to remove the deleted comment
      setPosts(prevPosts => {
        // Find the post that contains the deleted comment
        const updatedPosts = prevPosts.map(post => {
          if (post._id === postId) {
            // Remove the deleted comment from the post's comments array
            post.comments = post.comments.filter(comment => comment._id !== commentId);
          }
          return post;
        });
        return updatedPosts;
      });
      // Display a toast message
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.log("Error while removing comment:", error);
      toast.error("Error deleting comment");
    }
  };
  
  const handleCancel = () => {
    setVisible(false);
    setCommentInput("");
  };

  return (
    <userRoute>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            flex: "2",
            backgroundColor: "#f0f0f0",
            padding: "20px",
            overflow: "auto",
          }}
        >
          <CreatePostForm
            content={content}
            setContent={setContent}
            postSubmit={postSubmit}
            handleImage={handleImage}
            uploading={uploading}
            image={image}
          />
          <PostList
            posts={posts}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
            handleRemoveComment={handleRemoveComment}
          />
        </div>
       
        {/* Render the People sidebar conditionally based on screen size */}
        {window.innerWidth > 768 && (
          <div
            style={{
              flex: "1",
              backgroundColor: "#e0e0e0",
              padding: "20px",
              overflow: "auto",
            }}
          >
            <h2>Suggested For You</h2>
            <br/>
            {state && state.user && state.user.following && (
              <>
              <div style={{ marginBottom: "10px" }}>
                <Link href={`/user/follower`} className="text-decoration-none">
                  <span style={{ fontWeight: "bold" }}>{state.user.followers.length}</span>
                  <span> Subscriber</span>
                </Link>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Link href={`/user/following`} className="text-decoration-none">
                  <span style={{ fontWeight: "bold" }}>{state.user.following.length}</span>
                  <span> Subscribed</span>
                </Link>
              </div>
              <hr style={{ border: "1px solid black", marginBottom: "20px" }} />
            </>
            )}
            <People people={people} handleFollow={handlefollow} />
          </div>
        )}
        
        <CommentModal
          visible={visible}
          handleCancel={handleCancel}
          addComment={addComment}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          commentLoading={commentLoading}
          currentPost={currentPost}
        />
      </div>
    </userRoute>
  );
};

export default Dashboard;
