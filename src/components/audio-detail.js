import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Header,
  SpaceBetween,
  StatusIndicator,
  Link,
  Pagination,
  Toggle,
  Spinner
} from '@cloudscape-design/components';
import Cards from "@cloudscape-design/components/cards";
import { AudioToxicityDetail } from './audio-toxicity-detail';
import Badge from "@cloudscape-design/components/badge";
import ReactAudioPlayer from 'react-audio-player';
import { FetchData } from "../resources/data-provider";

function getAvgToxicityConfidence(job) {
  var total = 0;
  var count = 0;
  var toxicity_count = 0
  if (job !== undefined)
    job.toxicity.forEach(function(i, idx) {
        if (i.toxicity >= 0.5) {
          total += i.toxicity;
          toxicity_count++;
        }
        count++;
      }
    )
  var avg = 0
  if (toxicity_count > 0) {
    avg = total/toxicity_count;
  }
  return {"average_confidence_score": avg, "total_count": count, "toxicity_count": toxicity_count}
}

function getToxicSegments(job_full) {
  if (job_full === undefined)
    return null;
  var j = Object.assign({}, job_full);
  j.toxicity = job_full.toxicity.filter(t=> t.toxicity >= 0.5);  
  return j;
}

function AudioDetail ({jobName, onBack}) {


  const [loadedFlag, setLoadedFlag ] = useState(false);
  const [jobFull, setJobFull ] = useState(null);

  const [avgToxicity, setAvgToxicity] = useState(null);
  const [job, setJob] = useState(null)

  const [selectedItem, setSelectedItem] = useState(undefined);
  const [toxicityToggleChecked, setToxicityToggleChecked] = useState(true);

  const handleDismiss = e => {
    setSelectedItem(undefined);
  }

  useEffect(() => {
    if (!loadedFlag)
    {
      FetchData('/audio/job', "post", {
        job_name: jobName
      })
        //.then((response) => response.json())
        .then((data) => {
            var j = JSON.parse(data.body);
            setJobFull(j);
            setAvgToxicity(getAvgToxicityConfidence(j));
            setJob(getToxicSegments(j));
        })
        .catch((err) => {
          console.log(err.message);
        });

      setLoadedFlag(true);
    }
  })

  function handleToxicityToggleChecked(checked) {
    setToxicityToggleChecked(checked);
    if(checked)
      setJob(getToxicSegments(jobFull));
    else
      setJob(jobFull);
  }
  const JobDetails = () => (
    <ColumnLayout columns={3} variant="text-grid">
      <SpaceBetween size="l">
        <div>
          <Box variant="awsui-key-label">Job name</Box>
          <div>{job!==null?job.name:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Language</Box>
          <div>{job!==null?job.language:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Created</Box>
          <div>{job!==null?job.created:""}</div>
        </div>        
        <div>
          <StatusIndicator type={job!==null && job.status === 'COMPLETED' ? 'success' : job!==null && job.status === 'FAILED'?'error':'info'}>
            {job!==null?job.status:""}
          </StatusIndicator>  
        </div>
      </SpaceBetween>
  
      <SpaceBetween size="l">
        <div>
          <Box variant="awsui-key-label">Started</Box>
          <div>{job!==null?job.started:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Ended</Box>
          <div>{job!==null?job.ended:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Input file format</Box>
          <div>{job!==null?job.format:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Audio sampling rate</Box>
          <div>{job!==null?job.rate:""}</div>
        </div>
      </SpaceBetween>
      <SpaceBetween size="l">
        <div>
          <Box variant="awsui-key-label">Input data location</Box>
          <div>{job!==null?job.input_s3_uri:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Output data location</Box>
          <div>
            <Link external
              externalIconAriaLabel="Download the transcrip JSON file" 
              href={job!==null?job.output_s3_uri:""}>
              Service-managed S3 bucket
            </Link>
          </div>
        </div>
      </SpaceBetween>
    </ColumnLayout>
  );
  const ToxicitySummary = () => (
    
    <ColumnLayout columns={1} variant="text-grid">
      <SpaceBetween size="l">
        <Cards
        ariaLabels={{
          itemSelectionLabel: (e, t) => `select ${t.start_time}`,
          selectionGroupLabel: "Item selection"
        }}
        cardDefinition={{
          header: e => <Link onFollow={({ detail }) =>
              {
                setSelectedItem(job.toxicity.find(t=>t.start_time===e.start_time));
              }
            }>{e.start_time + ' - ' + e.end_time + ' s'}</Link>,
          sections: [
            {
              id: "confidence",
              header: "Toxicity confidence score",
              content: e => (
                <Badge color={e.toxicity>=0.5?'red':'green'}>{Number(e.toxicity).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}</Badge>
              )
            },
            {
              id: "text",
              header: "Transcribed text",
              content: e => e.text.length > 50 ? e.text.substr(1,50) + '...':e.text
            },

          ]
        }}
        cardsPerRow={[
          { cards: 3 },
          { minWidth: 500, cards: 3 }
        ]}
        items={job.toxicity}
        loadingText="Loading segments"
        trackBy="start_time"
        visibleSections={["text", "confidence"]}
        empty={
          <Box textAlign="center" color="inherit">
            <b>No segments</b>
            <Box
              padding={{ bottom: "s" }}
              variant="p"
              color="inherit"
            >
              No segments to display.
            </Box>
          </Box>
        }
        header={
          <Header
          actions={
            <Box>
                <Toggle
                  onChange={({ detail }) =>
                    handleToxicityToggleChecked(detail.checked)
                  }
                  checked={toxicityToggleChecked}
                >
                  Only show toxic segments
                </Toggle>
            </Box>
          }
          >
            Audio segments
          </Header>
        }
        pagination={
          <Pagination currentPageIndex={1} pagesCount={2} />
        }
      />
      </SpaceBetween>
    </ColumnLayout>
  )

    return (
      <div>
        <Container
          header={
            <div>
            <Header
              variant="h2"
              info={''}>
              Job detail
            </Header>
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                {!loadedFlag?<Spinner />:<div/>}
                <Button variant="normal" onClick={onBack}>
                  Back to list
                </Button>
              </SpaceBetween>
            </Box> 
            </div>
          }>
          <JobDetails />
        </Container>
        <br/>
        <Container
          header={
            <div>
            <Header
              variant="h2"
              info={''}>
              Play the audio
            </Header>
            </div>
          }>
          <ReactAudioPlayer
            src={job !== null?job.input_s3_pre_signed_url:""}
            controls
          />
        </Container>
        {jobFull !== null && jobFull.toxicity !== null && jobFull.toxicity.length > 0 ? 
        <div>
        <br/>
        <Container
          header={
            <Header
              variant="h2">
              Toxicity detection
              &nbsp;{avgToxicity.average_confidence_score>=0.5?<Badge color='red'>Toxic</Badge>:<Badge color='green'>Nontoxic</Badge>}
            </Header>
          }>
          <ToxicitySummary />
        </Container>
        <br />
        {selectedItem !== undefined?
        <Container
          header={
            <Header
              variant="h2">
              Toxicity analysis
            </Header>
          }>
          <AudioToxicityDetail segment={selectedItem} inputUrl={job.input_s3_pre_signed_url} onDismiss={handleDismiss}/>
        </Container>:<div/>}
        </div>
        : <div/>}
      </div>
    );
}

export {AudioDetail};