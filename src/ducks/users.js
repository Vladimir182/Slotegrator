import _ from 'lodash';
import API from '../service/apiSingleton';
import { enqueueSnackbar } from './notification';
import { SubmissionError } from 'redux-form';

const REQUEST_GET_USERS = 'REQUEST_GET_USERS';
const REQUEST_EDIT_USER = 'REQUEST_EDIT_USER';
const REQUEST_REMOVE_USER = 'REQUEST_REMOVE_USER';
const REQUEST_NEW_USER = 'REQUEST_NEW_USER';
const LOG_OUT = 'LOG_OUT';
const REQUEST_USERS_START = 'REQUEST_USERS_START';
const REQUEST_GET_USERS_START = 'REQUEST_GET_USERS_START';
const REQUEST_ADD_USERS_START = 'REQUEST_ADD_USERS_START';


const REQUEST_USERS_ERROR = 'REQUEST_USERS_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';


const initialState = {
	data: [],
	countPage: 1,
	loading: false,
	error: {
		isError: false,
		message: ''
	}
};

const users = (state = initialState, { type, payload }) => {
	switch (type) {
		case REQUEST_GET_USERS_START: {
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_USERS_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_ADD_USERS_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_GET_USERS:
			return {
				...state,
				data: payload.data.data,
				countPage: payload.data.count,
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_NEW_USER: {
			let newUsers = [...state.data];
			newUsers.push(payload.data);
			return {
				...state,
				data: _.uniq(newUsers),
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_REMOVE_USER: {
			const newList = _.filter(state.data, item => payload.data.id !== item.id);
			return {
				...state,
				data: newList,
				countPage: state.countPage - 1,
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_EDIT_USER: {
			const newList = _.filter(
				state.data,
				item => !_.isEqual(payload.data.id, item.id)
			);
			newList.push(payload.data);
			return {
				...state,
				data: newList,
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case CLEAR_ERROR: {
			return {
				...state,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_USERS_ERROR:
			return {
				...state,
				loading: false,
				error: { isError: true, message: payload }
			};

		case LOG_OUT:
			return initialState;



		default:
			return state;
	}
};

export const fetchGetUsers = params => async dispatch => {
	dispatch({ type: REQUEST_GET_USERS_START });

	API.user
	.list(params)
	.then(data => {
		dispatch({
			type: REQUEST_GET_USERS,
			payload: data.data
		});
	})
	.catch(error => {
		dispatch({
			type: REQUEST_USERS_ERROR,
			payload: error.message
		});
	});
};

export const fetchGetMerchantUsers = merchantId => async dispatch => {
	dispatch({ type: REQUEST_GET_USERS_START });

	API.user
	.merchantUsersList(merchantId)
	.then(data => {
		dispatch({
			type: REQUEST_GET_USERS,
			payload: data.data
		});
	})
	.catch(error => {
		dispatch({
			type: REQUEST_USERS_ERROR,
			payload: error.message
		});
	});
};

export const fetchGetRoomUsers = roomId => async dispatch => {
	dispatch({ type: REQUEST_GET_USERS_START });

	API.user
	.roomUsersList(roomId)
	.then(data => {
		dispatch({
			type: REQUEST_GET_USERS,
			payload: data.data
		});
	})
	.catch(error => {
		dispatch({
			type: REQUEST_USERS_ERROR,
			payload: error.message
		});
	});
};

export const fetchGetTerminalUsers = terminalId => async dispatch => {
	dispatch({ type: REQUEST_GET_USERS_START });
	API.user
	.terminalUserslist(terminalId)
	.then(data => {
		dispatch({
			type: REQUEST_GET_USERS,
			payload: data.data
		});
	})
	.catch(error => {
		dispatch({
			type: REQUEST_USERS_ERROR,
			payload: error.message
		});
	});
};

export const fetchNewUsers = (params, toggle) => async dispatch => {
	dispatch({ type: REQUEST_ADD_USERS_START });

	return API.user
		.create(params)
		.then(data => {
			dispatch({
				type: REQUEST_NEW_USER,
				payload: data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'User created!',
					options: {
						variant: 'success'
					}
				})
			);
			toggle();
		})
		.catch(error => {
			if (error instanceof SubmissionError) {
				dispatch({
					type: REQUEST_USERS_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_USERS_ERROR,
					payload: error.response.data.message
				});
			}
		});
};

export const fetchRemoveUsers = (id) => async dispatch => {
	dispatch({ type: REQUEST_USERS_START });

	API.user
		.delete(id)
		.then(data => {
			dispatch({
				type: REQUEST_REMOVE_USER,
				payload: data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'User removed!',
					options: {
						variant: 'success'
					}
				})
			);
		})
		.catch(error => {
			dispatch({
				type: REQUEST_USERS_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchEditUser = (id, params, toggle) => async dispatch => {
	dispatch({ type: REQUEST_USERS_START });

	return API.user
		.edit(id, params)
		.then(data => {
			dispatch({
				type: REQUEST_EDIT_USER,
				payload: data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'User updated!',
					options: {
						variant: 'success'
					}
				})
			);
			toggle();
		})
		.catch(error => {
			if (error instanceof SubmissionError) {
				dispatch({
					type: REQUEST_USERS_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_USERS_ERROR,
					payload: error.response.data.message
				});
			}
		});
};
export const fetchClearError = () => async dispatch => {
	dispatch({ type: CLEAR_ERROR });
};







export default users;
