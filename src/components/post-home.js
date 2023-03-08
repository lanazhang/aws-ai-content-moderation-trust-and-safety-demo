import { useState, useEffect } from "react";
import * as React from "react";
import { Box, SpaceBetween, Container, Popover, Badge} from '@cloudscape-design/components';
import { PostCreate } from "./post-create";
import './post-home.css'
import socialPosts from "../resources/social-post.json";
import { FetchData } from "../resources/data-provider";

function PostHome ({user, onItemClick, onSelectionChange}) {

  const [posts, setPosts] = useState(socialPosts);
  const [showCreate, setShowCreate] = useState(false);
  
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
    var ps = [e.target];
    ps = ps.concat(posts);
    setPosts(ps);

    setShowCreate(false);
  }

  const handleCommentClick = e => {
    var id = e.target.id;
    var ps = Object.assign([], posts);
    for(var i=0;i<ps.length;i++) {
      if (ps[i].id === id) {
        if(ps[i].showComment === undefined || ps[i].showComment === false)
          ps[i].showComment = true;
        else
          ps[i].showComment = false;
      }
    }
    setPosts(ps);
  }

  const handleLikeClick = e => {
    var id = e.target.id.substring(5);
    var ps = Object.assign([], posts);
    for(var i=0;i<ps.length;i++) {
      if (ps[i].id === id) {
        ps[i].likes = ps[i].likes + 1;
      }
    }
    setPosts(ps);    
    //console.log(posts);
  }

  const handleCommentPost = e => {
    var id = e.target.id.substring(4);
    var comment = document.querySelector("#cmt_"+id).value;

    // Text moderation
    if (comment !== null && comment.length > 0) {
      FetchData('/text/toxic', "post", {
        "text": [comment]
      })
      .then((data) => {
          var resp = JSON.parse(data.body);
          var toxic = false;
          if (resp[0]["Name"] === 'Toxic')
            toxic = true;

          var ps = Object.assign([], posts);
          console.log(toxic);
          for(var i=0;i<ps.length;i++) {
            if (ps[i].id === id) {
              if (toxic){
                ps[i].toxicComment = true;
              }
              else{
                ps[i].toxicComment = false;
                document.querySelector("#cmt_"+id).value = "";
                ps[i].comments.push(
                  {
                    "user":user.username,
                    "comment": comment
                  });
              }
            }
          }
          setPosts(ps);
        }
      )
      .catch((err) => {
        //setMessages([err]);
        console.log(err.message);
      });      
    }
  }

  return (
    <div className="post_home">
      <div className="post_left">
        {showCreate?<PostCreate user={user} onPost={handlePostSubmit} onDismiss={handlePostCreateDismiss} />:<div/>}
        <SpaceBetween size="m">
          <br/>
          <Container>
            <img src={`/images/${user.username}.jpeg`} alt="" className="profile_image"></img>
            <div className="start_post" onClick={handleStartPostClick}>Start a post</div>
          </Container>
            {posts !== null && posts.length > 0?posts.map((post, i) =>
              <Container>
                <img src={`/images/${post.user}.jpeg`} className="profile_image" alt=""></img>
                <div className="profile_name">{post.user}</div>
                <Box float="right">
                <Badge color={post.toxicity > 0.5? 'red': 'green' }>{post.toxicity > 0.5? 'Unsafe': 'Safe' }</Badge>
                  <Popover
                    dismissAriaLabel="Close"
                    header="Moderation detail"
                    triggerType="custom"
                    content={
                      <div>
                      {post.text_moderation_result !== undefined && post.text_moderation_result !== null?
                        <div><b>Text toxic score: </b>{post.text_moderation_result.confidence.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})}</div>
                      :<div/>}
                      <br/>
                      <b>Image moderation: </b>
                      {post.image_moderation_result !== undefined && post.image_moderation_result !== null && post.image_moderation_result.length > 0?
                        post.image_moderation_result.map((mod, i) =>
                          <div>
                            {mod.type}: {mod.info} ({mod.confidence.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})})
                          </div>
                        ): <div/>
                      }
                      </div>
                    }
                  >
                    <div className="more">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" className="icon">
                      <g fill-rule="evenodd" transform="translate(-446 -350)"><path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></g>
                    </svg>
                    </div>
                  </Popover>
                </Box>
                <div className="post_text">{post.text}</div>
                

                {post.labels !== null && post.labels.length > 0?post.labels.map((label, i) =>
                    <div className='badge'><Badge color='blue'>{label}</Badge></div>
                  ):<div/>
                }

                <img src={post.images[0]} className="post_image" alt=""></img>
                <svg id={post.id} viewBox="0 0 24 24" aria-hidden="true" className="icon" onClick={handleCommentClick}>
                  <g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g>
                </svg>          
                <div className="icon_text">{post.comments !== undefined && post.comments !== null && post.comments.length > 0?post.comments.length:0}</div>
                <svg id={'like_'+post.id} viewBox="0 0 24 24" aria-hidden="true" className="icon" onClick={handleLikeClick}>
                  <g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                </svg>
                <div className="icon_text">{post.likes}</div>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                  <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g>
                </svg>
                <div className="icon_text">{post.views}</div>
                {post.showComment?
                <div className="comment_box">
                  <img src={`/images/${user.username}.jpeg`} className="profile_image" alt=""></img>
                  <input id={"cmt_" + post.id} />
                  <button id={"btn_" + post.id} onClick={handleCommentPost}>Post</button>

                  {post.toxicComment? <div id={"err_" + post.id} className="comment_err">Toxic comment</div>: <div/>}
                    {post.comments !== undefined && post.comments !== null && post.comments.length > 0?
                      post.comments.map((comment, i) => 
                        <div class="comment_entry">
                          <img src={`/images/${comment.user}.jpeg`} alt="" className="profile_image"></img>
                          <div>
                            <b>{comment.user}</b>
                            <br/>{comment.comment}
                          </div>
                        </div>
                      ): <div/>}
                </div>: <div/>}
              </Container>
            ):<div/>
            }
        </SpaceBetween>
      </div>    
      <div className="post_right">
        <div className="header">How to use this page</div>
        <div className="item">
          <div className="title">Create a new post by typing text and uploading images. 
          <div className="txt">The page will moderate the text, image, and text in the image and also get generic labels of the images using Rekognition and Comprehend. </div>     
          </div>
        </div>
        <div className="item">
          <div className="title">Add a comment to a post.</div>
          <div className="txt">You can also add a comment to the post to try out the text moderation using Comprehend. </div>
        </div>
        <div className="item">
          <div className="title">Check the post's scorecard.</div>
          <div className="txt">Click "..." on the top-right of each post to check the toxic scorecard with moderation details. </div>
        </div>
      </div>
    </div>

  );
}

export {PostHome};