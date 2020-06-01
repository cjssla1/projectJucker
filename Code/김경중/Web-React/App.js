import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';

class App extends Component {

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
