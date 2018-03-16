import React, { Component } from 'react';
import { Tab, TabIcon, TabBar, TabBarScroller } from 'rmwc/Tabs';
import { Icon } from 'rmwc/Icon';

class EVETaskbar extends Component {

	constructor (props) {
		super(props);
		this.prepareBinds();
	}

	prepareBinds () {
		this.renderTab = this.renderTab.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange (e) {
	}

	handleClick (id, minimized, focused) {
		if (minimized) {
			this.props.wm.minimize(id, !minimized);
		} else {
			if (focused) {
				this.props.wm.minimize(id);
			} else {
				this.props.wm.focus(id);
			}
		}
	}

	renderTab ({ id, minimized, focused, tabs }) {
		return (
			<Tab
				key={id}
				onClick={() => this.handleClick(id, minimized, focused)}
				style={{ backgroundColor: minimized ? "red" : "transparent" }}
			>
				{tabs[0].title}
			</Tab>
		);
	}

	renderRestoreButton ({ id, tabs }, i) {
		return (
			<button key={i} onClick={() => this.minimize(id, false)}>
				{tabs[0].title}
			</button>
		);
	}
	
	render () {
		return (
			<TabBarScroller 
				className={"taskbar"}
				indicatorBack={<Icon use="chevron_left"/>} 
				indicatorForward={<Icon use="chevron_right"/>}
			>
				<TabBar
					style={{ margin: 0 }}
					onChange={this.handleChange}
					activeTabIndex={this.props.activeTabIndex}
				>
					<Tab onClick={() => this.props.wm.spawnWindow()}><TabIcon>home</TabIcon></Tab>
					{this.props.windows.map(this.renderTab)}
					<Tab style={{ display: "none" }}></Tab>
				</TabBar>
			</TabBarScroller>
		);
	}

}

export default EVETaskbar;