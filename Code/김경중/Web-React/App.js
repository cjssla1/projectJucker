import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';
class App extends Component {

  constructor(props){
    super(props);
    this.state ={
      username:null
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          critical layout
          <Routes></Routes>
        </div>
      </div>
    );
  }
}

export default App;
