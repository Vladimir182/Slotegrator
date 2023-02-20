import Base from './Base.js';

const path = 'users';
class User extends Base {

	list(params) {
		return this.apiClient.get(`${path}`, params);
	}
	
	roomUsersList(roomId) {
		return this.apiClient.get(`${path}/room/${roomId}`);
	}

	merchantUsersList(merchantId) {
		return this.apiClient.get(`${path}/merchant/${merchantId}`);
	}

	terminalUserslist(terminalId) {
		return this.apiClient.get(`${path}/terminal/${terminalId}`);
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
}

export default User;
