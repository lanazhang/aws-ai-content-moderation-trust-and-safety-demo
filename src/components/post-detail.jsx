import React, { useState, useEffect } from 'react';
import { Box, Button, ColumnLayout, FormField, Input, Modal, SpaceBetween, Alert, Textarea, Badge} from '@cloudscape-design/components';

const REGION = "us-west-2";

function readFileDataAsBase64(e) {
  const file = e.target.files[0];

  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
          resolve(event.target.result);
        };

      reader.onerror = (err) => {
          reject(err);
      };

      reader.readAsBinaryString(file);
  });
}

function PostDetail ({post, onDismiss}) {

  const [postText, setPostText] = useState(post === null?null:post.text);
  const [postImages, setPostImages] = useState(post === null?null:post.images);
  const [postLabels, setPostLabels] = useState(post === null?null:post.labels);

  const [fileBytes, setFileBytes] = useState(undefined);
  const [fileType, setFileType] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = e => {
      console.log(fileBytes);

  }

  const handleFileChange = async e => {
    const FR = new FileReader();
    FR.addEventListener("load", function(evt) {
      setFileBytes(evt.target.result.split('base64,')[1]);
      setFileType(e.target.files[0].type)
    }); 
    FR.readAsDataURL(e.target.files[0]);
  }

  const handleStateChange = (editorState) => {
    editorState(editorState);
  }

    return (<Modal
      visible={true}
      onSubmit={handleSubmit}
      onDismiss={onDismiss}
      closeAriaLabel="Close dialog"
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="normal" onClick={onDismiss}>
              Cancel
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <ColumnLayout columns={1}>
        {postLabels !== null && postLabels.length > 0?postLabels.map((label, i) =>
           <Badge color='green'>{label}</Badge>
        ):<div/>}
        <label>{postText}</label>
        {postImages !== null && postImages.length > 0? postImages.map((image, i) =>
           <img src={image} width="700"></img>
        ):<div/>}
          
      </ColumnLayout>

    </Modal>
  );
}

export {PostDetail};