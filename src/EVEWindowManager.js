import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EVETaskbar from './EVETaskbar';
import EVEDesktop from './EVEDesktop';
import './EVEWindowManager.css';

class EVEWindowManager extends Component {

	constructor (props) {
		super(props);
		this.windex = 0;
		this.zwindex = 10000;
		this.state = {
			windex: 0,
			zwindex: 10000,
			windows: [this.createWindow({ tabs: [this.createTab()] })],
		};
		this.prepareBinds();
		window.wm = this;
	}

	componentDidMount () {
		this.spawnWindow();
	}

	prepareBinds () {
		this.createWindow = this.createWindow.bind(this);
	}

	getChildContext () {
		return {
			getWindowManager: () => this,
		};
	}

	spawnWindow (tab = this.createTab()) {
		this.addWindow({ tabs: [tab] });
	}

	minimize (id, minimized = true) {
		const windows = this.state.windows.map(win => win.id === id ? { ...win, minimized, zwindex: ++this.zwindex } : win);
		this.setState({ windows });
	}

	close (id) {
		const windows = this.state.windows.filter(win => win.id !== id);
		this.setState({ windows });
	}

	focus (id) {
		const windows = this.state.windows.map(win => ({ ...win, focused: win.id === id, zwindex: win.id === id ? ++this.zwindex : win.zwindex }));
		this.setState({ windows });
	}

	updateStyle (id, style) {
		const windows = this.state.windows.map(win => win.id === id ? { ...win, ...style } : win);
		this.setState({ windows });
	}

	loadState (state) {
		this.windex = Math.max(...state.windows.map(win => win.id));
		this.zwindex = Math.max(...state.windows.map(win => win.zwindex));
		this.setState(state);
	}

	createWindow (props = {}) {
		return {
			minimized: false,
			focused: true,
			id: ++this.windex,
			zwindex: ++this.zwindex,
			...props,
		};
	}

	createTab (props = {}) {
		return {
			title: "Test Tab", 
			type: "EVETab", 
			props: {},
			...props,
		};
	}

	addWindow (props) {
		const win = this.createWindow(props);
		const windows = this.state.windows.map(win => ({ ...win, focused: false }));
		this.setState({ windows: [...windows, win] });
	}

	activeTabIndex () {
		const index = this.state.windows.findIndex(win => win.focused === true);
		return index + 1;
	}

	render () {
		return (
			<div className={"window-manager"} style={this.props.style}>
				<EVETaskbar 
					wm={this} 
					windows={this.state.windows} 
					activeTabIndex={this.activeTabIndex()}
				/>
				<EVEDesktop 
					wm={this} 
					windows={this.state.windows}
				/>
			</div>
		);
	}

}

EVEWindowManager.childContextTypes = {
	getWindowManager: PropTypes.func,
};

export default EVEWindowManager;