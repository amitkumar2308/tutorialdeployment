import React, { useState, useEffect } from "react";
import CreatePostForm from "../components/forms/CreatePostForm.jsx";
import PostList from "../components/cards/PostList.jsx";
import People from "../components/cards/people.jsx";
import Link from "next/link";
import { Modal, Input, Button, Drawer , Avatar} from "antd"; // Import Drawer from antd
import { UserOutlined , DeleteOutlined} from "@ant-design/icons"; // Import UserOutlined icon
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";



const { TextArea } = Input;
import moment from "moment";

const CommentModal = ({
  visible,
  handleCancel,
  addComment,
  commentInput,
  setCommentInput,
  commentLoading,
  currentPost,
  handleRemoveComment, // Add handleRemoveComment
  state, // Add state
}) => {
  return (
    <Modal
    title={`Comments for ${currentPost.postedBy?.username}'s post`}
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
        style={{ backgroundColor: "black", borderRadius: "5px" }}
      >
        Add Comment
      </Button>,
    ]}
  >
    <div
      style={{
        maxHeight: "400px", // Set max height for the comments section
        overflowY: "auto", // Enable vertical scrolling
        marginBottom: "10px", // Add some space below the comments section
      }}
    >
      {currentPost.comments?.map((comment) => (
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
            {state?.user._id === comment.postedBy._id && (
              <IconButton
                onClick={() => handleRemoveComment(currentPost._id, comment._id)}
                type="text"
                danger
                icon={<DeleteOutlined />} // Add DeleteOutlined icon
              />
            )}
          </div>
        </div>
      ))}
    </div>
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

const Home = () => {
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
  const [drawerVisible, setDrawerVisible] = useState(false); // State to manage drawer visibility
  const router = useRouter();
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.token) {
      setState(auth);
      fetchUserPost();
      findPeople();
    } else {
      router.push("/register");
    }
  }, []);

  const fetchUserPost = async () => {
    try {
      const { data } = await axios.get("/user-posts");
      const populatedPosts = data.map((post) => ({
        ...post,
        comments: post.comments.map((comment) => ({
          ...comment,
          text: comment.text,
        })),
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

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      toast.success(`Subscribed ${user.name}`);
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
        data: { postId, commentId }, // Pass data in the request body for DELETE method
      });
      setPosts((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          if (post._id === postId) {
            post.comments = post.comments.filter(
              (comment) => comment._id !== commentId
            );
          }
          return post;
        });
        return updatedPosts;
      });
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

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <userRoute>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            position: "relative",
            flex: "2",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            overflow: "auto",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() => setShowCreatePostForm((prevState) => !prevState)}
            style={{
              backgroundColor: "black",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              marginBottom: "20px", // Add some margin below the button
              cursor: "pointer",
            }}
          >
            Create Post
          </button>

          <br />
          {/* Conditionally render CreatePostForm */}
          {showCreatePostForm && (
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
          )}

          <br />
          <PostList
            posts={posts}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
            handleRemoveComment={handleRemoveComment}
          />
        </div>

        {/* Sidebar for larger screens */}
        {typeof window !== "undefined" && window.innerWidth > 768 ? (
          <div
            style={{
              flex: "1",
              backgroundColor: "#e9ecef",
              padding: "20px",
              overflow: "auto",
            }}
          >
            <h2>Suggested For You</h2>
            <br />
            {state && state.user && state.user.following && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <Link
                    href={`/user/follower`}
                    className="text-decoration-none"
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {state.user.followers.length}
                    </span>
                    <span> Subscriber</span>
                  </Link>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Link
                    href={`/user/following`}
                    className="text-decoration-none"
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {state.user.following.length}
                    </span>
                    <span> Subscribed</span>
                  </Link>
                </div>
                <hr
                  style={{ border: "1px solid black", marginBottom: "20px" }}
                />
              </>
            )}
            <People people={people} handleFollow={handleFollow} />
          </div>
        ) : (
          <div>
            {/* Person icon with text for smaller screens */}
            <div
              onClick={showDrawer}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
                position: "fixed",
                bottom: "20px",
                right: "20px",
                cursor: "pointer",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
            >
              <UserOutlined style={{ fontSize: "24px", marginRight: "10px" }} />
              <span>Suggested For You</span>
            </div>
            <Drawer
              title="Suggested For You"
              placement="right"
              closable={true}
              onClose={closeDrawer}
              visible={drawerVisible}
            >
              {state && state.user && state.user.following && (
                <>
                  <div style={{ marginBottom: "10px" }}>
                    <Link
                      href={`/user/follower`}
                      className="text-decoration-none"
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {state.user.followers.length}
                      </span>
                      <span> Subscriber</span>
                    </Link>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <Link
                      href={`/user/following`}
                      className="text-decoration-none"
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {state.user.following.length}
                      </span>
                      <span>Subscribed</span>
                    </Link>
                  </div>
                  <hr
                    style={{ border: "1px solid black", marginBottom: "20px" }}
                  />
                </>
              )}
              <People people={people} handleFollow={handleFollow} />
            </Drawer>
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

export default Home;
