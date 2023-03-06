import React, { useState } from 'react';
import { Box, Button, Modal, SpaceBetween, Alert, Spinner, Badge} from '@cloudscape-design/components';
import './post-create.css'
import { FetchData } from "../resources/data-provider";
import { v4 as uuidv4 } from 'uuid';

function PostCreate ({user, onPost, onDismiss}) {

  const [postText, setPostText] = useState(null);
  const [postLabels, setPostLabels] = useState(null);

  const [fileBytes, setFileBytes] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState(null);

  const [moderatedFlag, setModeratedFlag] = useState(null); //null, loading, loaded

  const hiddenImageInput = React.useRef(null);

  function calculateToxicityScore() {
    let txtScore = null;
    let imgMaxScore = null;
    if (postText !== null && postText.confidence !== undefined && postText.confidence > 0.5) 
      txtScore = postText.confidence;
    if (messages !== null && messages.length > 0) {
      for(var i=0;i<messages.length;i++) {
        if (imgMaxScore === null || messages[i].confidence > imgMaxScore)
          imgMaxScore = messages[i].confidence;
      }
    }
    if (txtScore !== null && imgMaxScore !== null)
      return (txtScore + imgMaxScore)/2;
    else if(txtScore === null && imgMaxScore === null)
      return 0;
    else if(txtScore === null)
      return imgMaxScore;
    else if(imgMaxScore === null)
      return txtScore;
    }
  const handleSubmit = e => {
    e.target = {
      "id": uuidv4(),
      "text": postText,
      "images": [fileBytes],
      "toxicity":calculateToxicityScore(),
      "labels": postLabels,
      "user": user.username,
      "created_ts": new Date().toJSON(),
      "views": 0,
      "likes": 0,
      "comments": [],
      "image_moderation_result": messages,
      "text_moderation_result": textMessage
    }
    onPost(e);
  }

  const handleModeration = e => {
    setModeratedFlag("loading");
    setMessages([]);
    setTextMessage(null);

    if (fileBytes !== null && fileBytes!== undefined && fileBytes.length > 0)
      // image moderation
      FetchData('/image/image-all', "post", {
          "Image": {
            "BytesBase64": fileBytes.split('base64,')[1]
          },
          "Moderation": true,
          "Label": true,
          "Text": true
      })
      .then((data) => {
          var resp = JSON.parse(data.body);
          setMessages(resp.moderation);
          setPostLabels(resp.label);

          setModeratedFlag("loaded");
      })
      .catch((err) => {
        setMessages([err]);
        console.log(err.message);
    });

    // Text moderation
    if (postText !== null && postText !== undefined && postText.length > 0)
      FetchData('/text/toxic', "post", {
        "text": [postText]
      })
      .then((data) => {
          var resp = JSON.parse(data.body);
          if (resp[0]["Name"] === 'Toxic')
            setTextMessage({
              "type": "text",
              "info": "",
              "confidence": resp[0]["Score"]
            });

      })
      .catch((err) => {
        setMessages([err]);
        console.log(err.message);
      });      
  
  }

  const handleImageClick = e => {
    hiddenImageInput.current.click();
  }

  const handleTextChange = e => {
    setPostText(document.querySelector("#txt").value);
  }

  const handleImageUpload= (e) => {
    const FR = new FileReader();
    FR.addEventListener("load", function(evt) {
      console.log(evt.target.result);
      document.querySelector("#img").src = evt.target.result;
      setFileBytes(evt.target.result);
    }); 
    FR.readAsDataURL(e.target.files[0]);
  }

    return (<Modal
      visible={true}
      onSubmit={handleSubmit}
      onDismiss={onDismiss}
      header="Create story"
      closeAriaLabel="Close dialog"
      size="medium"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={handleModeration}>
              Moderate Post
            </Button>
            <Button variant="primary" disabled={!moderatedFlag} onClick={handleSubmit}>
              Post
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Box>
        {moderatedFlag === "loading"? <Spinner />:<div/>}
        {textMessage !== null?
          <div className="error">Toxic text message</div>:
          moderatedFlag==="loaded"? <Alert statusIconAriaLabel="Success" type="success">No inappropriate information detect in the text message.</Alert>: <div/>
        }
        {messages !== null && messages.length > 0?messages.map((msg, i) =>
            <div className="error">
              {msg.type === "image"? `Image contains inappropriate information: ${msg.info}`:
              msg.type === "text_in_image"? `Toxic text detected in the image: "${msg.info}"`: 
              ""
              }
            </div>
          ):
          moderatedFlag==="loaded"? <Alert statusIconAriaLabel="Success" type="success">No inappropriate information detect in the image.</Alert>: <div/>
        }
        <img src={`/images/${user.username}.jpeg`} alt="profile" className="profile_image"></img>
          <textarea
            id="txt"
            value={postText}
            onChange={handleTextChange}
            placeholder="What's happening?"
            className='textarea'
          />

         {postLabels !== null && postLabels.length > 0?postLabels.map((label, i) =>
            <div className='badge'><Badge color='blue'>{label}</Badge></div>
          ):<div/>
        }
        <img id="img" className="post_image" alt="profile"></img>
        <svg viewBox="0 0 20 20" className="uploadicon" onClick={handleImageClick}>
          <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
        </svg>
        <svg viewBox="0 0 20 20" className="uploadicon">
          <path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm-9 12V8l6 4z"></path>
        </svg>
          <br/> 
          <form onSubmit={handleSubmit}>
            <input type="file" 
              id="imageFile"
              ref={hiddenImageInput}
              className="input_image"
              onChange={handleImageUpload}
              accept=".jpg,.png"/>
          <br/>
        </form>
      </Box>

    </Modal>
  );
}

export {PostCreate};