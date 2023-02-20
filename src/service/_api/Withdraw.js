import Base from './Base.js';
const path = 'withdraws';
const limit = process.env.REACT_APP_API_LIMIT || 50;

class Withdraw extends Base {
	list(params) {
		params.limit = limit;
		return this.apiClient.get(`${path}`, params);
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
	CashOut(id) {
		return this.apiClient.put(`${path}/cash_out/${id}`);

	}
	delete(id) {
		return this.apiClient.delete(`news/${id}`);
	}
}

export default Withdraw;
