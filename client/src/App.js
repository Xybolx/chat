import React, { Component } from 'react';
import './App.css';
import Chat from "./components/chat";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";
import { Route, Switch } from "react-router-dom";

class App extends Component {

  render() {
    
    return (
  
      <div className="App jumbotron jumbotron-fluid">
        <Switch>
          <Route exact path="/" component={SignUp} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/chat" component={Chat} />
        </Switch>
      </div>

    );
  };
};

export default App;
