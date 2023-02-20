import Base from './Base.js';
const path = 'integration';

class Integration extends Base {
	testDispenser(params) {
		return this.apiClient.get(`${path}/encashment/dispenser`, params);
	}
}

export default Integration;
