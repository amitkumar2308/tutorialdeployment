import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { Avatar, Button } from "antd";
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import 'draft-js/dist/Draft.css';

const CreatePostForm = ({ content, setContent, postSubmit, handleImage, uploading, image }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (state) => {
    setEditorState(state);
    setContent(state.getCurrentContent().getPlainText());
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div className="card shadow">
      <div className="card-body pb-3">
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="Write something..."
          className="form-control border-0"
        />
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center text-muted">
        <Button onClick={postSubmit} type="primary" className="btn-sm" style={{ backgroundColor: 'black', borderColor: 'black', borderRadius:"5px"}}>
          Post
        </Button>
        <label className="m-0">
          {image && image.url ? (
            <Avatar size={30} src={image.url} />
          ) : uploading ? (
            <LoadingOutlined />
          ) : (
            <CameraOutlined />
          )}
          <input onChange={handleImage} type="file" accept="image/*" hidden />
        </label>
      </div>
    </div>
  );
};

export default CreatePostForm;
