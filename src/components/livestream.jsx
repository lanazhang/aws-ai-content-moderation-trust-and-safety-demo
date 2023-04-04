import React from 'react';
import './livestream.css'
import { FetchData } from "../resources/data-provider";
import { Button } from '@cloudscape-design/components';
import ReactPlayer from "react-player";
import Webcam from "react-webcam";
import ChatBox from "./chatbox"

class LiveStream extends React.Component {

    constructor(props) {
        super(props);
        this.moderationLables = [
            {"Timestamp": 3723, "ModerationLabel": {"Confidence": 75.54669189453125, "Name": "Weapon Violence", "ParentName": "Violence"}}, 
            {"Timestamp":25166,"ModerationLabel":{"Confidence":65.73701477050781,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":32666,"ModerationLabel":{"Confidence":66.83570861816406,"Name":"Weapons","ParentName":"Violence"}},
            {"Timestamp":69300,"ModerationLabel":{"Confidence":81.24959564208984,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":69800,"ModerationLabel":{"Confidence":86.37857818603516,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":71300,"ModerationLabel":{"Confidence":68.32706451416016,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":72800,"ModerationLabel":{"Confidence":68.51152038574219,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":73800,"ModerationLabel":{"Confidence":67.03329467773438,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":74300,"ModerationLabel":{"Confidence":62.626708984375,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":74800,"ModerationLabel":{"Confidence":75.44883728027344,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":108600,"ModerationLabel":{"Confidence":79.0909423828125,"Name":"Weapon Violence","ParentName":"Violence"}},
            {"Timestamp":109100,"ModerationLabel":{"Confidence":77.34272003173828,"Name":"Weapon Violence","ParentName":"Violence"}}];
        this.videoRef = React.createRef();
        this.webCamRef = React.createRef();
        this.state = {
            videoModerationLabels: [],
            webCamModerationLabels: [],
            videoPause: false
        }
    }

    handleVideoPause = () => {
        this.setState({videoPause: !this.state.videoPause});
    }

    componentDidMount() {
        // Sample camera
        setInterval(() => {
            if (this.webCamRef === undefined || this.webCamRef.current === null) return;
            var imageSrc = this.webCamRef.current.getScreenshot();
            //console.log(imageSrc);
            if (imageSrc !== null) {
                FetchData('/image/image-all', "post", {
                    "Image": {
                    "BytesBase64": imageSrc.split('base64,')[1]
                    },
                    "Moderation": true,
                    "Label": false,
                    "Text": true
                })
                .then((data) => {
                    var resp = JSON.parse(data.body);
                    //console.log(resp);
                    if (resp !== null && resp.moderation !== undefined && resp.moderation.length > 0) {
                        this.setState(
                            {webCamModerationLabels: [`${resp.moderation[0].info} (${resp.moderation[0].confidence.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})})`]}
                        );
                    }
                    else {
                        this.setState({webCamModerationLabels: []})
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
            }
        }, 5000);
        
        // Background video - display moderation labels
        setInterval(() => {
            if (this.videoRef !== undefined && this.videoRef.current !== null) {
                let min = this.videoRef.current.getCurrentTime() * 1000 - 500;
                let max = this.videoRef.current.getCurrentTime() * 1000 + 500;
                var labels = this.moderationLables.find(l=> l.Timestamp >= min && l.Timestamp < max);
                if (labels !== undefined && labels !== null && labels.ModerationLabel.ParentName.length > 0) {
                    //let vms = Object.assign([], this.state.videoModerationLabels);
                    let vms = [];
                    let msg = `${labels.Timestamp/1000} s: ${labels.ModerationLabel.ParentName}/${labels.ModerationLabel.Name} (${(labels.ModerationLabel.Confidence/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})})`;
                    if (vms.indexOf(msg) == -1)
                        vms.push(msg);                     
                    this.setState(
                        {
                            videoModerationLabels: vms
                        }
                    );
                }            
            }
        }, 500);
    }

    render() {
        return (
            <div className="livestream">
                <div className='left'>
                    {this.state.videoModerationLabels !== null && this.state.videoModerationLabels.length > 0 ? 
                        <div className="videoModeration">
                            {this.state.videoModerationLabels.map((l, i) =>
                                <p>{l}</p>
                            )}
                        </div>
                    :<div/>}
                    <ReactPlayer id="myVideo" 
                        className="bgVideo" 
                        ref={this.videoRef} 
                        loop={true}
                        playing={!this.state.videoPause}
                        width="100%"
                        height="90%"
                        url='https://d2m6vcpsgt3gn5.cloudfront.net/ugc-demo-web/images/media-demo.mp4' />
                    {this.state.webCamModerationLabels !== null && this.state.webCamModerationLabels.length > 0 ? 
                        <div className="webCamModeration">{this.state.webCamModerationLabels[0]}</div>:<div/>
                    }
                    <Webcam 
                        ref={this.webCamRef}
                        mirrored={true} 
                        className="WebCam" 
                        width={300} height={200} 
                        screenshotFormat="image/jpeg"
                    >
                    </Webcam>
                    <div className="videoDesc">
                        <img src={`/images/demo.jpeg`} className="profile_image" alt=""></img>
                        <button className="react">
                            <svg height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297.703 297.703" className="svg">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> 
                                <g> <path d="M40.16,77.084c0-20.462,16.646-37.108,37.108-37.108c3.313,0,6-2.687,6-6c0-3.313-2.687-6-6-6 c-27.078,0-49.108,22.03-49.108,49.108c0,3.313,2.687,6,6,6C37.473,83.084,40.16,80.397,40.16,77.084z"></path> <path d="M77.268,12c3.313,0,6-2.686,6-6c0-3.313-2.687-6-6-6C34.764,0,0.184,34.58,0.184,77.084c0,3.313,2.687,6,6,6s6-2.687,6-6 C12.184,41.196,41.38,12,77.268,12z"></path> <path d="M220.435,27.976c-3.314,0-6,2.687-6,6c0,3.313,2.686,6,6,6c20.462,0,37.108,16.646,37.108,37.108c0,3.313,2.686,6,6,6 s6-2.687,6-6C269.543,50.006,247.513,27.976,220.435,27.976z"></path> <path d="M220.435,0c-3.314,0-6,2.687-6,6c0,3.314,2.686,6,6,6c35.888,0,65.084,29.196,65.084,65.084c0,3.313,2.686,6,6,6 c3.313,0,6-2.687,6-6C297.519,34.58,262.939,0,220.435,0z"></path> <path d="M227.513,80.603c-0.985,0-1.801,0.058-2.784,0.172c-4.218,0.491-8.21,2.021-11.21,4.319v-5.199 c0-13.116-9.63-24.128-22.409-25.614c-0.983-0.115-1.979-0.173-2.966-0.173c-5.229-0.001-10.219,1.579-14.435,4.514 c-0.923-12.218-10.215-22.164-22.337-23.574c-0.983-0.114-1.971-0.137-2.957-0.137h-0.005h-0.004 c-6.765,0-13.136,2.607-17.938,7.409c-4.424,4.424-7.017,10.162-7.396,16.332c-3.311-2.319-7.203-3.869-11.442-4.362 c-0.983-0.115-1.982-0.177-2.968-0.177c-6.765-0.001-13.516,2.641-18.318,7.442c-4.801,4.802-7.827,11.169-7.827,17.934v86.04 l-5.524-5.577c-4.742-4.67-10.834-7.239-17.522-7.239c-6.754,0-12.998,2.621-17.757,7.379c-9.619,9.619-9.791,25.133-0.611,35.021 l53.878,71.029l1.16,15.265c0.687,9.139,8.409,16.297,17.573,16.297l98.471-0.078c8.805-0.011,16.306-6.598,17.452-15.323 l2.388-18.182c7.557-12.231,12.779-28.446,16.272-48.228c3.051-17.273,4.221-37.775,4.221-60.934v-48.976 C252.518,91.988,241.509,80.603,227.513,80.603z M217.74,280.739c-0.366,2.793-2.745,4.986-5.562,4.989l-98.451,0.182 c-0.003,0-0.005,0-0.008,0c-2.938,0-5.38-2.369-5.601-5.3l-1.411-18.831c-0.001-0.01-0.004-0.045-0.011-0.053l-56.401-74.402 c-5.152-5.152-5.152-13.59,0-18.741c2.576-2.576,5.972-3.868,9.367-3.868c3.396,0,6.792,1.287,9.368,3.863l15.874,14.988 c1.237,1.168,2.344,1.691,3.802,1.691c3.167,0,5.811-2.47,5.811-6.165V79.488c0-7.359,6.402-13.382,13.762-13.381 c0.521,0,0.977,0.03,1.51,0.092c6.811,0.793,11.728,6.838,11.728,13.695v68.615c0,3.562,2.897,6.449,6.46,6.449 c3.606,0,6.54-2.924,6.54-6.53V60.22c0-7.36,6.274-13.382,13.633-13.382c0.52,0,1.042,0.03,1.574,0.093 c6.811,0.792,11.793,6.838,11.793,13.694v87.796c0,3.61,2.938,6.538,6.548,6.538c3.558,0,6.452-2.885,6.452-6.442V79.488 c0-7.359,6.145-13.382,13.505-13.381c0.52,0,1.105,0.03,1.637,0.092c6.811,0.793,11.857,6.838,11.857,13.695v68.376 c0,3.694,3.005,6.64,6.698,6.64h0.111c3.413,0,6.19-2.719,6.19-6.132v-42.39c0-6.856,4.985-12.901,11.795-13.694 c0.532-0.062,0.681-0.092,1.202-0.092c7.359,0,13.003,6.021,13.003,13.381v48.976c0,41.828-4.698,80.477-19.716,103.867 c-0.456,0.711-0.57,1.506-0.68,2.344L217.74,280.739z"></path> </g> </g>
                            </svg>
                            React
                        </button>
                        <button className="follow">
                        <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 24 24" className="svg" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"><path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z"></path></g>
                        </svg>
                            Follow
                        </button>
                        <button className="subscribe">
                        <svg width="20px" height="20px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"><path d="M9 3.966l1.167 2.49.453.964 1.054.162 2.75.423-2.056 2.112-.7.722.162.994.47 2.88-2.333-1.288L9 12.89l-.97.536-2.33 1.287.47-2.877.163-1-.7-.723-2.057-2.107 2.747-.423 1.054-.163.453-.965L9 3.965M9 0a.552.552 0 0 0-.48.277l-2.5 5.33-5.572.857a.517.517 0 0 0-.418.36.5.5 0 0 0 .12.528l4.05 4.16-.96 5.87a.53.53 0 0 0 .776.548L9 15.176l4.98 2.754a.472.472 0 0 0 .246.07h.01a.5.5 0 0 0 .3-.1.517.517 0 0 0 .22-.52l-.957-5.867 4.048-4.16a.5.5 0 0 0 .12-.53.517.517 0 0 0-.42-.36l-5.572-.857-2.5-5.33A.552.552 0 0 0 9 0z"></path> </g>
                        </svg>
                            Subscribe
                        </button>
                        <div className="profile_name">demo</div>
                        <div className="subtitle">A fun stream to watch</div>
                        <div className="labels">
                            <div>Game</div>
                            <div>Pro</div>
                            <div>Fun</div>
                            <div>Stream</div>
                            <div>English</div>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div onClick={this.handleVideoPause} className={this.state.videoPause?"play":"pause"} >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{!this.state.videoPause?"Pasuse Video":"Play Video"}
                    </div>
                    <ChatBox id="chatbox"/>
                </div>

            </div>
        );
    }
}

export default LiveStream;