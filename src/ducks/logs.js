// import API from '../service/api'
import _, { set } from 'lodash';
import API from '../service/apiSingleton';

const REQUEST_LOGS_START = 'REQUEST_LOGS_START';
const REQUEST_LOGS_SUCCESS = 'REQUEST_LOGS_SUCCESS';
const REQUEST_LOGS_ERROR = 'REQUEST_LOGS_ERROR';

const REQUEST_LOGS_TYPES_START = 'REQUEST_LOGS_TYPES_START';
const REQUEST_LOGS_TYPES_SUCCESS = 'REQUEST_LOGS_TYPES_SUCCESS';
const REQUEST_LOGS_TYPES_ERROR = 'REQUEST_LOGS_TYPES_ERROR';

const REQUEST_ERRORS_START = 'REQUEST_ERRORS_START';
const REQUEST_ERRORS_SUCCESS = 'REQUEST_ERRORS_SUCCESS';
const REQUEST_ERRORS_ERROR = 'REQUEST_ERRORS_ERROR';

const REQUEST_DATA_START = 'REQUEST_DATA_START';
const REQUEST_DATA_SUCCESS = 'REQUEST_DATA_SUCCESS';
const REQUEST_DATA_ERROR = 'REQUEST_DATA_ERROR';

const initialState = {
	logs: [],
	countPage: 1,
	errors: [],
	countErrors: 0,
	loading: false,
	loadingTypes: false,
	error: {
		isError: false,
		message: ''
	},
	logsTypes: {
		admin: [],
		api: [],
		terminals: [],
		platform: []
	},
	levels: {
		admin: [],
		api: [],
		terminals: [],
		platform: []
	}
};

const logs = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_LOGS_START:
			return { 
				...state,
				logs: [],
				loading: true 
			};
		case REQUEST_LOGS_SUCCESS:
			return {
				...state,
				logs: action.payload.data.result,
				countPage: action.payload.data.count,
				loading: false
			};
		case REQUEST_LOGS_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false,
				logs: [],
				countPage: 0
			};
		case REQUEST_ERRORS_START:
			return { ...state, loading: true };
		case REQUEST_LOGS_TYPES_START:
			return {
				...state,
				loadingTypes: false,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_LOGS_TYPES_SUCCESS:
			_.map(Object.keys(action.payload.data), key => action.payload.data[key].unshift({
				name: 'All',
				description: 'All',
				filter_log_type: 'All'
			}));
			
			const { admin, api, terminals, platform } = action.payload.data;

			let levelsAdmin = [];
			let levelsApi = [];
			let levelsTerminals = [];
			let levelsPlatform = [];

			_.map(admin, item => {
				_.map(item.filter_level, level => levelsAdmin.push(level));
			});
			_.map(api, item => {
				_.map(item.filter_level, level => levelsApi.push(level));
			});
			_.map(terminals, item => {
				_.map(item.filter_level, level => levelsTerminals.push(level));
			});
			_.map(platform, item => {
				_.map(item.filter_level, level => levelsPlatform.push(level));
			});

			levelsAdmin = [...new Set(levelsAdmin.sort())];
			levelsApi = [...new Set(levelsApi.sort())];
			levelsTerminals = [...new Set(levelsTerminals.sort())];
			levelsPlatform = [...new Set(levelsPlatform.sort())];

			levelsAdmin.unshift('All');
			levelsApi.unshift('All');
			levelsTerminals.unshift('All');
			levelsPlatform.unshift('All');

			return {
				...state,
				levels: {
					admin: levelsAdmin,
					api: levelsApi,
					terminals: levelsTerminals,
					platform: levelsPlatform
				},
				logsTypes: {
					admin,
					api,
					terminals,
					platform
				},
				// loadingTypes: true,
			};
		case REQUEST_LOGS_TYPES_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case REQUEST_ERRORS_SUCCESS:
			return {
				...state,
				errors: action.payload,
				loading: false,
				countErrors: _.size(action.payload)
			};
		case REQUEST_ERRORS_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload }
			};
		case 'LOG_OUT':
			return initialState;
		default:
			return state;
	}
};

// export const fetchEvent = url => async dispatch => {
// 	dispatch({ type: REQUEST_DATA_START });

// 	API.sendRequest(url)
// 		.then(data => {
// 			dispatch({
// 				type: REQUEST_DATA_SUCCESS,
// 				payload: data.data.data.params
// 			});
// 		})
// 		.catch(error => {
// 			console.log(error);
// 			dispatch({
// 				type: REQUEST_DATA_ERROR,
// 				payload: error.response.data.message
// 			});
// 		});
// };

// export const fetchLogsTerminals = params => async dispatch => {
// 	dispatch({ type: REQUEST_LOGS_START });

// 	API.logs
// 		.listTerminal(params)
// 		.then(data => {
// 			dispatch({
// 				type: REQUEST_LOGS_SUCCESS,
// 				payload: data.data
// 			});
// 		})
// 		.catch(error => {
// 			console.log(error);
// 			dispatch({
// 				type: REQUEST_LOGS_ERROR,
// 				payload: error.response.data.message
// 			});
// 		});
// };

export const fetchLogsTypes = () => async dispatch => {
	dispatch({ type: REQUEST_LOGS_TYPES_START });
	API.logs
		.listTypes()
		.then(data => {
			dispatch({
				type: REQUEST_LOGS_TYPES_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_LOGS_TYPES_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchLogs = (params, service) => async dispatch => {
	dispatch({ type: REQUEST_LOGS_START });
	API.logs
		.listLogs(params, service)
		.then(data => {
			dispatch({
				type: REQUEST_LOGS_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_LOGS_ERROR,
				payload: error.response.data.message
			});
		});
};
// export const fetchLogsServerReq = params => async dispatch => {
// 	dispatch({ type: REQUEST_LOGS_START });
// 	API.logs
// 		.listServerReq(params)
// 		.then(data => {
// 			dispatch({
// 				type: REQUEST_LOGS_SUCCESS,
// 				payload: data.data
// 			});
// 		})
// 		.catch(error => {
// 			console.log(error);
// 			dispatch({
// 				type: REQUEST_LOGS_ERROR,
// 				payload: error.response.data.message
// 			});
// 		});
// };
// export const fetchLogs = data => async dispatch => {
// dispatch({type: REQUEST_LOGS_START});
// API.sendRequest(url,method,data).then((res) => {
//     dispatch({
//         type: REQUEST_LOGS_SUCCESS,
//         payload: res.data
//     })
// }).catch(error => {
//     console.log(error)
//     dispatch({
//         type: REQUEST_LOGS_ERROR,
//         payload: error.response.data.message
//     })
// })
// };

export const fetchErrorsTerminals = (url, params) => async dispatch => {
	dispatch({ type: REQUEST_ERRORS_START });

	API.sendRequest(url, 'POST', params)
		.then(data => {
			dispatch({
				type: REQUEST_ERRORS_SUCCESS,
				payload: data.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_ERRORS_ERROR,
				payload: error.response.data.message
			});
		});
};

export default logs;
