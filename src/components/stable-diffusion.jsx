import React from 'react';
import './stable-diffusion.css'
import { FetchData } from "../resources/data-provider";
import { Button, Input, Container, Header, Spinner, Alert } from '@cloudscape-design/components';

class StableDiffusion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: null, // null, loading, loaded
            prompt: null,
            img_bytes: null,
            prompt_warning: null,
            image_warning: null,
            blur_image: false,
        }
    }

    handlePromptChange = e => {
        this.setState({prompt: e.detail.value});
    }

    handlePromptClear = e => {
        this.setState({prompt: null, status: null });
    }

    handleDisplayImage = e => {
        this.setState({blur_image: false});
    }

    handlePromptSubmit = () => {
        if (this.state.prompt === null || this.state.prompt.length === 0) {
            alert("Please enter a prompt to proceed.");
        }
        else {
            this.setState( {status: "loading"});
            FetchData('/genai/stable-diffusion', "post", {
                "prompt": this.state.prompt,
                "width": 720,
                "height": 720
            })
            .then((data) => {
                var resp = data.body;
                //console.log(resp);
                if (resp !== null && resp.img_bytes !== undefined) {
                    this.setState(
                        {
                            img_bytes: "data:image/jpeg;base64," + resp.img_bytes,
                            prompt_warning: resp.prompt_warning,
                            image_warning: resp.image_warning,
                            status: "loaded",
                            blur_image: resp.image_warning !== null
                        }
                    );
                }
            })
            .catch((err) => {
                console.log(err.message);
                this.setState( {status: null});

            });    
        }    
    }

    render() {
        return (
            <div className='stablediffusion'>
                <Container header={
                    <Header
                    variant="h2"
                    description="This demo shows generating images using Generative AI - Stable Diffusion (V2-1 base) with moderation to both prompts and the resulting images."
                    >
                    Stable Diffusion with moderation
                    </Header>}>
                    <Input autoFocus
                        onChange={this.handlePromptChange} 
                        value={this.state.prompt} placeholder='Please type in the prompt here to generate an image. Ex. "astronaut on a horse", "a sexy lady" or "boxers hitting each others faces"' 
                        className="Prompt" />
                    {this.state.status === null || this.state.status === "loaded"?
                        <div>
                            <Button onClick={this.handlePromptSubmit} variant="primary" className='Submit'>Submit</Button>
                            <Button onClick={this.handlePromptClear} variant="normal" className='Clear' disabled={this.state.prompt === null || this.state.prompt.length === 0? true :false} >Clear</Button>
                        </div>
                    :<Spinner />}
                </Container>
                {this.state.status === "loaded"?
                <div>
                    <Alert
                        dismissAriaLabel="Close"
                        className="alert"
                        statusIconAriaLabel={this.state.prompt_warning === null?"Safe":"Unsafe"}
                        type={this.state.prompt_warning === null?"success":"error"}
                    >
                        {this.state.prompt_warning !== null?this.state.prompt_warning:"The prompt is free of any potentially harmful or inappropriate words or phrases."}
                    </Alert>
                    <Alert
                        dismissAriaLabel="Close"
                        className="alert"
                        statusIconAriaLabel={this.state.image_warning === null?"Safe":"Unsafe"}
                        type={this.state.image_warning === null?"success":"error"}
                    >
                        {this.state.image_warning !== null?this.state.image_warning:"The generated image doesn't contain unsafe content."}
                    </Alert>
                    <img className={this.state.blur_image? "image_blur": "image"} src={this.state.img_bytes} width="720"></img>
                    {this.state.blur_image? <Button onClick={this.handleDisplayImage} className="Unblur" >Display image</Button>:<div/>}
                </div>:
                <div/>}
            </div>
        );
    }
}

export default StableDiffusion;