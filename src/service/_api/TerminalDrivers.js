import Base from './Base.js';
const path = 'driver_versions';
const limit = process.env.REACT_APP_API_LIMIT || 50;

class TerminalDrivers extends Base {
	list(params) {
		return this.apiClient.get(`${path}`);
	}

	create(body) {
		return this.apiClient.post(`${path}`, body);
	}

	edit(id, body) {
		return this.apiClient.put(`${path}/${id}`, body);
	}

	delete(id) {
		return this.apiClient.delete(`${path}/${id}`);
	}
}

export default TerminalDrivers;
