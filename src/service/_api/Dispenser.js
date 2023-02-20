import Base from './Base.js';

const path = 'encashments/dispenser';
const limit = process.env.REACT_APP_API_LIMIT || 50;

class Dispenser extends Base {
	list(params) {
		params.limit = limit;
		return this.apiClient.get(`${path}`, params);
	}
	create(body) {
		return this.apiClient.post(`${path}/create`, body);
	}
	getStakedData(id) {
		return this.apiClient.get(`${path}/${id}`, { id: id });
	}
}

export default Dispenser;
