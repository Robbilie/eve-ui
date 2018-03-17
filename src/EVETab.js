import React, { Component } from 'react';

class EVETab extends Component {
	
	render () {
		return (
			<div className={"window-content"}>
				{this.props.title}
			</div>
		);
	}

}

export default EVETab;