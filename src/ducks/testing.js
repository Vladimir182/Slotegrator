import { enqueueSnackbar } from './notification';
import _API from '../service/apiSingleton';

const REQUEST_TEST_VALIDATOR_START = 'REQUEST_TEST_VALIDATOR_START';

const REQUEST_TEST_VALIDATOR_INFO_SUCCESS ='REQUEST_TEST_VALIDATOR_INFO_SUCCESS';
const REQUEST_TEST_VALIDATOR_ERROR = 'REQUEST_TEST_VALIDATOR_ERROR';
const REQUEST_VALIDATOR_STATUS_SUCCESS = 'REQUEST_VALIDATOR_STATUS_SUCCESS';


const REQUEST_TEST_PRINTER_START = 'REQUEST_TEST_PRINTER_START';
const REQUEST_TEST_PRINTER_STATUS_SUCCESS = 'REQUEST_TEST_PRINTER_STATUS_SUCCESS';
const REQUEST_TEST_PRINTER_ERROR = 'REQUEST_TEST_PRINTER_ERROR';

const REQUEST_VALIDATOR_COMMAND = 'REQUEST_VALIDATOR_COMMAND';
const REQUEST_PRINTER_CHECK = 'REQUEST_PRINTER_CHECK';

const REQUEST_SYSTEMINFO_START = 'REQUEST_SYSTEMINFO_START';
const REQUEST_SYSTEMINFO_SUCCESS = 'REQUEST_SYSTEMINFO_SUCCESS';
const REQUEST_SYSTEMINFO_ERROR = 'REQUEST_SYSTEMINFO_ERROR';

const REQUEST_TEST_TERMINAL_START = 'REQUEST_TEST_TERMINAL_START';
const REQUEST_TEST_TERMINAL_SUCCESS = 'REQUEST_TEST_TERMINAL_SUCCESS';
const REQUEST_TEST_TERMINAL_ERROR = 'REQUEST_TEST_TERMINAL_ERROR';

const REQUEST_ASK_FOR_DISPENSE = 'REQUEST_ASK_FOR_DISPENSE';
const REQUEST_ASK_FOR_DISPENSE_ERROR = 'REQUEST_ASK_FOR_DISPENSE_ERROR';
const CLEAN_TERMINAL_TESTING_DATA = 'CLEAN_TERMINAL_TESTING_DATA';

const REQUEST_DISPENSE = 'REQUEST_DISPENSE';
const REQUEST_DISPENSE_ERROR = 'REQUEST_DISPENSE_ERROR';

const REQUEST_PURGE = 'REQUEST_PURGE';
const REQUEST_PURGE_ERROR = 'REQUEST_PURGE_ERROR';

const REQUEST_DISPENSER_TEST = 'REQUEST_DISPENSER_TEST';
const REQUEST_DISPENSE_TEST_ERROR = 'REQUEST_DISPENSE_TEST_ERROR';

const REQUEST_DISPENSE_INFO = 'REQUEST_DISPENSE_INFO';
const REQUEST_DISPENSE_INFO_ERROR = 'REQUEST_DISPENSE_INFO_ERROR';

const REQUEST_DISPENSE_STATUS = 'REQUEST_DISPENSE_STATUS';
const REQUEST_DISPENSE_STATUS_ERROR = 'REQUEST_DISPENSE_STATUS_ERROR';

const REQUEST_UP_REMOTE_TUNNEL_SUCCESS ='REQUEST_UP_REMOTE_TUNNEL_SUCCESS';
const REQUEST_UP_REMOTE_TUNNEL_ERROR ='REQUEST_UP_REMOTE_TUNNEL_ERROR';
const CLEAN_UP_REMOTE_TUNNEL_DATA = 'CLEAN_UP_REMOTE_TUNNEL_DATA';

const REQUEST_DOWN_REMOTE_TUNNEL_SUCCESS = 'REQUEST_DOWN_REMOTE_TUNNEL_SUCCESS';
const REQUEST_DOWN_REMOTE_TUNNEL_ERROR ='REQUEST_DOWN_REMOTE_TUNNEL_ERROR';
const SET_NGROCK_TOKEN  = 'SET_NGROCK_TOKEN';

