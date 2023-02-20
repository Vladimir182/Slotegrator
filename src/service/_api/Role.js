import Base from './Base.js';

const path = 'permissions/roles';
const pathResources = 'permissions/resources';
class Role extends Base {
	list(params) {
		return this.apiClient.get(`${path}`, params);
	}
	resources() {
		return this.apiClient.get(`${pathResources}`);
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

export default Role;
