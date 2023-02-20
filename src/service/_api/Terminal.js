import Base from './Base.js';

const path = 'terminals';
const pathCreate = 'clients';
const limit = process.env.REACT_APP_API_LIMIT || 50;
class Terminal extends Base {
	list(params) {
		return this.apiClient.get(`${path}`, params);
	}

	create(body) {
		return this.apiClient.post(`${pathCreate}`, body);
	}

	show(id) {
		return this.apiClient.get(`${path}/${id}`);
	}
	settings(id) {
		return this.apiClient.get(`${path}/${id}/settings`);
	}
	saveSettings(id, body) {
		return this.apiClient.put(`${path}/${id}/settings/save`, body)
	}
	applySettings(id) {
		return this.apiClient.put(`${path}/${id}/settings/apply`);
	}
	//Change [POST] -> [GET]
	systemInfo(id) {
		return this.apiClient.get(`${path}/${id}/system_info`);
	}

	validatorInfo(id) {
		return this.apiClient.get(`${path}/${id}/validator/info`);
	}
	terminalState(params = {}) {
		params.limit = limit;
		return this.apiClient.get(`${path}/state`, params);
	}
	terminalsStateAll(params = {}) {
		params.limit = limit;
		return this.apiClient.get(`${path}/state/all`, params);
	}
	terminalStateById(id) {
		return this.apiClient.get(`${path}/${id}/state`);
	}
	on(id) {
		return this.apiClient.put(`${path}/${id}/state/on`);
	}
	off(id) {
		return this.apiClient.put(`${path}/${id}/state/off`);
	}
	displayOn(id) {
		return this.apiClient.put(`${path}/${id}/display/on`);
	}

	displayOff(id) {
		return this.apiClient.put(`${path}/${id}/display/off`);
	}
	deviceFix(id, device) {
		if (device === 'validator' || device === 'printer' || device === "dispenser")
			return this.apiClient.put(`${path}/${id}/fix_error`, { device, id });
	}
	printerStatus(id) {
		return this.apiClient.get(`${path}/${id}/printer/status`);
	}

	printerCheck(id, params) {
		return this.apiClient.post(`${path}/${id}/printer/check`, {
			params
		});
	}
	validatorCommand(id, command) {
		return this.apiClient.put(`${path}/${id}/${command}`);
	}

	validatorProtocol(id) {
		return this.apiClient.get(`${path}/${id}/validator/protocol`);
	}
	
	validatorStatus(id) {
		return this.apiClient.get(`${path}/${id}/validator/status`);
	}

	//Change end
	saveSetting(id, body) {
		return this.apiClient.post(`${path}/${id}/settings/save`, body);
	}

	askForDispense(id, params) {
		return this.apiClient.get(`${path}/${id}/dispenser/ask_for_dispense`, params)
	}
	dispenseData(id, params) {
		return this.apiClient.put(`${path}/${id}/dispenser/dispense`, params)
	}
	dispensePurgeData(id, params) {
		return this.apiClient.put(`${path}/${id}/dispenser/purge`, params)
	}
	dispenserTestData(id, params) {
		return this.apiClient.put(`${path}/${id}/dispenser/test`, params)
	}
	dispenserInfo(id, params) {
		return this.apiClient.get(`${path}/${id}/dispenser/get_info`, params)
	}
	dispenserStatus(id, params) {
		return this.apiClient.get(`${path}/${id}/dispenser/get_status`, params)
	}
	upRemoteTunnel(id, params){
		return this.apiClient.post(`${path}/${id}/up_remote_tunnel`,params)
	}
	downRemoteTunnel(id, params) {
		return this.apiClient.delete(`${path}/${id}/down_remote_tunnel`,params)
	}
	reset(id) {
		return this.apiClient.post(`${path}/${id}/settings/reset`);
	}
	edit(id, body) {
		return this.apiClient.put(`${path}/${id}`, body);
	}
	delete(id) {
		return this.apiClient.delete(`${path}/${id}`);
	}
}

export default Terminal;
