import Base from './Base.js';

// const pathServer = 'server_events';
// const pathTerminal = 'terminal_events';
const pathTypes = 'logs/types';
const pathLogs = 'logs';
// check
// const pathIntegration = 'terminal_events';

// const pathReq = 'requests';

const limit = process.env.REACT_APP_API_LIMIT || 50;

class Logs extends Base {
	// listServer(params) {
	// 	params.limit = limit;
	// 	return this.apiClient.get(`${pathServer}`, params);
	// }
	listTypes() {
		return this.apiClient.get(`${pathTypes}`);
	}
	listLogs(params = {}, service = '') {
		params.limit = limit;
		return this.apiClient.get(`${pathLogs}/${service}`, params);
	}
	// listIntegration(params) {
	// 	params.limit = limit;
	// 	return this.apiClient.get(`${pathIntegration}`, params);
	// }
	// listServerReq(params) {
	// 	params.limit = limit;
	// 	return this.apiClient.get(`${pathReq}`, params);
	// }
	// listTerminal(params) {
	// 	params.limit = limit;
	// 	return this.apiClient.get(`${pathTerminal}`, params);
	// }
}

export default Logs;
