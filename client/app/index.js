import { Router, Route, browserHistory, Link } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import GradesApp from './containers/GradesApp'

import reducers from './reducers/index'

// Vrem ca stilurile sa functioneze, asa ca le importam.
require('../node_modules/bootstrap/dist/css/bootstrap.css');

const gradesApp = combineReducers({
  reducers,
  routing: routerReducer
});

let store = createStore(gradesApp);
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={GradesApp}>

      </Route>
    </Router>
  </Provider>
  , document.getElementById('app')
);
