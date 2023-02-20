import _ from 'lodash';
import API from '../service/apiSingleton';
import { enqueueSnackbar } from './notification';

const REQUEST_TERMINALS_STATUS_START = 'REQUEST_TERMINALS_STATUS_START';
export const REQUEST_TERMINALS_STATUS_SUCCESS = 'REQUEST_TERMINALS_STATUS_SUCCESS';
const REQUEST_TERMINALS_STATUS_ERROR = 'REQUEST_TERMINALS_STATUS_ERROR';

const REQUEST_TERMINAL_BY_ID_STATUS_START = 'REQUEST_TERMINAL_BY_ID_STATUS_START';
const REQUEST_TERMINAL_BY_ID_STATUS_SUCCESS = 'REQUEST_TERMINAL_BY_ID_STATUS_SUCCESS';
const REQUEST_TERMINAL_BY_ID_STATUS_ERROR = 'REQUEST_TERMINAL_BY_ID_STATUS_ERROR';

const REQUEST_DEVICE_FIX_STATUS_START = 'REQUEST_DEVICE_FIX_STATUS_START';
const REQUEST_DEVICE_FIX_STATUS_SUCCESS = 'REQUEST_DEVICE_FIX_STATUS_SUCCESS';
const REQUEST_DEVICE_FIX_STATUS_ERROR = 'REQUEST_DEVICE_FIX_STATUS_ERROR';

const REQUEST_TERMINAL_ON_START = 'REQUEST_TERMINAL_ON_START';
const REQUEST_TERMINAL_ON_SUCCESS = 'REQUEST_TERMINAL_ON_SUCCESS';
const REQUEST_TERMINAL_ON_ERROR = 'REQUEST_TERMINAL_ON_ERROR';
const REQUEST_TERMINAL_OFF_START = 'REQUEST_TERMINAL_OFF_START';
const REQUEST_TERMINAL_OFF_SUCCESS = 'REQUEST_TERMINAL_OFF_SUCCESS';
const REQUEST_TERMINAL_OFF_ERROR = 'REQUEST_TERMINAL_OFF_ERROR';


const initialState = {
	terminals: {
		data: [],
		countPage: 1,
		loading: false,
		error: {
			isError: false,
			message: ''
		}
	},
	fixPeripheralLoading: false,
};

const widgets = (state = initialState, { type, payload }) => {
	switch (type) {
		case REQUEST_TERMINALS_STATUS_START:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: true,
					error: {
						isError: false,
						message: ''
					}
				}
			};
		case REQUEST_TERMINAL_BY_ID_STATUS_START:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: true,
					error: {
						isError: false,
						message: ''
					}
				}
			};

		case REQUEST_TERMINALS_STATUS_SUCCESS:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					countPage: payload.count,
					data: payload.result,
					error: {
						isError: false,
						message: ''
					}
				}
			};
		case REQUEST_TERMINAL_BY_ID_STATUS_SUCCESS:
			const terminals = _.chain(payload)
			.concat(state.terminals.data)
			.uniqBy('id')
			.sortBy('id')
			.value();
			
			return {
				...state,
				terminals: {
					...state.terminals,
					data: terminals,
					loading: false,
					error: {
						isError: false,
						message: ''
					}
				}
			};
		case REQUEST_TERMINAL_ON_SUCCESS: {
			let NewData = _.map(state.terminals.data, item => {
				if (payload.id === item.id) return payload;
				else return item;
			});
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					data: NewData,
					error: {
						isError: false,
						message: ''
					}
				}
			};
		}
		case REQUEST_TERMINAL_OFF_SUCCESS: {
			let NewData = _.map(state.terminals.data, item => {
				if (payload.id === item.id) return payload;
				else return item;
			});

			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					data: NewData,
					error: {
						isError: false,
						message: ''
					}
				}
			};
		}
		case REQUEST_TERMINALS_STATUS_ERROR:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					error: {
						isError: true,
						message: payload
					}
				}
			};
		case REQUEST_TERMINAL_BY_ID_STATUS_ERROR:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					error: {
						isError: true,
						message: payload
					}
				}
			};
		case REQUEST_TERMINAL_ON_ERROR:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					error: {
						isError: true,
						message: payload
					}
				}
			};
		case REQUEST_TERMINAL_OFF_ERROR:
			return {
				...state,
				terminals: {
					...state.terminals,
					loading: false,
					error: {
						isError: true,
						message: payload
					}
				}
			};
		case REQUEST_DEVICE_FIX_STATUS_START:
			return {
				...state,
				fixPeripheralLoading: true
			}
		case REQUEST_DEVICE_FIX_STATUS_SUCCESS:
		case REQUEST_DEVICE_FIX_STATUS_ERROR:
			return {
				...state,
				fixPeripheralLoading: false
			}
		case 'LOG_OUT':
			return initialState;
		default:
			return state;
	}
};

export const fetchTerminalsState = params => async dispatch => {
	dispatch({ type: REQUEST_TERMINALS_STATUS_START });
	return API.terminal
		.terminalState(params)
		.then(data => {
			dispatch({
				type: REQUEST_TERMINALS_STATUS_SUCCESS,
				payload: data.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINALS_STATUS_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchTerminalsStateById = id => async dispatch => {
	dispatch({ type: REQUEST_TERMINAL_BY_ID_STATUS_START });

	API.terminal
		.terminalStateById(id)
		.then(res => {
			dispatch({
				type: REQUEST_TERMINAL_BY_ID_STATUS_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINAL_BY_ID_STATUS_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchDeviceFix = (id, device) => async dispatch => {
	dispatch({ type: REQUEST_DEVICE_FIX_STATUS_START });

	API.terminal
		.deviceFix(id, device)
		.then(res => {
			API.terminal
				.terminalStateById(id)
				.then(res => {
					dispatch({
						type: REQUEST_TERMINAL_BY_ID_STATUS_SUCCESS,
						payload: res.data.data
					});
					dispatch({ type: REQUEST_DEVICE_FIX_STATUS_SUCCESS });
					dispatch(enqueueSnackbar({
						message: 'Fix peripheral successfully completed',
						options: {
							variant: 'success'
						}
					}));
				})
				.catch(error => {
					dispatch({
						type: REQUEST_TERMINAL_BY_ID_STATUS_ERROR,
						payload: error.response.data.message
					});
					dispatch({ type: REQUEST_DEVICE_FIX_STATUS_ERROR });
					dispatch(enqueueSnackbar({
						message: 'Fix peripheral is not completed',
						options: {
							variant: 'error'
						}
					}));
				});
		})
		.catch(error => {
			dispatch({ type: REQUEST_DEVICE_FIX_STATUS_ERROR });
			dispatch(enqueueSnackbar({
				message: 'Fix peripheral is not completed',
				options: {
					variant: 'error'
				}
			}));
		});
};

export const fetchTerminalON = id => async dispatch => {
	dispatch({ type: REQUEST_TERMINAL_ON_START });

	API.terminal
		.on(id)
		.then(res => {
			dispatch({
				type: REQUEST_TERMINAL_ON_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINAL_ON_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchTerminalOFF = id => async dispatch => {
	dispatch({ type: REQUEST_TERMINAL_OFF_START });

	API.terminal
		.off(id)
		.then(res => {
			dispatch({
				type: REQUEST_TERMINAL_OFF_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINAL_OFF_ERROR,
				payload: error.response.data.message
			});
		});
};


export default widgets;
