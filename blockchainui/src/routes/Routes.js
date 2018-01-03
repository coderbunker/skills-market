import React from 'react';
import Skills from '../pages/Skills';
import Register from '../pages/Register';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import Queue from '../pages/Queue';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

export default () => (
  <BrowserRouter>
    <div>
      <Route component={ScrollToTop} />
      <Switch>
        <Route path="/" exact render={props=> <Skills {...props} />}/>
        <Route path="/skills" exact render={props=> <Skills {...props} />}/>
        <Route path="/dashboard" exact render={props=> <Dashboard {...props} />}/>
        <Route path="/queue" exact render={props=> <Queue {...props} />}/>
        <Route path="/auth" exact render={props=> <Auth {...props} />}/>
        <Route path="/login" exact render={props=> <Register {...props} />}/>
      </Switch>
    </div>
  </BrowserRouter>
)

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};