import _API from '../service/apiSingleton';
import { TIME_APPLY_SETTINGS } from '../utils/helper';
const REQUEST_SETTINGS_START = 'REQUEST_SETTINGS_START';
const REQUEST_SETTINGS_SUCCESS = 'REQUEST_SETTINGS_SUCCESS';
const REQUEST_SETTINGS_ERROR = 'REQUEST_SETTINGS_ERROR';
const SAVE_SETTINGS_LOADING_START = 'SAVE_SETTINGS_LOADING_START';
const SAVE_SETTINGS_LOADING_SUCCESS = 'SAVE_SETTINGS_LOADING_SUCCESS';
const CLEAR_ERROR = 'CLEAR_ERROR';

const initialState = {
	settings: {
		terminalId: '',
		balancerIp: '',
		checkWidth: 0,
		balancerPort: '',
		settingsPort: '',
		dbUserName: '',
		dbPassword: '',
		currency: '',
		validatorProtocol: '',
		validatorPath: '',
		printerPath: ''
	},
	loading: false,
	saveSettingsLoading: false,
	error: {
		isError: false,
		message: ''
	}
};

const settings = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_SETTINGS_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_SETTINGS_SUCCESS:
			action.payload.validatorProtocol = action.payload.validatorProtocol.toUpperCase();
			return {
				...state,
				settings: action.payload,
				loading: false,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_SETTINGS_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false,
				saveSettingsLoading: false
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
		case SAVE_SETTINGS_LOADING_START:
			return {
				...state,
				saveSettingsLoading: true
			}
		case SAVE_SETTINGS_LOADING_SUCCESS:
			return {
				...state,
				saveSettingsLoading: false
			}	
		default:
			return state;
	}
};

export const fetchSettings = id => async dispatch => {
	dispatch({ type: REQUEST_SETTINGS_START });
	_API.terminal
		.settings(id)
		.then(data => {
			dispatch({
				type: REQUEST_SETTINGS_SUCCESS,
				payload: data.data.data.params
			});		
			dispatch({type: SAVE_SETTINGS_LOADING_SUCCESS});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_SETTINGS_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchSaveSettings = (data) => async dispatch => {
	dispatch({ type: REQUEST_SETTINGS_START });
	dispatch({ type: SAVE_SETTINGS_LOADING_START });
	
	const id = data.terminal_id;

	_API.terminal
		.saveSettings(id, data)
		.then(data => {
			if (data.data.data.params.status === 'ok') {
				_API.terminal
					.applySettings(id)
					.then(res => {
						setTimeout(() => {
							dispatch(fetchSettings(res.data.data.terminal_id))
						}, TIME_APPLY_SETTINGS);
					})
					.catch(error => {
						dispatch({
							type: REQUEST_SETTINGS_ERROR,
							payload: error.response.data.message
						});
					});

			} else {
				dispatch({
					type: REQUEST_SETTINGS_ERROR,
					payload: data.data.data.params.message
				});
			}
		})
		.catch(error => {
			dispatch({
				type: REQUEST_SETTINGS_ERROR,
				payload: 'Save settings error'
			});
		});
};

export const fetchApplySettings = id => async dispatch => {
	_API.terminal
		.applySettings(id)
		.then(res => {
			fetchSettings(res.data.data.terminal_id);
		})
		.catch(error => {
			dispatch({
				type: REQUEST_SETTINGS_ERROR,
				payload: error.response.data.message
			});
		});
};
export const clearError = () => async dispatch => {
	dispatch({
		type: CLEAR_ERROR
	});
};
export default settings;
