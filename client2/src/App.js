import React from 'react';
import './App.css';
import 'antd/dist/antd.css'; 
import {BrowserRouter as Router, Route} from 'react-router-dom'
import SignIn from './components/Signin/SignIn'
import {Home} from './Screens/home/home';
import {Test} from './Screens/test/test';
import {Contribute} from './Screens/contribute/Contribute'; 
import {Report} from './Screens/reports/Report'; 
import Signup from './components/Signup/SignUp'
import {ProtectedRoute} from './components/protectedRoute'
import axios from 'axios';
axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.common = {...axios.defaults.headers.common, ...JSON.parse(localStorage.getItem("jwt"))}


function App() {

  return (
    <Router>
      <ProtectedRoute path="/" exact component={Home}/>
      <ProtectedRoute path="/test" exact component={Test}/>
      <ProtectedRoute path="/contribute" component={Contribute}/>
      <ProtectedRoute path="/result" component={Report}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/signin" component={SignIn} />

    </Router >
  );
}

export default App;
