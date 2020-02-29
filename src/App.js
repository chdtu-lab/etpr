import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import './assets/main.css';
import Task1 from "./Task1";
import Task3 from "./Task3";
import TabPanel from "./TabPanel";
import MyReactComponent from "./MyReactComponent";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="ЕТПР" {...a11yProps(0)} />
          <Tab label="Дискретна математика" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Task1/>
        <Task3/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MyReactComponent/>
      </TabPanel>
    </>
  );
}

export default App;
