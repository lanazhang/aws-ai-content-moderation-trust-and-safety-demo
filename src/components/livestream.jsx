import React from 'react';
import './livestream.css'
import { FetchData } from "../resources/data-provider";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";

class LiveStream extends React.Component {

    constructor(props) {
        super(props);
        this.moderationLables = [
            {"Timestamp": 17000, "ModerationLabel": {"Confidence": 75.54669189453125, "Name": "Weapon Violence", "ParentName": "Violence"}}, 
            {"Timestamp": 18483, "ModerationLabel": {"Confidence": 68.30712890625, "Name": "Weapon Violence", "ParentName": "Violence"}}, 
            {"Timestamp": 50716, "ModerationLabel": {"Confidence": 67.32745361328125, "Name": "Weapon Violence", "ParentName": "Violence"}}, 
            {"Timestamp": 51566, "ModerationLabel": {"Confidence": 84.10609436035156, "Name": "Weapon Violence", "ParentName": "Violence"}}, 
            {"Timestamp": 51716, "ModerationLabel": {"Confidence": 83.47505187988281, "Name": "Weapon Violence", "ParentName": "Violence"}}];
        this.videoRef = React.createRef();
        this.webCamRef = React.createRef();
        this.state = {
            videoModerationLabels: [],
            webCamModerationLabels: []
        }
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
                console.log(labels);
                if (labels !== undefined && labels !== null && labels.ModerationLabel.ParentName.length > 0) {
                    let vms = Object.assign([], this.state.videoModerationLabels);
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
                    playing={true}
                    width="100%"
                    height="100%"
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

            </div>
        );
    }
}

export default LiveStream;