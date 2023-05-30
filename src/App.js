import { useState, useRef } from "react";
import Header from "@cloudscape-design/components/header";
import * as React from "react";
import Alert from "@cloudscape-design/components/alert";
import {withAuthenticator} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import {Navigation} from './components/commons/common-components';
import { AppLayout } from '@cloudscape-design/components';
import { AudioList } from "./components/audio-list";
import { PostHome } from "./components/post-home";
import { UserList } from "./components/user-list";
import StableDiffusion from "./components/stable-diffusion";
import LiveStream from "./components/livestream";
import Signup from "./components/signup";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import logo from './static/aws_logo.png'
import Overview from "./components/overview";
import { BreadcrumbGroup, Link, SpaceBetween } from '@cloudscape-design/components';


const ITEMS = [
  { type: 'link', id:"signup", text: 'User Sign Up', href:"#/signup"},
  { type: 'link', id:"posts", text: 'Community Posts', href:"#/posts"},
  { type: 'link', id:"audios", text: 'Audio Chats', href:"#/audios"},
  { type: 'link', id:"livestream", text: 'Live Stream', href:"#/livestream"},
  { type: 'divider' },
  { type: 'link', id:"overview", text: 'UGC dashboard', href:"#/overview"},
  { type: 'link', id:"users", text: 'Manage Users', href:"#/users"},
  { type: 'divider' },
  { type: 'link', id:"stablediffusion", text: 'Stable Diffusion', href:"#/stablediffusion"},
  { type: 'divider' },
  {
    type: 'link', text: 'Documentation', external: true,
  },
]


const App = ({ signOut, user }) => {
  const [currentPage, setCurrentPage] = useState("overview");
  const [currentBreadcrumb, setCurrentBreadcrumb] = useState({"id":"overview", "text": "Overview" });
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [activeNavHref, setActiveNavHref] = useState("#/overview");
  const [displayTopMenu, setDisplayTopMenu] = useState(window.self == window.top);
  const appLayout = useRef();

  const [selectedItems, setSelectedItems] = useState([]); 

  const handleItemClick = event => {
    setSelectedItems([]);
  }

  const onSelectionChange = event => {
    setSelectedItems(event.selectedItems);
  }

  const handleNavigationChange = () => {
    setNavigationOpen(!navigationOpen);
  }

  const handleHavItemClick = e => {
    setCurrentPage(e.detail.id);
    switch(e.detail.id) {
      case "livestream":
        setNavigationOpen(false);
        break;
      case "overview":

        break;
    }
    setCurrentBreadcrumb({"id":e.detail.id, "text": ITEMS.find(i=>i.id===e.detail.id).text })
    setActiveNavHref("#/"+e.detail.id);
  }

  const handleStart = e => {
    setCurrentPage("tasks");
  }

  const handleTopClick = e => {
    //console.log(e);
    setCurrentPage("overview");
    setActiveNavHref("#/overview")
    setNavigationOpen(true);
  }

    return (
      <div>
        {displayTopMenu?
      <TopNavigation      
        identity={{
          href: "#",
          title: "AWS Content Moderation - UGC demo",
          logo: {
            src: logo,
            alt: "AWS"
          },
          onFollow: handleTopClick   
        }}
        utilities={[
          {
            type: "menu-dropdown",
            text: user.username,
            description: user.email,
            iconName: "user-profile",
            onItemClick: signOut,
            items: [
              { type: "button", id: "signout", text: "Sign out"}
            ]
          }
        ]}
        i18nStrings={{
          searchIconAriaLabel: "Search",
          searchDismissIconAriaLabel: "Close search",
          overflowMenuTriggerText: "More",
          overflowMenuTitleText: "All",
          overflowMenuBackIconAriaLabel: "Back",
          overflowMenuDismissIconAriaLabel: "Close menu"
        }}
      />:<div/>}
      <AppLayout
        headerSelector="#header"
        ref={appLayout}
        contentType="table"
        navigationOpen={navigationOpen}
        onNavigationChange={handleNavigationChange}
        navigation={
          <Navigation 
            onFollowHandler={handleHavItemClick}
            selectedItems={["overview"]}
            activeHref={activeNavHref}
            items={ITEMS} 
          />}
        breadcrumbs={
          <BreadcrumbGroup 
            items={[{ "type": 'label', "text": 'Home'}, currentBreadcrumb]}
          />
        }
        toolsHide={true}
        content={
          currentPage === "audios"?<AudioList user={user} onItemClick={handleItemClick} onSelectionChange={onSelectionChange}/>:
          currentPage === "overview"?<Overview onStart={handleStart} />:
          currentPage === "users"?<UserList user={user} />:
          currentPage === "posts"?<PostHome user={user} />:
          currentPage === "signup"?<Signup />:
          currentPage === "livestream"?<LiveStream />:
          currentPage === "stablediffusion"?<StableDiffusion />:
          <div/>
        }
      >
    </AppLayout>
    </div>
  );
}
export default withAuthenticator(App);
