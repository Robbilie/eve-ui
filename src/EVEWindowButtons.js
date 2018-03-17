import React, { Component } from 'react';
import { Ripple } from 'rmwc/Ripple';
import { ToolbarSection, ToolbarIcon } from 'rmwc/Toolbar';

class EVEWindowButtons extends Component {
	
	render () {
		return (
			<ToolbarSection alignEnd shrinkToFit>
				<Ripple unbounded>
					<ToolbarIcon onClick={this.props.minimize} use="remove"/>
				</Ripple>
				<Ripple unbounded>
					<ToolbarIcon onClick={this.props.toggleMax} use="fullscreen"/>
				</Ripple>
				<Ripple unbounded>
					<ToolbarIcon onClick={this.props.close} use="close" className={"close"}/>
				</Ripple>
			</ToolbarSection>
		);
	}

}

export default EVEWindowButtons;