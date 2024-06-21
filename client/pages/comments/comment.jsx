import React from "react";
import moment from "moment";
import { Avatar } from "antd";

const CommentPage = ({ comments }) => {
  if (!comments || !Array.isArray(comments)) {
    return (
      <div>
        <h1>Comments</h1>
        <p>No comments available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Comments</h1>
      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="mb-3">
            <div className="flex items-center">
              {comment.postedBy && comment.postedBy.image && (
                <Avatar size={30} src={comment.postedBy.image.url} />
              )}
              <div className="ml-3">
                <span className="font-semibold">{comment.postedBy.name}</span>
                <span className="text-xs text-gray-500 ml-1">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            </div>
            <div className="ml-8">{comment.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentPage;
