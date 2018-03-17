import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Elevation } from 'rmwc/Elevation';
import { Card } from 'rmwc/Card';
import { Toolbar, ToolbarRow } from 'rmwc/Toolbar';
import './EVEWindow.css';
import EVETabManager from './EVETabManager';
import EVEWindowScalers from './EVEWindowScalers';
import EVEWindowTabs from './EVEWindowTabs';
import EVEWindowButtons from './EVEWindowButtons';

class EVEWindow extends Component {

	constructor (props) {
		super(props);
		this.position = { x: 0, y: 0 };
		this.element = null;
		this.target = null;
		const { activeTabIndex = 0 } = props;
		this.state = {
			activeTabIndex,
		};
		this.prepareBinds();
	}

	prepareBinds () {
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.removeListeners = this.removeListeners.bind(this);
		this.renderTab = this.renderTab.bind(this);
		this.tabChange = this.tabChange.bind(this);
		this.focus = this.focus.bind(this);
		this.minimize = this.minimize.bind(this);
		this.toggleFullscreen = this.toggleFullscreen.bind(this);
		this.close = this.close.bind(this);
		this.closeTab = this.closeTab.bind(this);
	}
	
	componentWillMount () {
		//this.wm = this.context.getWindowManager();
	}

	componentDidMount () {
		//this.triggerResizeEvent();
	}

	componentDidUpdate () {
		this.nativeStyle(this.getStyle(), false);
	}

	getStyle ({ top = 0, left = 0, width = 400, height = 400 } = this.props) {
		return { top, left, width, height };
	}

	onMouseDown (e) {
		if (this.props.maximized || this.props.mobile || (!e.touches && e.button !== 0)) return;
		e.preventDefault();
	  	this.updatePosition(e.touches ? e.touches[0] : e);
	  	this.target = e.currentTarget;
	  	this.attachHandlers();
	}

	attachHandlers () {
	    document.addEventListener("mousemove", this.onMouseMove);
	    document.addEventListener("mouseup", this.removeListeners);
	    document.addEventListener("touchmove", this.onMouseMove);
	    document.addEventListener("touchend", this.removeListeners);
	}

	onMouseMove (e) {
		e.preventDefault();

		const position = this.updatePosition(e.touches ? e.touches[0] : e);
		const list = this.target.classList;

		const style = this.generateStyle(
			this.getStyle(), 
			position, 
			list, 
			this.element
		);

		this.nativeStyle(style);

		if (list.contains("scale-x"))
			this.triggerResizeEvent();
	}

	generateStyle (initial, { x, y }, list, { offsetLeft, offsetTop, clientWidth, clientHeight, parentNode }) {
		const style = { ...initial };

		const invert = list.contains("invert");
		const topRight = list.contains("top-right");
		const bottomLeft = list.contains("bottom-left");

		if (list.contains("move-x"))
			//style.left = Math.max(0, Math.min(parentNode.clientWidth - clientWidth, offsetLeft - x));
			style.left = offsetLeft - x;

		if (list.contains("move-y"))
			//style.top = Math.max(0, Math.min(parentNode.clientHeight - clientHeight, offsetTop - y));
			style.top = offsetTop - y;
		  
		if (list.contains("scale-x"))
			style.width = clientWidth - (invert && !topRight ? -x : x);
		  
		if (list.contains("scale-y"))
			style.height = clientHeight - (invert && !bottomLeft ? -y : y);

		return style;
	}

	triggerResizeEvent () {
		window.dispatchEvent(new Event("resize"));
	}

	calculateDifference ({ x, y }, { clientX, clientY }) {
		return { x: x - clientX, y: y - clientY };
	}
  
	updatePosition ({ clientX, clientY }) {
		const difference = this.calculateDifference(this.position, { clientX, clientY });
		this.position = { x: clientX, y: clientY };
		return difference;
	}

	removeListeners () {
		document.removeEventListener("mousemove", this.onMouseMove);
		document.removeEventListener("mouseup", this.removeListeners);
		document.removeEventListener("touchmove", this.onMouseMove);
		document.removeEventListener("touchend", this.removeListeners);
		this.target = null;
	}

	minimize () {
		this.props.wm.minimize(this.props.id);
	}

	toggleFullscreen () {
		this.element.style.transition = "all 0.3s";
		this.props.wm.toggleFullscreen(this.props.id, !this.props.maximized);
		setTimeout(() => {
			this.element.style.transition = "";
			this.triggerResizeEvent();
		}, 0.3 * 1000);
	}

	close () {
		this.props.wm.close(this.props.id);
	}

	closeTab (index) {
		const tabs = this.props.tabs.filter((tab, i) => i !== index);
		if (!tabs.length) {
			this.close();
		} else {
			this.props.wm.updateWindowState(
				this.props.id,
				{ 
					activeTabIndex: 0,
					tabs,
				}
			);
		}
	}

	focus (e) {
		if (e.target.classList.contains("close"))
			return;
		this.props.wm.focus(this.props.id);
	}

	nativeStyle (style, update = true) {
		Object.entries(style).forEach(([k, v]) => this.element.style[k] = `${v}px`);
		if (update)
			this.props.wm.updateWindowState(
				this.props.id, 
				style
			);
	}

	setElement (element) {
		if (element === null || this.element) return;
		this.element = element;
		this.nativeStyle(this.getStyle());
	}

	tabChange (activeTabIndex) {
		this.setState({ activeTabIndex });
		this.props.wm.updateWindowState(
			this.props.id, 
			{ activeTabIndex }
		);
	}

	renderTab ({ title, type, props }, i) {
		const CustomTab = EVETabManager.get(type);
		return (
			<CustomTab 
				style={{ display: this.state.activeTabIndex === i ? "block" : "none" }}
				title={title} 
				key={i} 
				{...props}
			/>
		);
	}

	render () {
		return (
			<Elevation 
				ref={(element) => this.setElement(ReactDOM.findDOMNode(element))}
				className={"window" + (this.props.maximized ? " maximized" : "")}
				transition
				z={this.props.focused ? 10 : 5}
				style={{ 
					display: this.props.minimized === true ? "none" : "block",
					zIndex: this.props.zwindex,
					overflow: this.props.maximized ? "hidden" : "initial",
				}}
				onMouseDown={this.focus}
			>
				<EVEWindowScalers handleMouseDown={this.onMouseDown}/>
				<Card style={{ borderRadius: 0 }}>
					<Toolbar
						className={"move-x move-y"}
						onMouseDown={this.onMouseDown}
					>
						<ToolbarRow>
							<EVEWindowTabs 
								activeTabIndex={this.state.activeTabIndex} 
								tabs={this.props.tabs} 
								tabChange={this.tabChange}
								close={this.closeTab}
							/>
							<EVEWindowButtons 
								mobile={this.props.mobile}
								minimize={this.minimize} 
								toggleFullscreen={this.toggleFullscreen} 
								close={this.close}
							 />
						</ToolbarRow>
					</Toolbar>
					<div className={"window-content"}>
						{this.props.tabs.map(this.renderTab)}
					</div>
				</Card>
			</Elevation>
		);
	}
}

EVEWindow.contextTypes = {
	getWindowManager: PropTypes.func,
};

export default EVEWindow;