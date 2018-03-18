import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Elevation } from 'rmwc/Elevation';
import { Card } from 'rmwc/Card';
import { Toolbar, ToolbarRow } from 'rmwc/Toolbar';
import EVEWindowScalers from './EVEWindowScalers';
import EVEWindowTabs from './EVEWindowTabs';
import EVEWindowButtons from './EVEWindowButtons';

class EVEWindowWrapper extends Component {

	getClassName () {
		return ["minimized", "maximized", "focused"].reduce((arr, k) => arr.concat(this.props[k] ? [k] : null), ["window"])
	}
	
	render () {
		return (
			<Elevation 
				ref={(element) => this.props.setElement(ReactDOM.findDOMNode(element))}
				className={this.getClassName()}
				transition
				z={this.props.focused ? 10 : 5}
				style={{ 
					display: this.props.minimized === true ? "none" : "block",
					zIndex: this.props.zwindex,
					overflow: this.props.maximized ? "hidden" : "initial",
				}}
				onMouseDown={this.props.focus}
				onTouchStart={this.props.focus}
			>
				<EVEWindowScalers handleMouseDown={this.props.handleMouseDown}/>
				<Card style={{ borderRadius: 0 }}>
					<Toolbar
						className={"move-x move-y"}
						onMouseDown={this.props.handleMouseDown}
						onTouchStart={this.props.handleMouseDown}
					>
						<ToolbarRow>
							<EVEWindowTabs 
								activeTabIndex={this.props.activeTabIndex} 
								tabs={this.props.tabs} 
								tabChange={this.props.tabChange}
								close={this.props.closeTab}
							/>
							<EVEWindowButtons 
								mobile={this.props.mobile}
								minimize={this.props.minimize} 
								toggleFullscreen={this.props.toggleFullscreen} 
								close={this.props.close}
							 />
						</ToolbarRow>
					</Toolbar>
					<div className={"window-content"}>
						{this.props.children}
					</div>
				</Card>
			</Elevation>
		);
	}

}

export default EVEWindowWrapper;