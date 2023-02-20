import API from '../service/apiSingleton';
import { SubmissionError } from 'redux-form';
import { enqueueSnackbar } from './notification';
import _ from 'lodash';
import { TIME_APPLY_SETTINGS } from '../utils/helper';
const REQUEST_GET_DRIVERS_START = 'REQUEST_GET_DRIVERS_START';
const REQUEST_GET_DRIVERS_SUCCESS = 'REQUEST_GET_DRIVERS_SUCCESS';
const REQUEST_GET_DRIVERS_ERROR = 'REQUEST_GET_DRIVERS_ERROR';

const REQUEST_EDIT_DRIVER_START = 'REQUEST_EDIT_DRIVER_START';
const REQUEST_EDIT_DRIVER_SUCCESS = 'REQUEST_EDIT_DRIVER_SUCCESS';
const REQUEST_EDIT_DRIVER_ERROR = 'REQUEST_EDIT_DRIVER_ERROR';

const REQUEST_ADD_DRIVER_START = 'REQUEST_ADD_DRIVER_START';
const REQUEST_ADD_DRIVER_SUCCESS = 'REQUEST_ADD_DRIVER_SUCCESS';
const REQUEST_ADD_DRIVER_ERROR = 'REQUEST_ADD_DRIVER_ERROR';

const CLEAR_ERROR = 'CLEAR_ERROR';

const initialState = {
	data: [],
	loading: true,
	error: {
		isError: false,
		message: ''
	}
};

const settings = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_GET_DRIVERS_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_GET_DRIVERS_SUCCESS:
			return {
				...state,
				data: action.payload,
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_EDIT_DRIVER_SUCCESS: {
			return {
				...state,
				data: _.map(state.data, item => {
					if (item.id === action.payload.id) return action.payload;
					else return item;
				}),
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_ADD_DRIVER_SUCCESS: {
			const newData = [action.payload, ...state.data];
			return {
				...state,
				data: newData,
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_GET_DRIVERS_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case CLEAR_ERROR: {
			return {
				...state,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case 'LOG_OUT':
			return initialState;
		default:
			return state;
	}
};

export const fetchDrivers = () => async dispatch => {
	dispatch({ type: REQUEST_GET_DRIVERS_START });
	API.drivers
		.list()
		.then(res => {
			dispatch({
				type: REQUEST_GET_DRIVERS_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_GET_DRIVERS_ERROR,
				payload: error.response.data.message
			});
		});
};
export const fetchAddDrivers = (data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_ADD_DRIVER_START });

	return API.drivers
		.create(data)
		.then(res => {
			dispatch({
				type: REQUEST_ADD_DRIVER_SUCCESS,
				payload: res.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Driver created!',
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
					type: REQUEST_ADD_DRIVER_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_ADD_DRIVER_ERROR,
					payload: error.response.data.message
				});
			}
		});
};

export const fetchEditDrivers = (id, data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_EDIT_DRIVER_START });

	return API.drivers
		.edit(id, data)
		.then(res => {
			dispatch({
				type: REQUEST_EDIT_DRIVER_SUCCESS,
				payload: res.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Driver updated!',
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
					type: REQUEST_EDIT_DRIVER_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_EDIT_DRIVER_ERROR,
					payload: error.response.data.message
				});
			}
		});
};
export const clearError = () => async dispatch => {
	dispatch({
		type: CLEAR_ERROR
	});
};
export default settings;
