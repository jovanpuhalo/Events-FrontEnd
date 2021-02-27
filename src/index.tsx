import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { HashRouter, Route } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import HomePage from './components/HomePage/HomePage';
import ContactPage from './components/ContactPage/ContactPage';
import UserLogin from './components/UserLogin/UserLogin';
import UserLogout from './components/UserLogout/UserLogout';
import EventsPage from './components/EventsPage/EventsPage';
import SingleEventPage from './components/SingleEventPage/SingleEventPage';
import { UserRegistrationPage } from './components/UserRegistratironPage/UserregistrationPage';
import UserEventsPage from './components/UserEventsPage/UserEventsPage';
import UserProfilePage from './components/UserProfilePage/UserProfilePage';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/user/login" component={UserLogin} />
        <Route path="/user/logout" component={UserLogout} />
        <Route path="/user/registration/" component={UserRegistrationPage} />
        <Route path="/eventType/:eId" component={EventsPage} />
        <Route path="/event/:eId" component={SingleEventPage} />
        <Route path="/user/userEvents/" component={UserEventsPage} />
        <Route path="/user/userId" component={UserProfilePage} />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoi nt. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
