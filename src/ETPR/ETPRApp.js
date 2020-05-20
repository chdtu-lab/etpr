import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import TabPanel from "../UI/TabPanel";

import Task1 from "./Task1";
import Task3 from "./Task3";
import Lab3 from "./Lab3";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ETPRApp() {
  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Л1" {...a11yProps(0)} />
          <Tab label="Л3" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Task1/>
        <Task3/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Lab3/>
      </TabPanel>
    </>
  );
}

export default ETPRApp;