const CHANGE_TOKEN_UP_REMOTE_TUNNEL_DATA = 'CHANGE_TOKEN_UP_REMOTE_TUNNEL_DATA';
const CLEAN_UP_REMOTE_TUNNEL = 'CLEAN_UP_REMOTE_TUNNEL';

const initialState = {
	loading: false,
	terminal: {
		status: '',
		error: {
			isError: false,
			message: ''
		}
	},
	validatorStatus: {
		message: '',
		status: '',
		type: '',
	},
	validatorInfo: {
		Bills: '',
		Model: '',
		Validator: '',
		status: ''
	},
	errorValidator: {
		isError: false,
		message: ''
	},
	printerStatus: '',
	checkData: {},
	errorPrinter: {
		isError: false,
		message: ''
	},
	errorTestDispenser: {
		isError: false,
		message: ''
	},
	systemInfo: {},
	errorSystemInfo: {
		isError: false,
		message: ''
	},
	errorSystemControl: {
		isError: false,
		message: ''
	},
	askForDispenseData: {},
	dispenseData: {},
	dispensePurgeData:{},
	dispenserTestData: {},
	dispenserInfoData:{
		status: '',
		checksum: '',
		model: '',
		rom_version:''
	},
	dispenserStatusData: {
		status: '',
		cassette_info:[],
		message: ''
	},
	upRemoteTunnelData: {
		message: '',
		authtoken: '1YfE79cjKLqFNv5QwJSfHReeXVS_4y8DcedwhNaXBs76KAKhr'
	},
	downRemoteTunnelData: {}
};

