import Base from './Base.js';
const path = 'profile';

class Auth extends Base {
	logIn(body) {
		return this.apiClient.post(`${path}/login`, body);
	}

	logOut(body) {
		return this.apiClient.post(`${path}/logout`);
	}

	checkAuth() {
		return this.apiClient.get(`${path}`);
	}
}

export default Auth;
