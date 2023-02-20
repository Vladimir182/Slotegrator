import Base from './Base.js';

const path = 'merchants';

class Merchant extends Base {
	list(params) {
		return this.apiClient.get(`${path}`, params);
	}

	create(body) {
		return this.apiClient.post(`${path}`, body);
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

	merchantRoomsList(params) {
		return this.apiClient.get(`${path}/${params.id}/rooms`, params);
	}
}

export default Merchant;
