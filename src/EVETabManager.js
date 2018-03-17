import EVETab from './EVETab';
import EVECCPWGLTab from './EVECCPWGLTab';

const TABS = {
	EVETab,
	EVECCPWGLTab,
};

class EVETabManager  {

	static get (name) {
		return TABS[name];
	}

}

export default EVETabManager;