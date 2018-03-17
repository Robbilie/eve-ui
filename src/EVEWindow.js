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
		const { top = 0, left = 0, width = 400, height = 400, activeTabIndex = 0 } = props;
		this.position = { x: 0, y: 0 };
		this.element = null;
		this.target = null;
		this.state = {
			activeTabIndex,
			style: {
				top,
				left,
				width,
				height,
			},
			backup: null,
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
		this.toggleMax = this.toggleMax.bind(this);
		this.close = this.close.bind(this);
		this.closeTab = this.closeTab.bind(this);
	}
	
	componentWillMount () {
		//this.wm = this.context.getWindowManager();
	}

	componentDidUpdate () {
		const { top = 0, left = 0, width = 400, height = 400 } = this.props;
		this.nativeStyle({
			top,
			left,
			width,
			height,
		}, false);
	}

	onMouseDown (e) {
		e.preventDefault();
	  	const { clientX, clientY } = e.touches ? e.touches[0] : e;
	  	this.updatePosition(clientX, clientY);
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
		const { clientX, clientY } = e.touches ? e.touches[0] : e;
		const list = this.target.classList;

		const { x, y } = this.updatePosition(clientX, clientY);

		const invert = list.contains("invert");
		const topRight = list.contains("top-right");
		const bottomLeft = list.contains("bottom-left");

		const style = { ...this.state.style };

		if (list.contains("move-x"))
			style.left = this.element.offsetLeft - x;

		if (list.contains("move-y"))
			style.top = this.element.offsetTop - y;
		  
		if (list.contains("scale-x"))
			style.width = this.element.clientWidth - (invert && !topRight ? -x : x);
		  
		if (list.contains("scale-y"))
			style.height = this.element.clientHeight - (invert && !bottomLeft ? -y : y);

		this.nativeStyle(style);
		this.setState({ style });

		if (list.contains("scale-x"))
			this.triggerResizeEvent();
	}

	triggerResizeEvent () {
		window.dispatchEvent(new Event("resize"));
	}

	calculateDifference (newX, newY) {
		const { x, y } = this.position;
		return { x: x - newX, y: y - newY };
	}
  
	updatePosition (newX, newY) {
		const difference = this.calculateDifference(newX, newY);
		this.position = { x: newX, y: newY };
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

	toggleMax () {
		this.element.style.transition = "all 0.3s";
		if (this.state.backup) {
			this.toggleMaxRestore();
		} else {
			this.toggleMaxFullscreen();
		}
		setTimeout(() => {
			this.element.style.transition = "";
			this.triggerResizeEvent();
		}, 0.3 * 1000);
	}

	toggleMaxRestore () {
		this.nativeStyle(this.state.backup);
		this.setState({ backup: null, style: this.state.backup });
	}

	toggleMaxFullscreen () {
		const state = {
			style: {
				top: 0,
				left: 0,
				width: this.element.parentNode.clientWidth,
				height: this.element.parentNode.clientHeight,
			},
			backup: this.state.style,
		};
		this.nativeStyle(state.style);
		this.setState(state);
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
		this.nativeStyle(this.state.style);
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
				className={"window"}
				transition
				z={this.props.focused ? 10 : 5}
				style={{ 
					display: this.props.minimized === true ? "none" : "block",
					zIndex: this.props.zwindex,
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
							<EVEWindowButtons minimize={this.minimize} toggleMax={this.toggleMax} close={this.close} />
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