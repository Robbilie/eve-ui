import React, { Component } from 'react';
import { ToolbarSection } from 'rmwc/Toolbar';
import { Tab, TabBar, TabBarScroller } from 'rmwc/Tabs';
import { Icon } from 'rmwc/Icon';

class EVEWindowTabs extends Component {

	constructor (props) {
		super(props);
		this.prepareBinds();
	}

	prepareBinds () {
		this.renderTab = this.renderTab.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange (e) {
		this.props.tabChange(e.target.value - 1);
	}

	renderTab (tab, i) {
		return (
			<Tab key={i}>
				{tab.title}
				{this.props.tabs.length === 1 ? null : <Icon onClick={() => this.props.close(i)} className={"window-tab-close"}>close</Icon>}
			</Tab>
		);
	}
	
	render () {
		return (
			<ToolbarSection alignStart>
				<TabBarScroller 
					indicatorBack={<Icon use="chevron_left"/>} 
					indicatorForward={<Icon use="chevron_right"/>}
				>
					<TabBar
						style={{ margin: 0 }}
						activeTabIndex={this.props.activeTabIndex + 1}
						onChange={this.handleChange}
					>
						<Tab style={{ display: "none" }}></Tab>
						{this.props.tabs.map(this.renderTab)}
						<Tab style={{ display: "none" }}></Tab>
					</TabBar>
				</TabBarScroller>
			</ToolbarSection>
		);
	}

}

export default EVEWindowTabs;