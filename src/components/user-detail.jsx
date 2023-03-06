import React from 'react';
import { Box, Button, ColumnLayout, Modal, SpaceBetween, Badge} from '@cloudscape-design/components';

function UserDetail ({userProfile, onDismiss}) {

  //const [user, setUser] = useState(userProfile);
  const user = userProfile;

    return (<Modal
      visible={true}
      onDismiss={onDismiss}
      closeAriaLabel="Close dialog"
      header={<Box variant="h1">{user!==null?user.user:""}</Box>}
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" >
              Ban User
            </Button>
            <Button variant="normal" >
              Send a warning
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <ColumnLayout columns={2}>
        <div>
          <Box variant="awsui-key-label">Member</Box>
          <div>{user!==null?user.user_group:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Toxicity</Box>
          <div>
            <Badge color={user.toxicity>0.5?'red':'green'}>{user.toxicity.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1})}</Badge>
          </div>
        </div>
        <div>
          <Box variant="awsui-key-label">Registered at</Box>
          <div>{user!==null?user.registered_ts:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Last login</Box>
          <div>{user!==null?user.last_ts:""}</div>
        </div>      
        <div>
          <Box variant="awsui-key-label">#s of posts</Box>
          <div>{user!==null?user.post_count:""}</div>
        </div>
        <div>
          <Box variant="awsui-key-label"># of audio chats</Box>
          <div>{user!==null?user.audio_count:""}</div>
        </div> 
      </ColumnLayout>

    </Modal>
  );
}

export {UserDetail};