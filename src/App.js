import React, { Component } from 'react';
import './App.css';
import '../node_modules/material-components-web/dist/material-components-web.min.css';
import EVEWindowManager from './EVEWindowManager';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      mobile: this.mobileCheck(),
    };
    window.addEventListener("resize", this.updateIsMobile.bind(this));
  }

  mobileCheck () {
    return window.innerWidth < 500;
  }

  updateIsMobile () {
    this.setState({
      mobile: this.mobileCheck(),
    });
  }

  render() {
    return (
      <div className="App">
        <EVEWindowManager
        	id={"wm"}
          mobile={this.state.mobile}
          style={{ backgroundColor: '#283b4c' }}
        />
      </div>
    );
  }
}

export default App;
