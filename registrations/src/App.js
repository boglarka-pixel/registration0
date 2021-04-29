import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <Admin />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
