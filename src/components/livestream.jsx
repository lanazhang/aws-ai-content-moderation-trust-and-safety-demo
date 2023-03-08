import React from 'react';
import './livestream.css'
import { FetchData } from "../resources/data-provider";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";

class LiveStream extends React.Component {

    constructor(props) {
        super(props);
        this.moderationLables = [
            {"Timestamp": 1500, "ModerationLabel": {"Confidence": 70.20341491699219, "Name": "Violence", "ParentName": ""}}, 
            {"Timestamp": 18500, "ModerationLabel": {"Confidence": 70.20341491699219, "Name": "Violence", "ParentName": ""}}, 
            {"Timestamp": 18500, "ModerationLabel": {"Confidence": 70.20341491699219, "Name": "Weapon Violence", "ParentName": "Violence"}}, 
            {"Timestamp": 51600, "ModerationLabel": {"Confidence": 69.24276733398438, "Name": "Violence", "ParentName": ""}}, 
            {"Timestamp": 51600, "ModerationLabel": {"Confidence": 69.24276733398438, "Name": "Weapon Violence", "ParentName": "Violence"}}
        ];
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
            console.log(imageSrc);
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
                    console.log(resp);
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
                if (labels !== undefined && labels !== null) {
                    this.setState(
                        {
                            videoModerationLabels: [labels.ModerationLabel.Name + ' (' + (labels.ModerationLabel.Confidence/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1}) + ')']
                        }
                    )
                }            
            }
        }, 500);
    }

    render() {
        return (
            <div className="livestream">
                {this.state.videoModerationLabels !== null ? <div className="videoModeration">{this.state.videoModerationLabels}</div>:<div/>}
                <ReactPlayer id="myVideo" 
                    className="bgVideo" 
                    ref={this.videoRef} 
                    playing={true}
                    width="100%"
                    height="100%"
                    url='https://d2m6vcpsgt3gn5.cloudfront.net/images/media-demo.mov' />
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