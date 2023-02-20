import Base from './Base.js';

const path = 'rooms';
const refresh = 'refresh';
const buyers = 'buyers';

class Room extends Base {
	list(params) {
		return this.apiClient.get(`${path}`, params);
	}
	create(body) {
		return this.apiClient.post(`${path}`, body);
	}
	show(id) {
		return this.apiClient.get(`${path}/${id}`);
	}
	refresh(id) {
		return this.apiClient.put(`${path}/${id}/${refresh}`);
	}
	edit(id, body) {
		return this.apiClient.put(`${path}/${id}`, body);
	}
	delete(id) {
		return this.apiClient.delete(`${path}/${id}`);
	}
	buyersList(roomId, filter_is_attached = 'false') {
		return this.apiClient.get(`${path}/${roomId}/${buyers}`, { filter_is_attached: filter_is_attached });
	}
	roomTerminalsList(params) {
		return this.apiClient.get(`${path}/${params.id}/terminals`, params);
	}
}

export default Room;
