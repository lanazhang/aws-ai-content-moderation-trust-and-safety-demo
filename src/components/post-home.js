import { useState, useEffect } from "react";
import * as React from "react";
import { Box, Button, Table, TextFilter, Modal, SpaceBetween, Container, Alert, Textarea, Link,Pagination, StatusIndicator, Header, Badge} from '@cloudscape-design/components';
import { PostCreate } from "./post-create";
import './post-home.css'
import socialPosts from "../resources/social-post.json";


function PostHome ({user, onItemClick, onSelectionChange}) {


  const [posts, setPosts] = useState(socialPosts);

  const [selectedItems, setSelectedItems ] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const [showDetail, setShowDetail] = useState(false); 
  const [loadingStatus, setLoadingStatus] = useState(null); //null, LOADING, LOADED
  
  
  useEffect(() => {
    /*if (posts.length === 0 && loadingStatus === null) {
      
      setLoadingStatus("LOADING");
      FetchData('/audio/jobs', "get")
        .then((data) => {
            var resp = JSON.parse(data.body);
            setItems(resp);
            setPageItems(getCurrentPageItems(resp));
            setLoadingStatus("LOADED");
        })
        .catch((err) => {
          setLoadingStatus("LOADED");
          console.log(err.message);
        });
      
    }*/
  })

  const handleStartPostClick = e => {
    setShowCreate(true);
  }

  const handlePostCreateDismiss = e => {
    setShowCreate(false);
  }

  const handlePostSubmit = e => {
    console.log(e);
    var ps = [e.target];
    ps = ps.concat(posts);
    setPosts(ps);

    setShowCreate(false);
  }

  return (
    <div className="post_home">
      {showCreate?<PostCreate onPost={handlePostSubmit} onDismiss={handlePostCreateDismiss} />:<div/>}
      <SpaceBetween size="m">
        <br/>
        <Container>
          <img src="/images/user_lanaz.jpeg" className="profile_image"></img>
          <div className="start_post" onClick={handleStartPostClick}>Start a post</div>
        </Container>
          {posts !== null && posts.length > 0?posts.map((post, i) =>
            <Container>
              <img src={post.user_profile_image} className="profile_image"></img>
              <div className="profile_name">{post.user}</div>
              <div className="post_text">{post.text}</div>
              {post.labels !== null && post.labels.length > 0?post.labels.map((label, i) =>
                  <div className='badge'><Badge color='grey'>{label}</Badge></div>
                ):<div/>
              }
              <img id={post.id} src={post.images[0]} className="post_image"></img>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                <g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
              </svg>          
              <div className="icon_text">{post.comments.length}</div>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                <g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
              </svg>
              <div className="icon_text">{post.likes}</div>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
              </svg>
              <div className="icon_text">{post.views}</div>
            </Container>
           ):<div/>
          }
      </SpaceBetween>
    </div>
  );
}

export {PostHome};