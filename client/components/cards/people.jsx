import { Avatar, List } from "antd";
import { useContext } from "react";
import { UserContext } from "../../context";

const People = ({ people, handleFollow }) => {
  const [state, setState] = useContext(UserContext);

  const containerStyle = {
    maxHeight: "530px", // Adjust as needed
    overflowY: "auto",
    paddingRight: "10px", // For space to prevent content cutoff
  };

  const listItemStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
    padding: "10px",
  };

  const avatarStyle = {
    margin: "auto",
    border: "2px solid #1890ff", // Add border to avatar
  };

  const usernameStyle = {
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#333", // Dark color for better contrast
  };

  const aboutStyle = {
    fontSize: "0.75rem",
    color: "gray",
    padding: "0.5rem",
    display: "inline-block",
    maxWidth: "100%",
    backgroundColor: "#f1f1f1", // Light gray background
    borderRadius: "5px", // Rounded corners
  };

  const subscribeButtonStyle = {
    backgroundColor: "#000", // Black background color
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle} className="scroll-container">
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item style={listItemStyle}>
            <List.Item.Meta
              avatar={
                user.image && user.image.url ? (
                  <Avatar src={user.image.url} style={avatarStyle} />
                ) : (
                  <Avatar style={avatarStyle}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                )
              }
              title={
                <div className="d-flex justify-content-between align-items-center">
                  <span style={usernameStyle}>{user.username}</span>
                  <div style={{ textAlign: "center" }}>
                    <button
                      style={subscribeButtonStyle}
                      onClick={() => handleFollow(user)}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              }
              description={
                <div style={aboutStyle}>
                  {user.about && user.about.length > 40
                    ? user.about.slice(0, 40) + "..."
                    : user.about}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          width: 0; /* Remove scrollbar space */
          background: transparent; /* Optional: just make scrollbar invisible */
        }
        .scroll-container {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default People;
