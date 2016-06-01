import {Router, Route, Redirect, browserHistory, Link} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import reducers from './reducers/index'
import Utility from './modules/utility'

import * as Routes from './constants/routes';

require('../node_modules/bootstrap/dist/css/bootstrap.css');

/* Import the required components and containers to handle routing */
import App from './containers/App'
import Home from './components/Home'
import LoginRedirect from './components/LoginRedirect'
import RegisterAccount from './components/RegisterAccount'
import DeveloperDashboard from './containers/DeveloperDashboard'
import DeveloperHome from './components/DeveloperHome'
import Registrations from './components/Registrations'
import Roles from './components/Roles'
import Authorization from './modules/authorization'
import SessionProblem from './components/SessionProblem'

const gradesApp = combineReducers({
  reducers,
  routing: routerReducer
});

const loggerMiddleware = createLogger();

const initialState = {
  reducers: {
    userAccount: Authorization.loadCredentialsFromLocalStorage(),
    addRegistrationForm: Utility.getPersistedAddRegistrationForm()
  }
};

let store = createStore(
  gradesApp,
  initialState,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>

      <Route component={App}>
        <Route path={Routes.SESSION_PROBLEM} component={SessionProblem}/>

        <Route path={Routes.HOME} component={Home}/>
        <Route path={Routes.LOGIN_REDIRECT} component={LoginRedirect}/>
        <Route path={Routes.REGISTER_ACCOUNT} component={RegisterAccount}/>

        <Route component={DeveloperDashboard}>
          <Route path={Routes.DEVELOPER_HOME} component={DeveloperHome} />
          <Route path={Routes.DEVELOPER_REGISTRATIONS} component={Registrations} />
          <Route path={Routes.DEVELOPER_ROLES} component={Roles} />
        </Route>

        <Redirect from="*" to={Routes.HOME}/>
      </Route>
    </Router>
  </Provider>
  , document.getElementById('app')
);
