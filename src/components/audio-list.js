import { useState, useEffect } from "react";
import * as React from "react";
import { Box, Button, Table, TextFilter, Modal, SpaceBetween, Link,Pagination, StatusIndicator, Header, Flashbar} from '@cloudscape-design/components';
import { AudioDetail } from './audio-detail';
import { AudioCreate } from "./audio-create";
import { FetchData } from "../resources/data-provider";

const PAGE_SIZE = 10;

function AudioList ({user, onItemClick, onSelectionChange}) {


  function getCurrentPageItems (items, curPage=null) {
    if (curPage === null) curPage = currentPageIndex;
    if (items === null || items.length === 0) return [];
    else {
      var result = [];
      items.forEach((i, index) => {
        //console.log(index, (currentPageIndex - 1) * PAGE_SIZE, currentPageIndex * PAGE_SIZE);
        if (index >= ((curPage - 1) * PAGE_SIZE) && index < curPage * PAGE_SIZE) {
          result.push(i);
        }
        return result;
      }, result)
    }
    return result;
  }
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [items, setItems] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [isDescending, setIsDescending] = useState(false);
  const [filterText, setFilterText] = useState(null);

  const [selectedItems, setSelectedItems ] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [showDetail, setShowDetail] = useState(false); 
  const [loadingStatus, setLoadingStatus] = useState(null); //null, LOADING, LOADED
  
  const [notifications, setNotifications] = React.useState([{
    type: "info",
    dismissible: true,
    dismissLabel: "Dismiss message",
    onDismiss: () => setNotifications([]),
    content: (
      <>
        This page demonstrates the Transcribe toxicity detection features in beta. 
      </>
    ),
    id: "message_1"
  }]);

  useEffect(() => {
    if (items.length === 0 && loadingStatus === null) {
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
      
    }
  })

  const handleViewDetail = e => {
    var n = e.detail.target;
    setSelectedItems([items.find(i =>i.name === n)]);
    setShowDetail(true);
    setShowCreate(false);
  }

  async function handleDeleteSubmit(e)  {
    setShowDelete(false);
    var si = Object.assign({}, selectedItems[0]);
    si.status = "DELETING"
    setSelectedItems([si]);

    setLoadingStatus("LOADING");

    if (selectedItems !== null && selectedItems.length > 0) {
      FetchData("/task/delete-task", "post", {
        name: selectedItems[0].name
      }).then((data) => {
            if (data.statusCode === "200")
            setItems([]);
            setPageItems([]);
            setLoadingStatus(null);
          })
        .catch((err) => {
          console.log(err.message);
        });      
    }
  }

  const handleDeleteDismiss = e => {
    setShowDelete(false);
  }

  const handleAudioCreate = e => {
    setShowCreate(true);
  }

  const handleCreateDismiss = e => {
    setShowCreate(false);
  }

  const handleBackToList = e => {
    // reload the list
    setItems([]);
    setPageItems([]);
    setSelectedItems([]);
    setShowDetail(false);
    setLoadingStatus(null);
  }

  const handleDelete = e =>{
    setShowDelete(true);
  }

  const handleSortingChange = e => {
    //console.log(e);
    if (items.length === 0)
      return

    let is = items.map(i=> i);
    var sortingField = e.detail.sortingColumn.sortingField;
    if (!isDescending) {
      is.sort( (a, b) => {
        if (sortingField === "total_files")
          return a[sortingField] - b[sortingField];
        if (a[sortingField] < b[sortingField]) {
          return -1;
        }
        if (a[sortingField] > b[sortingField]) {
          return 1;
        }
      });
    }
    else {
      is.reverse( (a, b) => {
        if (sortingField === "total_files")
          return a[sortingField] - b[sortingField];

        if (a[sortingField] < b[sortingField]) {
          return -1;
        }
        if (a[sortingField] > b[sortingField]) {
          return 1;
        }
      });
    }
    setIsDescending(!isDescending);
    setItems(is);
    setPageItems(getCurrentPageItems(is));
  }

const handlePaginationChange = e => {
  console.log(e);
  setCurrentPageIndex(e.detail.currentPageIndex);
  setPageItems(getCurrentPageItems(items, e.detail.currentPageIndex));
}

const handleFilterChaneg = e => {
  setFilterText(e.detail.filteringText);
  if (filterText === null || filterText.length === 0) {
    setItems(items);
    setPageItems(getCurrentPageItems(items));
  }
  else if (filterText !== null) {
    let result = []
    items.forEach((i) => {
      if (i.name.toLowerCase().includes(e.detail.filteringText.toLowerCase())) {
        result.push(i);
      }
      return result;
    }, result)
    setPageItems(getCurrentPageItems(result));
  }
}

  return (
      <div> 
      <p><Flashbar items={notifications} /></p>
      <br/>
      {showDetail && selectedItems.length > 0 && selectedItems[0] !== undefined?<AudioDetail jobName={selectedItems[0].name} onBack={handleBackToList} />:
        <Table
          loading={loadingStatus === "LOADING"}
          loadingText="Loading tasks"
          onSortingChange={handleSortingChange}
          onSelectionChange={({ detail }) => {
            setSelectedItems(detail.selectedItems);
            }
          }
          selectedItems={selectedItems}
          ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${
                selectedItems.length === 1 ? "item" : "items"
              } selected`,
            itemSelectionLabel: ({ selectedItems }, item) => {
              const isItemSelected = selectedItems.filter(
                i => i.name === item.name
              ).length;
              return `${item.name} is ${
                isItemSelected ? "" : "not"
              } selected`;
            }
          }}
          columnDefinitions={[
            {
              id: 'name',
              sortingField: 'name',
              header: 'Task name',
              cell: item => (
                <Link variant="primary" target={item.name} onFollow={handleViewDetail}>{item.name}</Link>
              ),
              minWidth: 180,
            },
            {
              id: 'status',
              sortingField: 'status',
              header: 'Status',
              cell: item => (
                <StatusIndicator type={item.status === 'COMPLETED' ? 'success' : item.status === 'FAILED'? 'error': 'info' }>{item.status}</StatusIndicator>
              ),
              minWidth: 100,
            },
            {
              id: 'language',
              sortingField: 'language',
              cell: item => item.language,
              header: 'Language',
              minWidth: 100,
            },
            {
              id: 'created_ts',
              sortingField: 'created_ts',
              cell: item => item.ended,
              header: 'Created at',
              minWidth: 100,
            },
          ]}
          items={pageItems}
          selectionType="single"
          trackBy="name"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No evaluation tasks</b>
              <Box
                padding={{ bottom: "s" }}
                variant="p"
                color="inherit"
              >
                No task to display.
              </Box>
              <Button onClick={handleAudioCreate}>Create transcription job</Button>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find tasks"
              filteringText={filterText}
              onChange={handleFilterChaneg}
            />
          }
          header={
            <Header
            variant="awsui-h1-sticky"
            title="Audio transcription tasks"
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                {/* <Button disabled={!isOnlyOneSelected}>Edit</Button>*/}
                <Button onClick={handleDelete} disabled={selectedItems.length === 0 || selectedItems[0] === undefined || selectedItems[0].status === "MODERATING"}>Delete job</Button>
                <Button variant="primary" onClick={handleAudioCreate}>Create transcription job</Button>
              </SpaceBetween>
            }
          />
          }
          pagination={
            <Pagination
              currentPageIndex={currentPageIndex}
              onChange={handlePaginationChange}
              pagesCount={items !== null?Math.ceil(items.length/PAGE_SIZE,0): 1}
              ariaLabels={{
                nextPageLabel: "Next page",
                previousPageLabel: "Previous page",
                pageLabel: pageNumber =>
                  `Page ${pageNumber} of all pages`
              }}
            />
          }
        />}
      {showCreate?
      <AudioCreate jobNames={items.map(i=>i.name)} onDismiss={handleCreateDismiss} />
      :<div/>}
      {showDelete?
        <Modal
          visible={true}
          onSubmit={handleDeleteSubmit}
          onDismiss={handleDeleteDismiss}
          size="medium"
          header="Delete task"
          closeAriaLabel="Close dialog"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={handleDeleteSubmit}>
                Delete
              </Button>
              <Button variant="normal" onClick={handleDeleteDismiss}>
                Cancel
              </Button>
              </SpaceBetween>
            </Box>
          }>
          Do you want to delete the task? All related resources will be deleted, including the images uploaded to the S3 bucket folder if you have already uploaded images.
        </Modal>      
      :<div/>}
    </div>
  );
}

export {AudioList};