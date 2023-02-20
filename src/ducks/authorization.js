import Cookies from 'js-cookie';
import API from '../service/apiSingleton';

import _ from 'lodash';
import { resetSelectedNode } from './selected';
import { SubmissionError } from 'redux-form';
const FETCH_LOGIN_START = 'FETCH_LOGIN_START';
const FETCH_LOGIN_SUCCESS = 'FETCH_LOGIN_SUCCESS';
const FETCH_LOGIN_FAILURE = 'FETCH_LOGIN_FAILURE';
const LOG_OUT = 'LOG_OUT';

const initialState = {
	isLoading: true,
	isAuth: false,
	isError: false,
	accessPoint: {
		node: '',
		table: '',
		id: null
	},
	userData: {
		token: '',
		user: {
			role: 'guest'
		}
	},
	errorMessage: ''
};


const authorization = (state = initialState, { type, payload }) => {
	switch (type) {
		case FETCH_LOGIN_START:
			return {
				...state,
				isAuth: false,
				isLoading: true
			};
		case FETCH_LOGIN_SUCCESS:
			let accessPoint = {};
			if (payload.user.merchant_id) {
				accessPoint['table'] = 'merchants';
				accessPoint['id'] = payload.user.merchant_id;
			} else if (payload.user.room_id) {
				accessPoint['table'] = 'rooms';
				accessPoint['id'] = payload.user.room_id;
			} else if (payload.user.terminal_id) {
				accessPoint['table'] = 'terminals';
				accessPoint['id'] = payload.user.terminal_id;
			} else if (payload.user.role_code === 'super_admin') {
				accessPoint['table'] = 'root';
				accessPoint['is_root'] = true;
			}

			return {
				...state,
				isAuth: true,
				isLoading: false,
				userData: payload,
				accessPoint,
				errorMessage: ''
			};
		case FETCH_LOGIN_FAILURE:
			return {
				...state,
				isAuth: false,
				isLoading: false,
				isError: true,
				errorMessage: payload
			};
		case LOG_OUT:
			Cookies.remove('token');
			localStorage.removeItem('token');

			return { 
				...initialState,
				isLoading: false
			 };
		default:
			return state;
	}
};

const requestStart = () => ({
	type: FETCH_LOGIN_START
});

const requestSuccess = userInfo => {
	return {
		type: FETCH_LOGIN_SUCCESS,
		payload: userInfo
	};
};

const requestFailure = error => {
	Cookies.remove('token');
	localStorage.removeItem('token')
	
	return {
		type: FETCH_LOGIN_FAILURE,
		payload: error
	}
};

export const logOut = () => dispatch => {
	Cookies.remove('token');
	localStorage.removeItem('token')

	dispatch(resetSelectedNode());
	
	return dispatch({
		type: LOG_OUT
	});
};

export const checkAuth = (callback) => dispatch => {
	dispatch(requestStart());
	
	API.auth
		.checkAuth()
		.then(response => {
			dispatch(requestSuccess(response.data.data));

			if (callback) {
				callback(response.data.data.user);
			}
		})
		.catch(error => {
			if (error?.response?.status == 401)
				// dispatch({
				// 	type: LOG_OUT
				// });
				
				dispatch(requestFailure());
		});
};

export const loginRequest = data => dispatch => {
	dispatch(requestStart());

	return API.auth
		.logIn(data)
		.then(response => {
			Cookies.set('token', response.data.data.token);
			localStorage.setItem('token', response.data.data.token);

			dispatch(requestSuccess(response.data.data));
		})
		.catch(error => {
			const res = error.response;

			let formData = {};

			if (res.data.errors) {
				_.map(res.data.errors, item => {
					formData[item.fieldName] = item.message;
				});
				throw new SubmissionError(formData);
			} else {
				formData = { _error: res.data.message };
				throw new SubmissionError(formData);
			}
		});
};

export default authorization;
