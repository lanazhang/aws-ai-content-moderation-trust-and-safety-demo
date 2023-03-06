import React, {useState} from 'react';
import './signup.css'
import { FetchData } from "../resources/data-provider";

function Signup() {

    const [init, setInit] = useState(true);
    const [userName, setUserName] = useState(null);
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);
    const [profile,setProfile] = useState(null);
    const [userNameMessage,setUserNameMessage] = useState(null);
    const [profileMessage,setProfileMessage] = useState(null);
    const [profileToxic,setProfileToxic] = useState(false);
    const [imageBstr,setImageBstr] = useState(null);
    const [imageMessage,setImageMessage] = useState(null);

    const handleImageChange= (e) => {
      setImageMessage(null);
      const FR = new FileReader();
      FR.addEventListener("load", function(evt) {
        document.querySelector("#img").src = evt.target.result;
        setImageBstr(evt.target.result.split('base64,')[1]);
      }); 
      FR.readAsDataURL(e.target.files[0]);
    }
    
    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "userName"){
            setUserName(value);
        }
        if(id === "password"){
            setPassword(value);
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
        }
        if(id === "profile"){
            setProfile(value);
        }
    }
    
    const handleReset = (e) => {
        setInit(true);
        setImageMessage(null);
        setImageBstr(null);
        setUserName(null);
        setProfile(null);
        document.querySelector("#img").src = "";
    }
    
    const handleRegister = async () => {
        setInit(false);
        
        // Username profanity
        if(userName != null) {
            FetchData('/text/profanity', "post", {
                text: [userName]
            })
            .then((data) => {
                var resp = JSON.parse(data.body);
                if (resp[0] != null && resp[0].length > 0) {
                    var msg = null;
                    resp[0].forEach((x, i) => (msg === null)?msg = x["profanity_text"] : msg += ', ' + x["profanity_text"]);
                    setUserNameMessage(msg);
                }
                else {
                    setUserNameMessage(null);
                }
            })
            .catch((err) => {
               console.log(err.message);
               setUserNameMessage(null);
            });
        }
        else {
            setUserNameMessage(null);
        }
        
        if(profile != null) {
            // Profile Toxic
            FetchData('/text/toxic', "post", {
              text: [profile]
            })
            .then((data) => {
                var resp = JSON.parse(data.body);
                setProfileToxic(resp != null && resp.length > 0 && resp[0]["Name"] === 'Toxic');
            })
            .catch((err) => {
               console.log(err.message);
               setProfileToxic(false)
            });
            
            // Profile profanity
            FetchData('/text/profanity', "post", {
              text: [profile]
            })
            .then((data) => {
                var resp = JSON.parse(data.body);
                if (resp[0] != null && resp[0].length > 0) {
                    var msg = null;
                    resp[0].forEach((x, i) => (msg === null)?msg = x["profanity_text"] : msg += ', ' + x["profanity_text"]);
                    setProfileMessage(msg);
                }
                else {
                    setProfileMessage(null);
                }
            })
            .catch((err) => {
               console.log(err.message);
               setProfileMessage([])
            });
           
        }
        else {
            setProfileMessage(null);
        }
        
        // Call Image moderation API
        if (imageBstr != null) {
            FetchData('/image/image', "post", {
              "Image": {
                  "BytesBase64": imageBstr
              }
            })
            .then((data) => {
                var resp = JSON.parse(data.body);
                if (resp != null && resp.parent_name != null && resp.name != null) {
                    setImageMessage(resp["parent_name"] + '/' + resp["name"]);
                }
                else {
                    setImageMessage(null);
                }
            })
            .catch((err) => {
               console.log(err.message);
               setImageMessage(null);
            });
        }
        else {
            setImageMessage(null);
        }
    }

    
    return(
      <div class="signup">
      <div className="form">
          <div className="header">
              sign up and start having fun!
          </div>
          <div className="form-body">
          <div className="form-row">
              <label className="form__label">Username </label>
              <input className="form__input" type="text" id="userName" onChange={handleInputChange} placeholder="Username" data-tip data-for="userNameTip"/>
              {(!init && (userName === null || userName.length === 0))? <div className="inline_message">User name is required</div> :<div/>}
              {(!init && userNameMessage != null)? <div className="inline_message_severe">User name contains profanity word(s): {userNameMessage}</div> :<div/>}
          </div>
          <div className="form-row">
              <label className="form__label">Somthing about yourself </label>
              <textarea rows="4" className="form__input" type="text" id="profile" onChange={handleInputChange} placeholder="Something about yourself" data-tip data-for="profileTip"></textarea>
              {(!init && (profile === null || profile.length === 0))? <div className="inline_message">Profile is required</div> :<div/>}
              {(!init && profileMessage != null)? <div className="inline_message_severe">Profile contains profanity word(s): {profileMessage}</div> :<div/>}
              {(!init && profileToxic)? <div className="inline_message_severe">Toxicity profile.</div> :<div/>}
          </div>
          <div className="form-row">
          <br/>
            <label className="form__label">Upload a profile picture </label>
            <input type="file" id="picture" accept="image/jpeg,png" onChange={handleImageChange} />
            {(imageMessage != null) ? <div className="inline_message_severe" id="b64">Image contains inappropriate information: {imageMessage}</div> : <p/>}
            <img id="img" alt="profile" className={imageBstr===null?"signup_image_hide":"signup_image"} />
          </div>

          </div>
          <div className="footer">
              <button type="submit" className="btn" onClick={handleRegister}>Sign Up</button>
              <button type="button" className="btn" onClick={handleReset}>Reset</button>
          </div>
      </div>
      <div className="post_right">
        <div className="header">How to use this page</div>
        <div className="item">
          <div className="title">Provide a username and a description.
          <div className="txt">The page will moderate the text Comprehend. </div>     
          </div>
        </div>
        <div className="item">
          <div className="title">Upload a profile image.</div>
          <div className="txt">The page will moderate the profile image using Rekognition. </div>
        </div>
      </div>
      </div>

    )       
}
export default Signup;
