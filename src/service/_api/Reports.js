import Base from './Base.js';
const path = 'reports';

class Reports extends Base {
	list(params, table, id) {
		if (table) {
			return this.apiClient.get(`${table}/${id}/${path}`, params);
		} else {
			return this.apiClient.get(`${path}`, params);
		}
	}

	create(body) {
		return this.apiClient.post('news', body);
	}

	show(id) {
		return this.apiClient.get(`news/${id}`);
	}

	edit(id, body) {
		return this.apiClient.put(`${path}/${id}`, body);
	}

	delete(id) {
		return this.apiClient.delete(`news/${id}`);
	}
}

export default Reports;
