import { useState, useEffect } from "react";
import * as React from "react";
import { Box, Button, Table, TextFilter, Modal, SpaceBetween, Container, Alert, Textarea, Link,Pagination, StatusIndicator, Header, Badge} from '@cloudscape-design/components';
import { PostCreate } from "./post-create";
import { PostDetail } from "./post-detail";
import { FetchData } from "../resources/data-provider";
import posts from "../resources/social-post.json";

const PAGE_SIZE = 10;


function PostList ({user, onItemClick, onSelectionChange}) {

  const COLUMNS = [
    {
      id: 'id',
      sortingField: 'title',
      header: 'Post title',
      cell: item => (
        <Link variant="primary" target={item.id} onFollow={handleViewDetail}>{item.title}</Link>
      ),
      minWidth: 180,
    },
    {
      id: 'toxicity',
      sortingField: 'toxicity',
      header: 'Toxicity Score',
      cell: item => (
        <Badge color={item.toxicity>0.5?'red':'green'}>{item.toxicity.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})}</Badge>
      ),
      minWidth: 100,
    },
    {
      id: 'user',
      sortingField: 'user',
      cell: item => item.user,
      header: 'User',
      minWidth: 100,
    },
    {
      id: 'created_ts',
      sortingField: 'created_ts',
      cell: item => item.created_ts,
      header: 'Created at',
      minWidth: 100,
    },
  ]
  function getCurrentPageItems (items, curPage=null) {
    if (curPage === null) curPage = currentPageIndex;
    if (items === null || items.length === 0) return [];
    else {
      var result = [];
      items.forEach((i, index) => {
        if (index >= ((curPage - 1) * PAGE_SIZE) && index < curPage * PAGE_SIZE) {
          result.push(i);
        }
        return result;
      }, result)
    }
    return result;
  }
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [items, setItems] = useState(posts);
  const [pageItems, setPageItems] = useState(posts);
  const [isDescending, setIsDescending] = useState(false);
  const [filterText, setFilterText] = useState(null);

  const [selectedItems, setSelectedItems ] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [showDetail, setShowDetail] = useState(false); 
  const [loadingStatus, setLoadingStatus] = useState(null); //null, LOADING, LOADED
  
  
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
    const id = e.detail.target;
    setSelectedItems([items.find(i =>i.id == id)]);
    setShowCreate(false);
    setShowDetail(true);
  }

  async function handleDeleteSubmit(e)  {
    setShowDelete(false);
    var si = Object.assign({}, selectedItems[0]);
    si.status = "DELETING"
    setSelectedItems([si]);

    setLoadingStatus("LOADING");

    if (selectedItems !== null && selectedItems.length > 0) {
      FetchData("/task/delete-task", "post", {
        id: selectedItems[0].id
      }).then((data) => {
            if (data.statusCode == "200")
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

  const handlePostCreate = e => {
    setShowCreate(true);
  }

  const handleCreateDismiss = e => {
    setShowCreate(false);
  }

  const handleDetailDismiss = e => {
    setShowDetail(false);
  }

  const handleBackToList = e => {
    // reload the list
    setItems([]);
    setPageItems([]);
    setSelectedItems([]);
    setShowDetail(false);
    setLoadingStatus(null);
  }

  const handleCreateSubmit = e => {
    setShowCreate(false);    
    setSelectedItems([e.task]);
    setShowDetail(true);
  }

  const handleDelete = e =>{
    setShowDelete(true);
  }

  const handleSortingChange = e => {
    //console.log(e);
    if (items.length == 0)
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
  if (filterText === null || filterText.length == 0) {
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
      <div> <br/>
        <Table
          loading={loadingStatus === "LOADING"}
          loadingText="Loading stories"
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
                i => i.id === item.id
              ).length;
              return `${item.id} is ${
                isItemSelected ? "" : "not"
              } selected`;
            }
          }}
          columnDefinitions={COLUMNS}
          items={pageItems}
          selectionType="single"
          trackBy="id"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No stories</b>
              <Box
                padding={{ bottom: "s" }}
                variant="p"
                color="inherit"
              >
                No stories to display.
              </Box>
              <Button onClick={handlePostCreate}>Create story</Button>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find stories"
              filteringText={filterText}
              onChange={handleFilterChaneg}
            />
          }
          header={
            <Header
            variant="awsui-h1-sticky"
            title="Stories"
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button onClick={handleDelete} disabled={selectedItems.length === 0 || selectedItems[0].status == "MODERATING"}>Delete story</Button>
                <Button variant="primary" onClick={handlePostCreate}>Create story</Button>
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
        />
      {showCreate?
      <PostCreate post={null} onDismiss={handleCreateDismiss} />
      :<div/>}
      {showDetail?
      <PostDetail post={selectedItems.length > 0? selectedItems[0]: null} onDismiss={handleDetailDismiss} />
      :<div/>}
      {showDelete?
        <Modal
          visible={true}
          onSubmit={handleDeleteSubmit}
          onDismiss={handleDeleteDismiss}
          size="medium"
          header="Delete story"
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
          Do you want to delete the post: <b>{selectedItems[0].name}</b>? All related resources will be deleted, including the images uploaded to the S3 bucket folder if you have already uploaded images.
        </Modal>      
      :<div/>}
    </div>
  );
}

export {PostList};