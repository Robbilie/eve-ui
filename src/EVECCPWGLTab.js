import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ccpwgl_int from 'ccpwgl/dist/ccpwgl_int';
import ccpwgl from './ccpwgl';

class EVECCPWGLTab extends Component {

	setCanvas (canvas) {
		if (canvas === null || this.canvas) return;
		this.canvas = canvas;
		const wgl = ccpwgl(ccpwgl_int());
		console.log(wgl);
		wgl.initialize(canvas);
		wgl.enablePostprocessing(true);
		const camera = wgl.createCamera(canvas, { distance: 100 }, true);
		const scene = wgl.loadScene('res:/dx9/scene/universe/m10_cube.red');
        scene.loadShip('ab1_t1:amarrbase:amarr', function(){ camera.focus(this, 4)});
        scene.loadSun('res:/fisfx/lensflare/orange_sun.red');
        scene.setSunDirection([1, 0, 0.7]);
	}
	
	render () {
		return (
			<div className={"tab-eveccpwgl"}>
				<canvas ref={(element) => this.setCanvas(ReactDOM.findDOMNode(element))}></canvas>
			</div>
		);
	}

}

export default EVECCPWGLTab;