import React, { useState } from 'react';
import { Box, Button, ColumnLayout, FormField, Input, Modal, SpaceBetween} from '@cloudscape-design/components';
import { FetchData } from "../resources/data-provider";


function AudioCreate ({jobNames, onDismiss}) {

  const [jobName, setJobName] = useState("");
  const [fileBytes, setFileBytes] = useState(undefined);
  const [fileType, setFileType] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = e => {
    if (jobName === "")
      setMessage("Job name cannot be empty");
    else if (jobNames.includes(jobName))
      setMessage("Job name already exits");
    else if(fileBytes === undefined)
      setMessage("Please select a file");
    else {
      console.log(fileBytes);
      FetchData('/audio/job', "put", {
        "Audio": {
            "BytesBase64": fileBytes
        },
        "FileName": jobName
      })
        .then((response) => response.json())
        .then((data) => {
            //var resp = JSON.parse(data.body);
            onDismiss(e);
        })
        .catch((err) => {
           console.log(err.message);
           setMessage("Failed to upload audio file:" + err.message);
        });

    }

  }

  const handleFileChange = async e => {
    const FR = new FileReader();
    FR.addEventListener("load", function(evt) {
      setFileBytes(evt.target.result.split('base64,')[1]);
      setFileType(e.target.files[0].type)
    }); 
    FR.readAsDataURL(e.target.files[0]);
  }

  const handleJobNameChange = e => {
    setJobName(e.detail.value.trim());
  }

    return (<Modal
      visible={true}
      onSubmit={handleSubmit}
      onDismiss={onDismiss}
      header="Create a transcription job"
      closeAriaLabel="Close dialog"
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
      <ColumnLayout columns={2}>
        <form onSubmit={handleSubmit}>
          <FormField label='Job name:'>
            <Input
              placeholder='Transcription job name'
              value={jobName}
              onChange={handleJobNameChange}
              ariaRequired={true}
            />
            {message? <Box color='text-status-error'>{message}</Box>: <div/>}
          </FormField>
          <br/>
          <SpaceBetween size="m">
          <FormField label='Upload a audio file:'>
            <input type="file" name="file" onChange={handleFileChange} accept=".wav,.mp3"/>
          </FormField>
          </SpaceBetween>
          <br/>
        </form>
      </ColumnLayout>

    </Modal>
  );
}

export {AudioCreate};