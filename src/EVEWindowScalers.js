import React, { Component } from 'react';

class EVEWindowScalers extends Component {

	constructor (props) {
		super(props);
		this.state = {
			scalers: [
				["scale-y", "move-y", "invert", "vertical", "top"],
				["scale-x", "horizontal", "right"],
				["scale-y", "vertical", "bottom"],
				["scale-x", "move-x", "invert", "horizontal", "left"],
				["scale-x", "scale-y", "move-x", "move-y", "invert", "bidirectional", "top-left"],
				["scale-x", "scale-y", "bidirectional", "bottom-right"],
				["scale-x", "scale-y", "move-y", "invert", "bidirectional", "top-right"],
				["scale-x", "scale-y", "move-x", "invert", "bidirectional", "bottom-left"],
			]
		};
		this.prepareBinds();
	}

	prepareBinds () {
		this.renderScaler = this.renderScaler.bind(this);
	}

	renderScaler (scaler, i) {
		return (
			<div 
				key={i} 
				onMouseDown={this.props.handleMouseDown} 
				className={["resize", ...scaler].join(" ")}
			></div>
		);
	}
	
	render () {
		return this.state.scalers.map(this.renderScaler);
	}

}

export default EVEWindowScalers;