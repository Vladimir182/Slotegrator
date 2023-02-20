import Base from './Base.js';

const path = 'encashments/validator';
const limit = process.env.REACT_APP_API_LIMIT || 50;

class Validator extends Base {
	list(params) {
		params.limit = limit;
		return this.apiClient.get(`${path}`, params);
	}
	immediate(body) {
		return this.apiClient.post(`${path}/immediate`, body);
	}
	daily(body) {
		return this.apiClient.post(`${path}/daily`, body);
	}
	show(id) {
		return this.apiClient.get(`${path}/${id}`);
	}

	edit(id, body) {
		return this.apiClient.put(`${path}/${id}`, body);
	}

	delete(id) {
		return this.apiClient.delete(`${path}/${id}`);
	}
	forceEncashment(id) {
		return this.apiClient.get(`${path}/daily/${id}/force`);
	}
}

export default Validator;
