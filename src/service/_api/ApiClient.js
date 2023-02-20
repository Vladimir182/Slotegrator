import queryString from 'query-string';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { store } from '../../App';
import { SubmissionError } from 'redux-form';
import _ from 'lodash';

export default class ApiClient {
	constructor({ prefix = '/api/v1' } = {}) {
		this.prefix = prefix;
		this.token = '';
	}

	async get(url, params) {
		return this.request({
			url,
			params,
			method: 'GET'
		});
	}

	async post(url, payload = {}) {
		return this.request({
			url,
			method: 'POST',
			body: payload
		});
	}

	async put(url, payload = {}) {
		return this.request({
			url,
			method: 'PUT',
			body: payload
		});
	}

	async patch(url, payload = {}) {
		return this.request({
			url,
			method: 'PATCH',
			body: payload
		});
	}

	async delete(url, payload = {}) {
		return this.request({
			url,
			method: 'DELETE',
			body: payload
		});
	}

	handleResponse(res) {
		return res
			.then(res => {
				// if (process.env.NODE_ENV === 'development')
				return res;
			})
			.catch(error => {
				const response = error.response;

				if (response.status !== 401) {
					store.dispatch({
						type: 'REMOVE_SNACKBAR',
					});

					store.dispatch({
						type: 'ENQUEUE_SNACKBAR',
						notification: {
							key: new Date().getTime() + Math.random(),
							message:
								response.data.error ||
								response.data.message ||
								'Request error',
							options: {
								variant: 'error'
							}
						}
					});
				}

				if (response.status === 401) {
					store.dispatch({
						type: 'LOG_OUT'
					});
				}

				if (response.status === 400) {
					let formData = {};

					if (response.data.errors) {
						_.map(response.data.errors, item => {
							formData[item.fieldName] = item.message;
						});
						throw new SubmissionError(formData);
					} else {
						formData = { _error: response.data.message };
						throw new SubmissionError(formData);
					}
				}

				throw error;
			});
	}
	
	async request({ url, method, params = {}, body }) {

		const query = Object.keys(params).length
			? `?${queryString.stringify(params)}`
			: '';

		const res = Axios({
			method: method,
			// ${process.env.REACT_APP_API_URL}
			url: `${this.prefix}${url}${query}`,
			data: method !== 'GET' ? body : undefined,
			headers: {
				// Authorization: 'TRM ' + Cookies.get('token')
				Authorization: 'TRM ' + localStorage.getItem('token')
			},
			// timeout: 2
		});
		
		return this.handleResponse(res);
	}
}
