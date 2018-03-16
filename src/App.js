import React, { Component } from 'react';
import './App.css';
import '../node_modules/material-components-web/dist/material-components-web.min.css';
import EVEWindowManager from './EVEWindowManager';

class App extends Component {
  render() {
    return (
      <div className="App">
        <EVEWindowManager
            style={{ backgroundColor: '#283b4c' }}
        />
      </div>
    );
  }
}

export default App;
