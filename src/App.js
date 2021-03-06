import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import TabPanel from "./UI/TabPanel";
import './assets/main.css';

import DM from "./discrete-mathematics/DM";
import ETPRApp from "./ETPR/ETPRApp";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const allTabs = ['/etpr', '/dm', '/about'];

  return (
    <BrowserRouter>
      <Route
        path="/"
        render={({location}) => (
          <>
            <AppBar position="static">
              <Tabs value={location.pathname}>
                <Tab
                  label="ЕТПР"
                  value={allTabs[0]}
                  component={Link}
                  to={allTabs[0]}
                  {...a11yProps(0)}
                />
                <Tab
                  label="Дискретна математика"
                  value={allTabs[1]}
                  component={Link}
                  to={allTabs[1]}
                />
                <Tab
                  label="About"
                  value={allTabs[2]}
                  component={Link}
                  to={allTabs[2]}
                />
              </Tabs>
            </AppBar>
            <Switch>
              <Route path={allTabs[0]} render={() =>
                <TabPanel>
                  <ETPRApp/>
                </TabPanel>
              }/>
              <Route path={allTabs[1]} render={() =>
                <TabPanel>
                  <DM/>
                </TabPanel>
              }/>
              <Route path={allTabs[2]} render={() =>
                <TabPanel>
                  <div className="mb-2">
                    Author: Андрій Орєхов
                  </div>
                  <div>
                    Source code: <a className="text-purple-900" href="https://github.com/chdtu-lab/etpr">etpr</a> PRs are welcome!
                  </div>
                </TabPanel>
              }/>
            </Switch>
          </>
        )}
      />
    </BrowserRouter>
  );
}

export default App;
