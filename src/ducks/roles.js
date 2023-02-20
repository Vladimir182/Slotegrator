import API from '../service/apiSingleton';
import _ from 'lodash';

import { enqueueSnackbar } from './notification';
import { SubmissionError } from 'redux-form';

const REQUEST_ROLES_START = 'REQUEST_ROLES_START';
const REQUEST_GET_ROLES_SUCCESS = 'REQUEST_GET_ROLES_SUCCESS';
const REQUEST_REMOVE_ROLES_SUCCESS = 'REQUEST_REMOVE_ROLES_SUCCESS';
const REQUEST_ROLES_ERROR = 'REQUEST_ROLES_ERROR';
// const REQUEST_EDIT_ROLES = 'REQUEST_EDIT_ROLES';

const REQUEST_GET_PERMISSIONS_START = 'REQUEST_GET_PERMISSIONS_START';
const REQUEST_GET_PERMISSIONS_SUCCESS = 'REQUEST_GET_PERMISSIONS_SUCCESS';
const REQUEST_GET_PERMISSIONS_ERROR = 'REQUEST_GET_PERMISSIONS_ERROR';
const CURRENT_ROLE_UPDATE = 'CURRENT_ROLE_UPDATE';

const REQUEST_SET_ROLES_START = 'REQUEST_SET_ROLES_START';
const REQUEST_SET_ROLES_SUCCESS = 'REQUEST_SET_ROLES_SUCCESS';
const REQUEST_SET_ROLES_ERROR = 'REQUEST_SET_ROLES_ERROR';

const REQUEST_GET_RESOURCES_LIST_START = 'REQUEST_GET_RESOURCES_LIST_START';
const REQUEST_GET_RESOURCES_LIST_SUCCESS = 'REQUEST_GET_RESOURCES_LIST_SUCCESS';
const REQUEST_GET_RESOURCES_LIST_ERROR = 'REQUEST_GET_RESOURCES_LIST_ERROR';

const REQUEST_CREATE_NEW_ROLES_START = 'REQUEST_CREATE_NEW_ROLES_START';
const REQUEST_CREATE_NEW_ROLES_ERROR = 'REQUEST_CREATE_NEW_ROLES_ERROR';
const REQUEST_CREATE_NEW_ROLES_SUCCESS = 'REQUEST_CREATE_NEW_ROLES_SUCCESS';

const REMOVE_ERRORS_IN_ROLES = 'REMOVE_ERRORS_IN_ROLES';

const pageLimmit = Number.parseInt(process.env.REACT_APP_API_LIMIT) || 50;

const initialState = {
	data: [],
	count: 0,
	loading: false,
	currentRole: {},
	error: {
		isError: false,
		message: ''
	}
};

const roles = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_ROLES_START:
			return { ...state, loading: true };
		case REQUEST_GET_ROLES_SUCCESS:
			return {
				...state,
				data: action.payload.data,
				count: action.payload.count,
				loading: false
			};
		case REQUEST_ROLES_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case REQUEST_REMOVE_ROLES_SUCCESS: {
			let Data = _.filter(state.data, item => item.id !== action.payload);
			return { ...state, data: Data, loading: false };
		}
		case REQUEST_GET_PERMISSIONS_START: {
			return { ...state, currentRole: {}, loading: true };
		}
		case REQUEST_GET_PERMISSIONS_SUCCESS: {
			return {
				...state,
				currentRole: action.payload,
				loading: false
			};
		}
		case CURRENT_ROLE_UPDATE: {
			return { ...state, currentRole: action.payload };
		}

		case REQUEST_SET_ROLES_START: {
			return { ...state, loading: true };
		}
		case REQUEST_SET_ROLES_SUCCESS: {
			return { ...state, loading: false };
		}
		case REQUEST_SET_ROLES_ERROR: {
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		}

		case REQUEST_GET_RESOURCES_LIST_START: {
			return { ...state, currentRole: {}, loading: true };
		}
		case REQUEST_GET_RESOURCES_LIST_SUCCESS: {
			return { ...state, currentRole: action.payload, loading: false };
		}
		case REQUEST_GET_RESOURCES_LIST_ERROR: {
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		}

		case REQUEST_CREATE_NEW_ROLES_START: {
			return { ...state, loading: true };
		}
		case REQUEST_CREATE_NEW_ROLES_ERROR: {
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		}
		case REQUEST_CREATE_NEW_ROLES_SUCCESS: {
			let newRoles = [...state.data];
			newRoles.push(action.payload.data)
			return {
				...state,
				data: _.uniq(newRoles),
				error: { isError: false, message: '' },
				loading: false
			};
		}
		case REMOVE_ERRORS_IN_ROLES: {
			return { ...state, error: { isError: false, message: '' } };
		}
		case REQUEST_GET_PERMISSIONS_ERROR: {
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		}
		case 'LOG_OUT':
			return initialState;
		default:
			return state;
	}
};

