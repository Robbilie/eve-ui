import React, { Component } from 'react';
import EVEWindow from './EVEWindow';

class EVEDesktop extends Component {

	constructor (props) {
		super(props);
		this.prepareBinds();
	}

	prepareBinds () {
		this.renderWindow = this.renderWindow.bind(this);
	}

	renderWindow ({ id, ...rest }, i) {
		return (
			<EVEWindow wm={this.props.wm} key={id} id={id} {...rest} />
		);
	}
	
	render () {
		return (
			<div className={"desktop"}>
				{this.props.windows.map(this.renderWindow)}
			</div>
		);
	}

}

export default EVEDesktop;