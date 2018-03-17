import React, { Component } from 'react';
import { ToolbarSection } from 'rmwc/Toolbar';
import { Tab, TabBar, TabBarScroller } from 'rmwc/Tabs';
import { Icon } from 'rmwc/Icon';

class EVEWindowTabs extends Component {
	
	render () {
		return (
			<ToolbarSection alignStart>
				<TabBarScroller 
					indicatorBack={<Icon use="chevron_left"/>} 
					indicatorForward={<Icon use="chevron_right"/>}
				>
					<TabBar
						style={{ margin: 0 }}
						activeTabIndex={this.props.activeTabIndex}
						onChange={this.props.handleChange}
					>
						{this.props.tabs.map((tab, i) => <Tab key={i}>{tab.title}</Tab>)}
					</TabBar>
				</TabBarScroller>
			</ToolbarSection>
		);
	}

}

export default EVEWindowTabs;