export const currentRoleUpdate = currentData => dispatch => {
	dispatch({
		type: CURRENT_ROLE_UPDATE,
		payload: currentData
	});
};
export const errorsRemove = currentData => dispatch => {
	dispatch({
		type: REMOVE_ERRORS_IN_ROLES
	});
};
export const fetchGetResourcesList = () => async dispatch => {
	dispatch({ type: REQUEST_GET_RESOURCES_LIST_START });

	API.role
		.resources()
		.then(res => {
			//видоизменяем данные временно, пока с сервка шлют не то что надо
			const newRole = {
				// role_code: 'defoult_code',
				role_name: '',
				description: '',
				resources: _.sortBy(res.data.data.result, 'resource_name')
			};
			dispatch({
				type: REQUEST_GET_RESOURCES_LIST_SUCCESS,
				payload: newRole
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_ROLES_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchGetOfRoles = params => async dispatch => {
	dispatch({ type: REQUEST_ROLES_START });
	API.role
	.list(params)
	.then( res => {
		const {data, count} = res.data.data.result;
		const payload = {data, count};
		dispatch({
			type: REQUEST_GET_ROLES_SUCCESS,
			payload: payload
		});
	})
	.catch(error => {
		dispatch({type: REQUEST_ROLES_ERROR})
	})
}

export const fetchGetAllRoles = url => async dispatch => {
	dispatch({ type: REQUEST_ROLES_START });
	const params = {
		offset: 0,
		limmit: pageLimmit
	};

	API.role
		.list(params)
		.then(async (res) => {
			const { data, count } = res.data.data.result;
			const payload = { data, count };

			if (pageLimmit < count) {
				const requestList = [res];

				for (let i = 1; i < (Math.ceil(count / pageLimmit)); i++) {
					params.offset = i * pageLimmit;
					
					const request = API.role.list(params);

					requestList.push(request);
				}

				const responseList = await Promise.all(requestList);
				let roles = [];

				responseList.map(response => {
					const data = response.data.data.result.data;
					
					roles = _.chain(data)
						.concat(roles)
						.uniqBy('id')
						.value();
				})

				dispatch({
					type: REQUEST_GET_ROLES_SUCCESS,
					payload: { count, data: roles }
				});

				return false;
			} 
 
			dispatch({
				type: REQUEST_GET_ROLES_SUCCESS,
				payload: payload
			});
		})
		.catch(error => {
			dispatch({ type: REQUEST_ROLES_ERROR });
		});
};

export const fetchPermissions = id => async dispatch => {
	dispatch({ type: REQUEST_GET_PERMISSIONS_START });

	API.role
		.show(id)
		.then(res => {
			let roleData = res.data.data;
			roleData.resources = _.sortBy(roleData.resources, 'resource_name');
			dispatch({
				type: REQUEST_GET_PERMISSIONS_SUCCESS,
				payload: roleData
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_GET_RESOURCES_LIST_ERROR,
				payload: error.response.data.message
			});
		});
};
export const fetchRemoveRoles = id => async dispatch => {
	dispatch({ type: REQUEST_ROLES_START });

	API.role
		.delete(id)
		.then(res => {
			dispatch({
				type: REQUEST_REMOVE_ROLES_SUCCESS,
				payload: id
			});
			dispatch(
				enqueueSnackbar({
					message: 'Roles removed!',
					options: {
						variant: 'success'
					}
				})
			);
		})
		.catch(error => {
			const errorMessage = error?.response?.data?.message ?? 'Error. User wasn\'t removed';

			dispatch({
				type: 'NEW_NOTIFICATION',
				payload: {
					message: errorMessage,
					type: 'danger',
					title: 'Error'
				}
			});
			dispatch({
				type: REQUEST_ROLES_ERROR,
				payload: errorMessage
			});
		});
};
export const fetchEditRoles = (id, data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_SET_ROLES_START });
	return API.role
		.edit(id, data)
		.then(res => {
			dispatch({
				type: REQUEST_SET_ROLES_SUCCESS,
				payload: res.data
			});
			dispatch(enqueueSnackbar({
				message: 'Roles updated!',
				options: {
					variant: 'success'
				}
			}));
			// dispatch(fetchGetAllRoles());
			toggle();
		})
		.catch(error => {
			if (error instanceof SubmissionError) {
				dispatch({
					type: REQUEST_SET_ROLES_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_SET_ROLES_ERROR,
					payload: error.response.data.message
				});
			}
		}); 
};
export const fetchCreateRole = (data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_CREATE_NEW_ROLES_START });
	return API.role
		.create(data)
		.then(res => {
			dispatch({
				type: REQUEST_CREATE_NEW_ROLES_SUCCESS,
				payload: res.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Roles created!',
					options: {
						variant: 'success'
					}
				})
			);
			// dispatch(fetchGetAllRoles());
			toggle();
		})
		.catch(error => {
			if (error instanceof SubmissionError) {
				dispatch({
					type: REQUEST_CREATE_NEW_ROLES_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_CREATE_NEW_ROLES_ERROR,
					payload: error.response.data.message
				});
			}

			//	dispatch(fetchGetAllRoles());
		});
};

export default roles;