const testing = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_TEST_VALIDATOR_START:
			return { ...state, loading: true };
		case REQUEST_VALIDATOR_STATUS_SUCCESS:
			return {
				...state,
				loading: false,
				validatorStatus: action.payload.params
			}
		case REQUEST_TEST_VALIDATOR_INFO_SUCCESS:
			return {
				...state,
				validatorInfo: {
					...action.payload.message,
					status: action.payload.status
				},
				loading: false,
				errorValidator: {
					isError: false,
					message: ''
				}
			};	
		case REQUEST_TEST_VALIDATOR_ERROR:
			return {
				...state,
				loading: false,
				validatorStatus: '',
				errorValidator: { isError: true, message: action.payload }
			};
		case REQUEST_TEST_PRINTER_START:
			return { ...state, loading: true };
		case REQUEST_TEST_PRINTER_STATUS_SUCCESS:
			return {
				...state,
				printerStatus: action.payload.data.params.status,
				loading: false,
				errorPrinter: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_PRINTER_CHECK:
			return {
				...state,
				printerStatus: action.payload.data.params.status,
				checkData: action.payload.data.params,
				loading: false,
				errorPrinter: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_TEST_PRINTER_ERROR:
			return {
				...state,
				loading: false,
				printerStatus: '',
				errorPrinter: { isError: true, message: action.payload }
			};
		case REQUEST_SYSTEMINFO_START: {
			return {
				...state,
				loading: true,
				errorSystemInfo: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_SYSTEMINFO_SUCCESS: {
			return {
				...state,
				systemInfo: action.payload,
				loading: false,
				errorSystemInfo: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_SYSTEMINFO_ERROR: {
			return {
				...state,
				loading: false,
				printerStatus: '',
				errorSystemInfo: { isError: true, message: action.payload }
			};
		}
		case REQUEST_TEST_TERMINAL_SUCCESS: {
			return {
				...state,
				loading: false,
				terminal: {
					...state.terminal,
					status: action.payload.params.status,
					error: {
						isError: false,
						message: ''
					}
				}
			};
		}
		case REQUEST_TEST_TERMINAL_START: {
			return {
				...state,
				loading: true,
				terminal: {
					status: '',
					error: {
						isError: false,
						message: ''
					}
				}
			};
		}
		case REQUEST_TEST_TERMINAL_ERROR: {
			return {
				...state,
				loading: false,
				terminal: {
					status: action.payload.message,
					error: {
						isError: true,
						message: action.payload
					}
				}
			};
		}
		case REQUEST_ASK_FOR_DISPENSE: {
			return {
				...state,
				askForDispenseData: action.payload,
				loading: false,
			}
		}
		case REQUEST_ASK_FOR_DISPENSE_ERROR: {
			return {
				...state,
				loading: false,
			};
		}
		case CLEAN_TERMINAL_TESTING_DATA: {
			return {
				...state,
				askForDispenseData: {},
				dispenseData: {},
				dispensePurgeData: {},
				dispenserTestData: {},
				loading: false,
				terminal: {
					status: '',
					errorDispenser: {
						isError: false,
						message: ''
					}
				}
			}
		}

		case REQUEST_DISPENSE: {
			return {
				...state,
				dispenseData: action.payload,
				loading: false,
			}
		}
		case REQUEST_DISPENSE_ERROR: {
			return {
				...state,
				loading: false,
			}
		}
		case REQUEST_PURGE: {
			return {
				...state,
				dispensePurgeData: action.payload,
				loading: false,
			}
		}
		case REQUEST_PURGE_ERROR: {
			return {
				...state,
				loading: false,
				terminal: {
					status: action.payload.message,
					error: {
						isError: true,
						message: action.payload
					}
				}
			}
		}
		case REQUEST_DISPENSER_TEST: {
			return {
				...state,
				dispenserTestData: action.payload,
				loading: false,
			}
		}
		case REQUEST_DISPENSE_TEST_ERROR: {
			return {
				...state,
				loading: false,
			}
		}


		case REQUEST_DISPENSE_INFO:{
			return {
				...state,
				dispenserInfoData: action.payload,
				loading: false,
			}
		}

		case REQUEST_DISPENSE_INFO_ERROR: {
			return {
				...state,
				loading: false,
				errorTestDispenser: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_DISPENSE_STATUS: {
			return {
				...state,
				dispenserStatusData: action.payload,
				loading: false,
			}
		}
		case REQUEST_DISPENSE_STATUS_ERROR: {
			return {
				...state,
				loading: false,
				errorTestDispenser: {
					isError: false,
					message: ''
				}
			};
		}
		case SET_NGROCK_TOKEN: {
			return{
				...state,
				upRemoteTunnelData: { ...state.upRemoteTunnelData, authtoken: action.payload },
			}
		}
		case REQUEST_UP_REMOTE_TUNNEL_SUCCESS: {
			return{
				...state,
				upRemoteTunnelData: { ...state.upRemoteTunnelData, ...action.payload },
				loading: false,
				errorSystemControl: {
					isError: false,
					message: ''
				}
			}
		}
		case REQUEST_UP_REMOTE_TUNNEL_ERROR: {
			return{
				...state,
				loading: false,
				errorSystemControl: {
					isError: false,
					message: action.payload
				}
			}
		}

		case REQUEST_DOWN_REMOTE_TUNNEL_SUCCESS: {
			return{
				...state,
				downRemoteTunnelData: action.payload,
				loading: false,
				errorSystemControl: {
					isError: false,
					message: ''
				}
			}
		}
		case REQUEST_DOWN_REMOTE_TUNNEL_ERROR: {
			return{
				...state,
				loading: false,
				errorSystemControl: {
					isError: true,
					message: ''
				}
			}
		}

		case CLEAN_UP_REMOTE_TUNNEL_DATA: {
			return {
				...state,
				upRemoteTunnelData: {...state.upRemoteTunnelData, authtoken: action.payload,
				message: ''},
				loading: false,
				terminal: {
					status: '',
					errorSystemControl: {
						isError: false,
						message: ''
					}
				}
			}
		}
		case CHANGE_TOKEN_UP_REMOTE_TUNNEL_DATA: {
			return{
				...state,
				upRemoteTunnelData: { ...state.upRemoteTunnelData, authtoken: action.payload },
			}
		}
		case CLEAN_UP_REMOTE_TUNNEL: {
			return {
				...state,
				upRemoteTunnelData: {
					message: '',
					authtoken: '1YfE79cjKLqFNv5QwJSfHReeXVS_4y8DcedwhNaXBs76KAKhr'
				}
			}
		}
		case 'LOG_OUT':
			return initialState;
		default:
			return state;
	}
};

export const fetchValidatorInfo = id => async dispatch => {
	dispatch({ type: REQUEST_TEST_VALIDATOR_START });

	_API.terminal
		.validatorInfo(id)
		.then(res => {
			dispatch({
				type: REQUEST_TEST_VALIDATOR_INFO_SUCCESS,
				payload: res.data.data.params
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TEST_VALIDATOR_ERROR,
				payload: error?.response?.data?.message
			});
		});
};

export const fetchSystemInfo = id => async dispatch => {
	dispatch({ type: REQUEST_SYSTEMINFO_START });
	_API.terminal
		.systemInfo(id)
		.then(res => {
			dispatch({
				type: REQUEST_SYSTEMINFO_SUCCESS,
				payload: res.data.data.params
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_SYSTEMINFO_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchValidatorStatus = id => async dispatch => {
	dispatch({ type: REQUEST_TEST_TERMINAL_START });

	_API.terminal
		.validatorStatus(id)
		.then(res => {
			dispatch({
				type: REQUEST_VALIDATOR_STATUS_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TEST_TERMINAL_ERROR,
				payload: error.response.data.message
			});
		});
};
export const fetchValidatorCommand = (id, command) => async dispatch => {
	dispatch({ type: REQUEST_TEST_VALIDATOR_START });

	_API.terminal
		.validatorCommand(id, command)
		.then(res => {
			dispatch({
				type: REQUEST_VALIDATOR_COMMAND,
				payload: res.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TEST_VALIDATOR_ERROR,
				payload: error.response.data.message
			});
		});
};
export const fetchPrinterStatus = id => async dispatch => {
	dispatch({ type: REQUEST_TEST_PRINTER_START });

	_API.terminal
		.printerStatus(id)
		.then(res => {
			dispatch({
				type: REQUEST_TEST_PRINTER_STATUS_SUCCESS,
				payload: res.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TEST_PRINTER_ERROR,
				payload: error.response.data.message
			});
		});
};
export const fetchPrinterCheck = (id, params) => async dispatch => {
	dispatch({ type: REQUEST_TEST_PRINTER_START });

	_API.terminal
		.printerCheck(id, params)
		.then(res => {
			if (res.data?.data?.params?.status === 'error') {
				dispatch(
					enqueueSnackbar({
						message: 'Error terminal print check',
						options: {
							variant: 'error'
						}
					})
				)
			}
			
			dispatch({
				type: REQUEST_PRINTER_CHECK,
				payload: res.data
			});
		})
		.catch(error => {
			
			dispatch({
				type: REQUEST_TEST_PRINTER_ERROR,
				payload: error.response.data.message
			});
		});
};
export const fetchAskForDispense = (id, params) => async dispatch => {
	dispatch({ type: REQUEST_TEST_TERMINAL_START });
	_API.terminal
		.askForDispense(id, params)
		.then(res => {
			dispatch({
				type: REQUEST_ASK_FOR_DISPENSE,
				payload: res.data.data.params
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_ASK_FOR_DISPENSE_ERROR,
				payload: error.response.data.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Ask for dispense error response.',
					options: {
						variant: 'error'
					}
				})
			)
		});
};
export const cleanTerminalTestData = () => async dispatch => {
	dispatch({
		type: CLEAN_TERMINAL_TESTING_DATA,
	})
};

export const fetchDispense = (id, params) => async dispatch => {
	dispatch({ type: REQUEST_TEST_TERMINAL_START });
	_API.terminal
		.dispenseData(id, params)
		.then(res => {
			dispatch({
				type: REQUEST_DISPENSE,
				payload: res.data.data.params
			});

		})
		.catch(error => {
			dispatch({
				type: REQUEST_DISPENSE_ERROR,
				payload: error.response.data.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Dispense error response.',
					options: {
						variant: 'error'
					}
				})
			)
		});
};

export const fetchPurge = (id, params) => async dispatch => {
	dispatch({type: REQUEST_TEST_TERMINAL_START});
	_API.terminal
	.dispensePurgeData(id, params)
		.then(res => {
			dispatch({
				type: REQUEST_PURGE,
				payload: res.data.data.params
			});
		})
		.catch( error =>{
			dispatch({
				type: REQUEST_PURGE_ERROR,
				payload: error.response.data.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Purge error response.',
					options: {
						variant: 'error'
					}
				})
			)
		});
};

export const fetchDispenserTest = (id) => async dispatch => {
	dispatch({type: REQUEST_TEST_TERMINAL_START});
	_API.terminal
		.dispenserTestData(id)
		.then(res => {
			dispatch({
				type: REQUEST_DISPENSER_TEST,
				payload: res.data.data.params
			});
		})
		.catch(error=>{
			dispatch({
				type: REQUEST_DISPENSE_TEST_ERROR,
				payload: error.response.data.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Dispenser test error response.',
					options: {
						variant: 'error'
					}
				})
			)
		});
};

export const fetchDispenserInfo = (id) => async dispatch =>{
	dispatch({type: REQUEST_TEST_TERMINAL_START});
	_API.terminal
		.dispenserInfo(id)
		.then(res => {
			dispatch({
				type: REQUEST_DISPENSE_INFO,
				payload: res.data.data.params,
			});
		})
	.catch(error => {
		dispatch({
			type: REQUEST_DISPENSE_INFO_ERROR,
			payload: error.response.data.message
		});
	});
};

export const fetchDispenserStatus = (id) => async dispatch => {
	dispatch({type: REQUEST_TEST_TERMINAL_START});
	_API.terminal
		.dispenserStatus(id)
		.then(res => {
			dispatch({
				type: REQUEST_DISPENSE_STATUS,
				payload: res.data.data.params,
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DISPENSE_STATUS_ERROR,
				payload: error.response.data.message
			});
		});
};

export const fetchUpRemoteTunnel = (id, ngrockToken) => async dispatch => {
	dispatch({type: REQUEST_TEST_TERMINAL_START});
	dispatch({type: SET_NGROCK_TOKEN, payload: ngrockToken});
	const params = {
		id: id,
		authtoken: ngrockToken
	};
	_API.terminal
		.upRemoteTunnel(id, params)
		.then(res => {
			dispatch({
				type: REQUEST_UP_REMOTE_TUNNEL_SUCCESS,
				payload: res.data.data.params,
			});
			dispatch(
				enqueueSnackbar({
					message: 'Remote tunnel was created!',
					options: {
						variant: 'success'
					}
				})
			);
		})
		.catch(error => {
			dispatch({
				type: REQUEST_UP_REMOTE_TUNNEL_ERROR,
				payload: error.response.data.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Can\'t up remote tunnel!',
					options: {
						variant: 'error'
					}
				})
			);
		});
};

export const changeTokenRemoteTunnel = (tokenValue) => async dispatch => {
	dispatch({
		type: CHANGE_TOKEN_UP_REMOTE_TUNNEL_DATA, payload: tokenValue
	})
};

export const cleanAppRemoteTunnel = () => async dispatch => {
	dispatch({type: CLEAN_UP_REMOTE_TUNNEL})
};

export const fetchDownRemoteTunnel = (id, ngrockToken) => async dispatch => {
	dispatch({type: REQUEST_TEST_TERMINAL_START});
	dispatch({type: CLEAN_UP_REMOTE_TUNNEL_DATA, payload: ngrockToken});
	const params = {
		id: id,
		authtoken: ngrockToken
	};
	_API.terminal
		.downRemoteTunnel(id, params)
		.then(res => {
			dispatch({
				type: REQUEST_DOWN_REMOTE_TUNNEL_SUCCESS,
				payload: res.data.data.params,
			});
			dispatch(
				enqueueSnackbar({
					message: 'Remote tuennel was removed!',
					options: {
						variant: 'success'
					}
				})
			);
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DOWN_REMOTE_TUNNEL_ERROR,
				payload: error.response.data.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Can\'t remove remote tunnel.',
					options: {
						variant: 'error'
					}
				})
			);
		});
};

export default testing;
