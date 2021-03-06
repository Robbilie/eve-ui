import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EVETaskbar from './EVETaskbar';
import EVEDesktop from './EVEDesktop';
import './EVEWindowManager.css';

class EVEWindowManager extends Component {

	constructor (props) {
		super(props);
		this.state = this.loadState(
			JSON.parse(localStorage.getItem(`${this.props.id}-state`)) || { windows: [] },
			true
		);
		this.prepareBinds();
		window.wm = this;
		window.addEventListener("beforeunload", this.onBeforeUnload);
	}

	onBeforeUnload () {
		localStorage.setItem(`${this.props.id}-state`, JSON.stringify(this.state))
	}

	componentDidMount () {

	}

	prepareBinds () {
		this.createWindow = this.createWindow.bind(this);
		this.onBeforeUnload = this.onBeforeUnload.bind(this);
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
		this.updateWindowState(
			id,
			{
				minimized,
				focused: !minimized,
				zwindex: ++this.zwindex,
			}
		);
	}

	toggleFullscreen (id, maximized = true) {
		this.updateWindowState(
			id,
			{
				maximized
			}
		);
	}

	focus (id) {
		this.updateWindowState(
			id,
			{
				focused: true,
				zwindex: ++this.zwindex,
			}
		);
	}

	close (id) {
		const windows = this.state.windows.filter(win => win.id !== id);
		this.setState({ windows });
	}

	updateWindowState (id, state) {
		const windows = this.state.windows.map(win => Object.assign(
			{}, 
			win,
			win.id === id ? state : {},
			{ focused: state.focused !== undefined ? (win.id === id ? state.focused : false) : win.focused },
		));
		this.setState({ windows });
	}

	loadState (state, constructor = false) {
		this.windex = state.windows.length ? Math.max(...state.windows.map(win => win.id)) : 0;
		this.zwindex = state.windows.length ? Math.max(...state.windows.map(win => win.zwindex)) : 10000;
		if (constructor === false)
			this.setState(state);
		else
			return state;
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
		const windows = this.state.windows.map(win => ({ 
			...win, 
			focused: false 
		}));
		this.setState({ windows: [...windows, win] });
	}

	activeTabIndex () {
		return this.state.windows.findIndex(win => win.focused === true);
	}

	isAnyMaximized () {
		return this.state.windows.some(({ maximized, minimized }) => (maximized || this.props.mobile) && !minimized);
	}

	render () {
		return (
			<div className={"window-manager"} style={this.props.style}>
				<EVETaskbar 
					wm={this} 
					mobile={this.props.mobile}
					windows={this.state.windows} 
					activeTabIndex={this.activeTabIndex()}
					className={this.isAnyMaximized() ? "maximized" : ""}
				/>
				<EVEDesktop 
					wm={this} 
					mobile={this.props.mobile}
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