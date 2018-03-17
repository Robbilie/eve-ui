import React, { Component } from 'react';
import EVECCPWGLTab from './EVECCPWGLTab';

class EVETab extends Component {
	
	render () {
		return (
			<div className={"window-content"}>
				{this.props.title}
			</div>
		);
	}

}

EVETab.tabs = {
	EVETab,
	EVECCPWGLTab,
};

export default EVETab;