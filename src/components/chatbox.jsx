import React, { useState, useEffect } from "react";
import { FetchData } from "../resources/data-provider";
import Simulator from "./simulator"

function ChatBox() {

    const [toxic, setToxic] = useState({"isvalid":true, "redacted": null});
    const [microphone, setMicrophone] = useState(false);
    const [sts, setSts] = useState(null);
    const [sock, setSock] = useState(null);

    const audioUtils        = require('../lib/audioUtils');  // for encoding audio data as PCM
    const crypto            = require('crypto'); // tot sign our pre-signed URL
    const v4                = require('../lib/aws-signature-v4'); // to generate our pre-signed URL
    const marshaller        = require("@aws-sdk/eventstream-marshaller"); // for converting binary event stream messages to and from JSON
    const util_utf8_node    = require("@aws-sdk/util-utf8-node"); // utilities for encoding and decoding UTF8
    const mic               = require('microphone-stream').default; // collect microphone input as a stream of raw bytes

    // our converter between binary event streams messages and JSON
    const eventStreamMarshaller = new marshaller.EventStreamMarshaller(util_utf8_node.toUtf8, util_utf8_node.fromUtf8);

    // our global variables for managing state
    let sampleRate = 44100;
    let inputSampleRate = 44100;
    let socket;
    let micStream;
    let socketError = false;
    let transcribeException = false;

    const [messages, setMessages] = useState([
        {
            "from": "gamerpro123",
            "message": "Yooo what's up? Wanna play a game?",
            "redacted": null
        }
        ]);
    const [message, setMessage] = useState(null);
  
    function redact_pii(msg, pii_name, start, end) {
        var ph = '';
        for (var i=start;i<end;i++)
            ph += '#'
        return msg.substring(0,start) + ph + msg.substring(end, msg.length);
    }
    
    function parse_pii_response(data) {
        var isvalid = true;
        var redacted = null;
        if (data != null && data.length > 0 && data[0].Entities.length > 0) {
            //resp[0].forEach((x, i) => (msg === null)?msg = x["profanity_text"] : msg += ', ' + x["profanity_text"]);
            data[0]["Entities"].forEach((x, i) => (redacted = redact_pii(message, x["Type"], x["BeginOffset"], x["EndOffset"])));
            isvalid = false;
        }
        return {"isvalid":isvalid, "redacted_msg": redacted};
    }
  
    function parse_profanity_response(data) {
        var redacted = null;
        var isvalid = true;
        if (data[0] != null && data[0].length > 0) {
            redacted = message;
            //redacted = redact_profanity(msg, resp);
            for(var i=0;i<data[0].length;i++) {
                var regEx = new RegExp(data[0][i]["profanity_text"], "ig");
                redacted = redacted.replace(regEx, "&^%?$#");
            }
            isvalid = false;
        }
        return {"isvalid":isvalid, "redacted_msg": redacted};
    }
  
    function parse_toxic_response(data) {
        var isvalid = true;
        if (data != null && data.length > 0) {
            isvalid = data[0].Name !== "Toxic";
        }
        const r = {"isvalid":isvalid, "redacted_msg": null};
        setToxic(r);
        return r;
        
    }
  
    const handleChange = (e) => {
        setMessage(e.target.value);
    }
  
    const handleSimulation = (e) => {
        if(e !== null && e !== undefined && e.from !== undefined) {
            let ms = Object.assign([], messages);
            ms.unshift(e);
            setMessages(ms);
        }
    }
  
    async function handleClick(e) {
        if(e.keyCode === 13) {
            if(message === null && message.length === 0) {
                setMessage(null);
                setToxic({"isvalid":false, "redacted_msg": null});
                return;
            }
            Promise.all([
                    //checkToxic(message), checkProfanity(message), checkPii(message),
                    FetchData('/text/pii', "post",{
                        text: [message]
                        }),
                    FetchData('/text/profanity', "post",{
                        text: [message]
                        }),
                    FetchData('/text/toxic', "post",{
                        text: [message]
                        }),
                ]).then(function (responses) {
                    // Get a JSON object from each of the responses
                    return Promise.all(responses.map(function (response) {
                        return response;
                    }));
                }).then(function (data) {
        
                    var pii_result = parse_pii_response(JSON.parse(data[0].body));
                    var profanity_result = parse_profanity_response(JSON.parse(data[1].body));
                    var toxic_result =  parse_toxic_response(JSON.parse(data[2].body));
        
                    //console.log(">>>>>RESULT", toxic_result, profanity_result, pii_result);
        
                if (toxic_result.isvalid && profanity_result.isvalid && pii_result.isvalid) {
                        var m = messages;
                        m.unshift(
                            {
                                "message":message,
                                "from": "you",
                                "redacted": null
                            }
                        )
                        setMessages(m);
                        setMessage(null);
                    }
                    else if(!toxic_result.isvalid) {
                        // toxic, leave the message in the textbox
                        // Show inline error message without submitting the message
                    }
                    else if(!pii_result.isvalid) {
                        m = messages;
                        m.unshift(
                            {
                                "message":pii_result.redacted_msg,
                                "from": "You",
                                "redacted": "PII word(s) redacted"
                            }
                        )
                        setMessages(m);
                        setMessage(null);
                    }
                    else if(!profanity_result.isvalid) {
                        m = messages;
                        m.unshift(
                            {
                                "message":profanity_result.redacted_msg,
                                "from": "You",
                                "redacted": "Profanity word(s) redacted"
                            }
                        )
                        setMessages(m);
                        setMessage(null);
                    }
                }).catch(function (error) {
                    // if there's an error, log it
                    console.log(error);
                });
        }
    }

    function getSts() {
        FetchData('/auth/sts', "post")
        .then(function (data) {
            let s = JSON.parse(data.body);
            setSts(s);
        })
        .catch(function(err) {
                console.log(`Error: ${err}` )
        });
    }

    // Audio start
    function createPresignedUrl() {
        if (sts === null)
            getSts();

        let endpoint = "transcribestreaming." + sts.region + ".amazonaws.com:8443";
        
        // get a preauthenticated URL that we can use to establish our WebSocket
        return v4.createPresignedURL(
            'GET',
            endpoint,
            '/stream-transcription-websocket',
            'transcribe',
            crypto.createHash('sha256').update('', 'utf8').digest('hex'), {
                'key': sts.accessKeyId,
                'secret': sts.secretAccessKey,
                'sessionToken': sts.sessionToken,
                'protocol': 'wss',
                'expires': 15,
                'region': sts.region,
                'query': 'language-code=en-US&media-encoding=pcm&sample-rate=44100&vocabulary-filter-name=cm-demo-gaming-profane-filter&vocabulary-filter-method=mask'
            }
        );
    }
    function convertAudioToBinaryMessage(audioChunk) {
        let raw = mic.toRaw(audioChunk);

        if (raw == null)
            return;

        inputSampleRate = 44100;
        // downsample and convert the raw audio bytes to PCM
        let downsampledBuffer = audioUtils.downsampleBuffer(raw, inputSampleRate, sampleRate);
        let pcmEncodedBuffer = audioUtils.pcmEncode(downsampledBuffer);

        // add the right JSON headers and structure to the message
        let audioEventMessage = getAudioEventMessage(Buffer.from(pcmEncodedBuffer));

        //convert the JSON object + headers into a binary event stream message
        let binary = eventStreamMarshaller.marshall(audioEventMessage);

        return binary;
    }
    function getAudioEventMessage(buffer) {
        // wrap the audio data in a JSON envelope
        return {
            headers: {
                ':message-type': {
                    type: 'string',
                    value: 'event'
                },
                ':event-type': {
                    type: 'string',
                    value: 'AudioEvent'
                }
            },
            body: buffer
        };
    }

    function handleEventStreamMessage(messageJson) {
        let results = messageJson.Transcript.Results;

        if (results.length > 0) {
            if (results[0].Alternatives.length > 0) {
                let transcript = results[0].Alternatives[0].Transcript;

                // fix encoding for accented characters
                transcript = decodeURIComponent(escape(transcript));

                // update the textarea with the latest result
                let m = message;
                if (m === null) 
                    m = transcript;
                else
                    m = message + "\n" + transcript;
                setMessage(m);

                // if this transcript segment is final, push to the converstation list
                if (!results[0].IsPartial) {

                    var ms = messages;
                    ms.unshift(
                        {
                            "message":transcript,
                            "from": "you",
                            "redacted": null
                        }
                    );
                    setMessages(ms);
                    setMessage(null);
                }
            }
        }
    }

    function wireSocketEvents() {
        // handle inbound messages from Amazon Transcribe
        socket.onmessage = function (message) {
            //convert the binary event stream message to JSON
            let messageWrapper = eventStreamMarshaller.unmarshall(Buffer(message.data));
            let messageBody = JSON.parse(String.fromCharCode.apply(String, messageWrapper.body));
            if (messageWrapper.headers[":message-type"].value === "event") {
                handleEventStreamMessage(messageBody);
            }
            else {
                transcribeException = true;
                console.log(messageBody.Message);
            }
        };

        socket.onerror = function () {
            socketError = true;
            console.log('WebSocket connection error. Try again.');
        };
        
        socket.onclose = function (closeEvent) {
            micStream.stop();
            
            // the close event immediately follows the error event; only handle one.
            if (!socketError && !transcribeException) {
                if (closeEvent.code !== 1000) {
                    console.log('</i><strong>Streaming Exception</strong><br>' + closeEvent.reason);
                }
            }
        };
    }

    function streamAudioToWebSocket(userMediaStream) {
        //let's get the mic input from the browser, via the microphone-stream module
        micStream = new mic();
    
        micStream.on("format", function(data) {
            inputSampleRate = data.sampleRate;
        });
    
        micStream.setStream(userMediaStream);
    
        // Pre-signed URLs are a way to authenticate a request (or WebSocket connection, in this case)
        // via Query Parameters. Learn more: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html
        let url = createPresignedUrl();

        //open up our WebSocket connection
        socket = new WebSocket(url);
        socket.binaryType = "arraybuffer";
    
        // when we get audio data from the mic, send it to the WebSocket if possible
        socket.onopen = function() {
            micStream.on('data', function(rawAudioChunk) {
                // the audio stream is raw audio bytes. Transcribe expects PCM with additional metadata, encoded as binary
                let binary = convertAudioToBinaryMessage(rawAudioChunk);

                if (socket.readyState === socket.OPEN)
                    socket.send(binary);
            }
        )};
    
        setSock(socket);
        // handle messages, errors, and close events
        wireSocketEvents();
    }

  function handleMicrophone(e) {
    var m_on = microphone
    setMicrophone(!m_on);
    
    if (m_on) {
        closeSocket();
    }
    else {
        window.navigator.mediaDevices.getUserMedia({
                audio: true
            })
            // ...then we convert the mic stream to binary event stream messages when the promise resolves 
            .then(streamAudioToWebSocket) 
            .catch(function (error) {
                console.log(error);
            });
        }
    }
        
    function closeSocket() {
        if (sock !== null && sock.readyState === sock.OPEN) {
            //micStream.stop();

            // Send an empty frame so that Transcribe initiates a closure of the WebSocket after submitting all transcripts
            let emptyMessage = getAudioEventMessage(Buffer.from(new Buffer([])));
            let emptyBuffer = eventStreamMarshaller.marshall(emptyMessage);
            sock.send(emptyBuffer);
        }
        setSock(sock);
    }  

    useEffect(() => {
        if (sts === null) {
            getSts();
        }
    });

    function handleClearChat() {
        setMessages([]);
    }
  
    return (
        <div className="ChatBox">
            <div className="MessageArea">
            {messages.map((m, i) => (
                <div><div className={m.from}>{m.from}:</div> {m.message} {m.redacted != null? <label className="moderation">[{m.redacted}]</label>:<label/>}</div>
                ))
            }
            </div>
            <div className="ChatInput">
                {!toxic.isvalid? <div className="inline_message">Toxicity message</div> :<div/>}
                <textarea className={toxic.isvalid ? 'valid': 'invalid'} onChange={handleChange} value={(message == null?'':message)} onKeyDown={handleClick} placeholder='Do not share personal information for your own safety' />
                <button id="btnMicrophone" className={microphone?"microphone-off": "microphone-on"} onClick={handleMicrophone}></button>
                <Simulator onSimulation={handleSimulation}></Simulator>
                <div onClick={handleClearChat} className="clear">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear chat</div>
            </div>
        </div>
    );
}

export default ChatBox;
