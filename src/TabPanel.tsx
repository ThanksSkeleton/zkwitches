import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import About from './tabs/About';
import Play from './tabs/Play';
import { useState } from 'react';
import { DefaultPPI, Empty, IZKBackend, PrivatePlayerInfo } from './zkWitchesTypes';
import { LoadingWidgetOutput, ZKBackend } from './zkWitchesEthers';
import { ethers } from 'ethers';
import Welcome from './tabs/Welcome';
import { PrivMapper } from './PrivMapper';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingString, setLoadingString] = useState<string>("");

  let widget = new LoadingWidgetOutput(setIsLoading, setLoadingString);

  const [backend] = useState<IZKBackend>(new ZKBackend(widget));  

  let privMapper = new PrivMapper();

  console.log("master tgs: ", backend.GetTotalGameState());
  console.log("address: ", backend.GetAddress());
  console.log("isAdmin: ", backend.IsAdmin());

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
        value={value} 
        onChange={handleChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile={true}
        aria-label="scrollable auto tabs example"
        >
          <Tab label="zkWitches" {...a11yProps(0)} disabled />
          <Tab label="Welcome" {...a11yProps(1)} />
          <Tab label="Play" {...a11yProps(2)} />
          <Tab label="About" {...a11yProps(3)} />
          <ConnectButton/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={1}>
        <Container><Welcome backend={backend} isLoading={isLoading} loadingString={loadingString}/></Container>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Container><Play isLoading={isLoading} loadingString={loadingString} privMapper={privMapper} backend={backend} widget={widget} /></Container>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <About />
      </TabPanel>
    </Box>
  );
}
