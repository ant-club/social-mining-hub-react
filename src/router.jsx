import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './layout/main';
import Sidebar from './layout/sidebar';
import ConnectWallet from './layout/connectWallet';
import Top from './layout/top';
import Profile from './layout/profile';
import Index from './components/index';
import Missions from './components/missions';
import Mission from './components/mission';
import History from './components/history';
import Store from './models';

function MyRouter(props) {
  return (
    <Router {...props}>
      <Store>
        <div id="app">
          <Sidebar />
          <Main>
            <Top />
            <div className="site-page">
              <Profile />
              <Switch>
                <Route path="/" exact component={Index} />
                <Route path="/missions" exact component={Missions} />
                <Route path="/mission/:id" exact component={Mission} />
                <Route path="/history" exact component={History} />
              </Switch>
            </div>
          </Main>
        </div>
        <ConnectWallet />
      </Store>
    </Router>
  );
}

export default MyRouter;
