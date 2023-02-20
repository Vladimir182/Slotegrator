// import API from '../service/api';
import API from '../service/apiSingleton';
import { enqueueSnackbar } from './notification';
import _ from 'lodash';
import debounce from 'debounce-promise'
import { SubmissionError } from 'redux-form';
import { rRender } from '../utils/helper';

const REQUEST_MERCHANT_START = 'REQUEST_MERCHANT_START';
const REQUEST_MERCHANT_SUCCESS = 'REQUEST_MERCHANT_SUCCESS';
// const REQUEST_EDIT_MERCHANT_SUCCESS = 'REQUEST_EDIT_MERCHANT_SUCCESS';
const REQUEST_DELETE_MERCAHNT_SUCCESS = 'REQUEST_DELETE_MERCAHNT_SUCCESS';
const REQUEST_MERCHANT_ERROR = 'REQUEST_MERCHANT_ERROR';
const REQUEST_ADD_MERCHANT_SUCCESS = 'REQUEST_ADD_MERCHANT_SUCCESS';
const REQUEST_EDIT_MERCHANT = 'REQUEST_EDIT_MERCHANT';
const REQUEST_FILTERED_MERCHANT_SUCCESS = 'REQUEST_FILTERED_MERCHANT_SUCCESS';
const RESET_FILTERED_MERCHANT = 'RESET_FILTERED_MERCHANT'; 

const REQUEST_ROOM_START = 'REQUEST_ROOM_START';
const REQUEST_ROOM_SUCCESS = 'REQUEST_ROOM_SUCCESS';
const REQUEST_DELETE_ROOM_SUCCESS = 'REQUEST_DELETE_ROOM_SUCCESS';
const REQUEST_EDIT_ROOM_SUCCESS = 'REQUEST_EDIT_ROOM_SUCCESS';
const REQUEST_ROOM_ERROR = 'REQUEST_ROOM_ERROR';

const REQUEST_TERMINALS_START = 'REQUEST_TERMINALS_START';
const REQUEST_TERMINALS_SUCCESS = 'REQUEST_TERMINALS_SUCCESS';
const REQUEST_TERMINALS_ERROR = 'REQUEST_TERMINALS_ERROR';
const REQUEST_DELETE_TERMINALS_SUCCESS = 'REQUEST_DELETE_TERMINALS_SUCCESS';
const REQUEST_RESET_TERMINAL_SUCCESS = 'REQUEST_RESET_TERMINAL_SUCCESS';
const REQUEST_ADD_TERMINALS_SUCCESS = 'REQUEST_ADD_TERMINALS_SUCCESS';

const SET_BUYERS_ID = 'SET_BUYERS_ID';

const SET_MERCHANT_ID_REQUESTING_ROOMS = 'SET_MERCHANT_ID_REQUESTING_ROOMS';
const RESET_MERCHANT_ID_REQUESTING_ROOMS = 'RESET_MERCHANT_ID_REQUESTING_ROOMS';
const REQUEST_MERCHANT_ROOMS_SUCCESS = 'REQUEST_MERCHANT_ROOMS_SUCCESS'; 

const SET_ROOM_ID_REQUESTING_TERMINALS = 'SET_ROOM_ID_REQUESTING_TERMINALS';
const RESET_ROOM_ID_REQUESTING_TERMINALS = 'RESET_ROOM_ID_REQUESTING_TERMINALS';
const REQUEST_ROOM_TERMINALS_SUCCESS = 'REQUEST_ROOM_TERMINALS_SUCCESS';

const initialState = {
	isLoading: false,
	events: [],
	merchants: [],
	merchantsCount: null,
	filteredMerchants: null,
	rooms: [],
	roomKeys: [],
	terminals: [],
	buyersId: [],
	merchantIdRequstingRooms: null,
	merchantRequstedRooms: {},
	roomIdRequestingTerminals: null,
	roomRequestedTerminals: {},
	error: {
		isError: false,
		message: ''
	}
};

const merchants = (state = initialState || {}, { type, payload }) => {
	switch (type) {
		case REQUEST_MERCHANT_START:
			return {
				...state,
				isLoading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_MERCHANT_SUCCESS: {
			let newMerchants = _.map(payload.result, item => {
				let tmp = item;
				tmp.nodeType = 'merchant';
				return tmp;
			});

			let merchants = _.chain(state.merchants)
				.concat(newMerchants)
				.uniqBy('id')
				.value();

			merchants = _.orderBy(merchants, ['id'], ['asc']);  

			return {
				...state,
				isLoading: false,
				merchants: merchants,
				merchantsCount: payload.count,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_FILTERED_MERCHANT_SUCCESS: {
			let newMerchants = _.map(payload.result, item => {
				// console.log('newMerchants', payload.result)
				let tmp = item;
				tmp.nodeType = 'merchant';
				return tmp;
			});

			// let merchants = [];

			// if (state.filteredMerchants) {
				// merchants	= _.chain(state.filteredMerchants ?? [])
				// .concat(newMerchants)
				// .uniqBy('id')
				// .value();
			// }

			// merchants = _.orderBy(merchants, ['id'], ['asc']);  

			return {
				...state,
				isLoading: false,
				filteredMerchants: newMerchants,
				merchantsCount: payload.count,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_DELETE_MERCAHNT_SUCCESS: {
			let merchants = _.filter(state.merchants, item => payload.id !== item.id);

			return {
				...state,
				isLoading: false,
				merchants: merchants,
				error: {
					isError: false,
					message: ''
				}
			}
		}
		case RESET_FILTERED_MERCHANT: 
			return {
				...state,
				filteredMerchants: null,
				isLoading: false,
				error: {
					isError: false,
					message: ''
				}
			}
		case REQUEST_ADD_MERCHANT_SUCCESS:
			// let newMerchants = Object.assign({}, state.merchants);
			payload.nodeType = 'merchant';
			let newMerchant = payload;
			// newMerchants[`${payload.id - 1}`] = payload;
			return {
				...state,
				isLoading: false,
				merchants: [...state.merchants, newMerchant],
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_MERCHANT_ERROR:
			return {
				...state,
				isLoading: false,
				error: {
					isError: true,
					message: payload
				}
			};
		case REQUEST_ROOM_START:
			return {
				...state,
				isLoading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_ROOM_SUCCESS:
			let rooms = _.chain(state.rooms)
				.concat(payload)
				.uniqBy('id')
				.value();

			rooms = _.filter(rooms, item => {
				return !_.isEmpty(item);
			});

			rooms = _.map(rooms, item => {
				let tmp = item;
				tmp.nodeType = 'room';
				return tmp;
			});

			rooms = _.orderBy(rooms, ['id'], ['asc']);

			return {
				...state,
				isLoading: false,
				rooms: rooms,
				error: {
					isError: false,
					message: ''
				}
			};	
		case REQUEST_EDIT_ROOM_SUCCESS: {
			if (_.isEmpty(payload)) {
				return state;
			}

			let newRooms = _.chain(state.rooms)
			.concat(payload)
			.uniqBy('id')
			.value();

			newRooms = _.map(newRooms, item => {
				if (item.id === payload.id) {
					payload.nodeType = 'room';
					payload.children = item.children || [];
					return payload;
				}
				return item;
			});

			return {
				...state,
				isLoading: false,
				rooms: newRooms,
				roomKeys: payload,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_MERCHANT_ROOMS_SUCCESS: {
			let rooms = _.chain(state.rooms)
				.concat(payload.rooms)
				.uniqBy('id')
				.value();

			rooms = _.filter(rooms, item => {
				return !_.isEmpty(item);
			});

			rooms = _.map(rooms, item => {
				let tmp = item;
				tmp.nodeType = 'room';
				return tmp;
			});

			rooms = _.orderBy(rooms, ['id'], ['asc']);

			const merchant = {[payload.merchantId]: { count: payload.count }};
			const newMerchantRequstedRooms = { ...state.merchantRequstedRooms, ...merchant };

			return {
				...state,
				rooms: rooms,
				merchantRequstedRooms: newMerchantRequstedRooms,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_DELETE_ROOM_SUCCESS: {
			let rooms = _.filter(state.rooms, item => payload.id !== item.id);

			return {
				...state,
				isLoading: false,
				rooms: rooms,
				error: {
					isError: false,
					message: ''
				}
			}
		}
		case REQUEST_ROOM_ERROR:
			return {
				...state,
				isLoading: false,
				error: {
					isError: true,
					message: payload
				}
			};
		case REQUEST_TERMINALS_ERROR:
			return {
				...state,
				isLoading: false,
				error: {
					isError: true,
					message: payload
				}
			};
		case REQUEST_TERMINALS_START:
			return {
				...state,
				isLoading: true,
				error: {
					isError: false,
					message: ''
				}
			};

		case REQUEST_TERMINALS_SUCCESS: {
			const terminalsArr = getPreparedTerminalsArr(payload);

			let terminals = _.chain(state.terminals)
				.concat(terminalsArr)
				.uniqBy('id')
				.value();
			
			terminals = _.orderBy(terminals, ['id'], ['asc']);

			return {
				...state,
				isLoading: false,
				terminals: terminals,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_ROOM_TERMINALS_SUCCESS: {
			const terminalsArr = getPreparedTerminalsArr(payload.terminals);

			let terminals = _.chain(state.terminals)
				.concat(terminalsArr)
				.uniqBy('id')
				.value();
			
			terminals = _.orderBy(terminals, ['id'], ['asc']);

			const room = {[payload.roomId]: { count: payload.count }};
			const newRoomRequestedTerminals = { ...state.roomRequestedTerminals, ...room };

			return {
				...state,
				terminals: terminals,
				roomRequestedTerminals: newRoomRequestedTerminals,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_ADD_TERMINALS_SUCCESS: {

			// const newTerminal = payload;
			// console.log('newTerminal', newTerminal)
			// const arrTerminal = state.terminals;
			// console.log('arrTerminal', arrTerminal)
			// arrTerminal.push(newTerminal);


			let terminals = _.chain(state.terminals)
			.concat(payload)
			.uniqBy('id')
			.value();

			terminals = _.filter(terminals, item=>{
				return !_.isEmpty(item)
			});

			terminals = _.map(terminals, item => {
				let tmp = item;
				tmp.nodeType='terminal';
				return tmp;
			});
			
			terminals = _.orderBy(terminals,['id'], ['asc']);

			return {
				...state,
				isLoading: false,
				terminals: terminals,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_DELETE_TERMINALS_SUCCESS: {
			let terminals = _.filter(state.terminals, item => payload.id !== item.id);
			
			return {
				...state,
				isLoading: false,
				terminals: terminals,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case REQUEST_EDIT_MERCHANT: {
			let newMerchants = _.map(state.merchants, item => {
				if (item.id === payload.id) {
					payload.nodeType = 'merchant';
					payload.children = [];
					return payload;
				}
				return item;
			});
			return {
				...state,
				isLoading: false,
				merchants: newMerchants,
				error: {
					isError: false,
					message: ''
				}
			};
		}
		case SET_BUYERS_ID: {
			return {
				...state,
				buyersId: payload,
				isLoading: false,
				error: {
					isError: false,
					message: ''
				}
			}
		}
		case SET_MERCHANT_ID_REQUESTING_ROOMS:{			
			return {
				...state,
				merchantIdRequstingRooms: payload,
			}
		}
		case RESET_MERCHANT_ID_REQUESTING_ROOMS:
			return {
				...state,
				merchantIdRequstingRooms: null,
			}
		case SET_ROOM_ID_REQUESTING_TERMINALS: { 
			return {
				...state,
				roomIdRequestingTerminals: payload,
			}
		}
		case RESET_ROOM_ID_REQUESTING_TERMINALS: 
			return {
				...state,
				roomIdRequestingTerminals: null
			}	
		default:
			return state;
	}
};

function getPreparedTerminalsArr(terminalsArr) {
	let arr = _.map(terminalsArr, item => {
		let tmp = item;
		tmp.nodeType = 'terminal';
		return tmp;
	});

	return arr;
}

export const fetchMerchants = (params) => async dispatch => {
	dispatch({ type: REQUEST_MERCHANT_START });
	let hasFilterParams =  false;
	if (Object.keys(params).filter(item => /filter_/.test(item)).length > 0) {
		hasFilterParams = true;
	}

	API.merchant
		.list(params)
		.then(response => {
			if (hasFilterParams) {
				dispatch({
					type: REQUEST_FILTERED_MERCHANT_SUCCESS,
					payload: response.data.data
				});
			} else {
				dispatch({
					type: REQUEST_MERCHANT_SUCCESS,
					payload: response.data.data
				});
			}
		})
		.catch(error => {
			dispatch({
				type: REQUEST_MERCHANT_ERROR,
				payload: error.message
			});
		});
};

export const fetchDeleteMerchant = id => async dispatch => {
	dispatch({ type: REQUEST_MERCHANT_START });
	API.merchant
	.delete(id)
	.then(request => {
		dispatch({
			type: REQUEST_DELETE_MERCAHNT_SUCCESS,
			payload: request.data.data
		});
		dispatch(
			enqueueSnackbar({
				message: `Merchant successfully removed`,
				options: {
					variant: 'success'
				}
			})
		);
	})
	.catch(error => {
		dispatch({
			type: REQUEST_MERCHANT_ERROR,
			payload: error.message
		});
		dispatch(
			enqueueSnackbar({
				message: `Error remove merchant `,
				options: {
					variant: 'error'
				}
			})
		);
	});
}

export const checkMerchantTitleoccupied = async (values) => {
	const { title, id } = values;
	const params = { filter_title: title };

	return API.merchant
		.list(params).then(response => {
			if(response.data.data.count) {
				const res = response.data.data.result;

				if (res.length === 1 && res[0].id === id) {
					return false;
				} 

				throw { title: 'This field is required' };
			}
		});
};

export const debouncedCheckMerchantTitleoccupied = debounce(checkMerchantTitleoccupied, 500);

export const fetchRoom = ulr => async dispatch => {
	dispatch({ type: REQUEST_ROOM_START });

	API.room
		.list()
		.then(request => {
			dispatch({
				type: REQUEST_ROOM_SUCCESS,
				payload: request.data.data.result
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_ROOM_ERROR,
				payload: error.message
			});
		});
};

export const fetchRooms = () => async dispatch => {
	dispatch({ type: REQUEST_ROOM_START });

  API.room
		.list()
		.then(request => {
			dispatch({
				type: REQUEST_ROOM_SUCCESS,
				payload: request.data.data.result
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_ROOM_ERROR,
				payload: error.message
			});
		});
};
export const fetchTerminals = () => async dispatch => {
	dispatch({ type: REQUEST_TERMINALS_START });

	API.terminal
		.list()
		.then(request => {
			dispatch({
				type: REQUEST_TERMINALS_SUCCESS,
				payload: request.data.data.result
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINALS_ERROR,
				payload: error.message
			});
		});
};

export const fetchDeleteTerminal = id => async dispatch => {
	dispatch({ type: REQUEST_TERMINALS_START });
	API.terminal
		.delete(id)
		.then(request => {
			dispatch({
				type: REQUEST_DELETE_TERMINALS_SUCCESS,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: `Terminal ${id} successfully removed`,
					options: {
						variant: 'success'
					}
				})
			);
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINALS_ERROR,
				payload: error.message
			});
			dispatch(
				enqueueSnackbar({
					message: `Error remove terminal ${id}`,
					options: {
						variant: 'error'
					}
				})
			);
		});
};

export const fetchResetTerminal = id => async dispatch => {
	dispatch({ type: REQUEST_TERMINALS_START });
	API.terminal
		.reset(id)
		.then(request => {
			dispatch({
				type: REQUEST_RESET_TERMINAL_SUCCESS,
				payload: request.data.data
			});
			dispatch(enqueueSnackbar({
				message: `Terminal successfully reseted`,
				options: {
					variant: 'success'
				}
			}));
		})
		.catch(error => {
			dispatch({
				type: REQUEST_TERMINALS_ERROR,
				payload: error.message
			});
			dispatch(enqueueSnackbar({
				message: `Request failure. Terminal is not reseted`,
				options: {
					variant: 'error'
				}
			}));
		});
};

export const fetchAddTerminal = (params, toggle) => async dispatch => {
	dispatch({ type: REQUEST_TERMINALS_START });
	return API.terminal
		.create(params)
		.then(request => {
			dispatch({
				type: REQUEST_ADD_TERMINALS_SUCCESS,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Terminal created',
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
					type: REQUEST_TERMINALS_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_TERMINALS_ERROR,
					payload: error.message
				});
			}
		});
};

export const fetchAddMerchant = (params, toggle) => async dispatch => {
	dispatch({ type: REQUEST_MERCHANT_START });
	return API.merchant
		.create(params)
		.then(request => {
			dispatch({
				type: REQUEST_ADD_MERCHANT_SUCCESS,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Merchant created',
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
					type: REQUEST_MERCHANT_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_MERCHANT_ERROR,
					payload: error.response.data.message
				});
			}
		});
};

export const fetchAddRoom = (data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_ROOM_START });
	return API.room
		.create(data)
		.then(request => {
			dispatch({
				type: REQUEST_ROOM_SUCCESS,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Room created',
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
					type: REQUEST_ROOM_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_ROOM_ERROR,
					payload: error.message
				});
			}
		});
};

export const fetchEditMerchant = (id, data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_MERCHANT_START });
	return API.merchant
		.edit(id, data)
		.then(request => {
			dispatch({
				type: REQUEST_EDIT_MERCHANT,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Merchant updated',
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
					type: REQUEST_MERCHANT_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_MERCHANT_ERROR,
					payload: error.response.data.message
				});
			}
		});
};

export const fetchDeleteRoom = id => async dispatch => {
	dispatch({ type: REQUEST_ROOM_START });
	API.room
	.delete(id)
	.then(request => {
		dispatch({
			type: REQUEST_DELETE_ROOM_SUCCESS,
			payload: request.data.data
		});
		dispatch(
			enqueueSnackbar({
				message: `Room successfully removed`,
				options: {
					variant: 'success'
				}
			})
		);
	})
	.catch(error => {
		dispatch({
			type: REQUEST_ROOM_ERROR,
			payload: error.message
		});
		dispatch(
			enqueueSnackbar({
				message: `Error remove room`,
				options: {
					variant: 'error'
				}
			})
		);
	});
}

export const fetchEditRoom = (id, data, toggle) => async dispatch => {
	dispatch({ type: REQUEST_ROOM_START });
	return API.room
		.edit(id, data)
		.then(request => {
			dispatch({
				type: REQUEST_EDIT_ROOM_SUCCESS,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Room updated',
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
					type: REQUEST_ROOM_ERROR,
					payload: ''
				});
				throw error;
			} else {
				dispatch({
					type: REQUEST_ROOM_ERROR,
					payload: error.message
				});
			}
		});
};

export const fetchRefreshKeys = (id, func) => async dispatch => {
	dispatch({ type: REQUEST_ROOM_START });
	API.room
		.refresh(id)
		.then(request => {
			dispatch({
				type: REQUEST_EDIT_ROOM_SUCCESS,
				payload: request.data.data
			});
			dispatch(
				enqueueSnackbar({
					message: 'Keys updated',
					options: {
						variant: 'success'
					}
				})
			);
			// func();
		})
		.catch(error => {
			dispatch({
				type: REQUEST_ROOM_ERROR,
				payload: error.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'The keys are not updated',
					options: {
						variant: 'error'
					}
				})
			);
		});
};

export const fetchBuyersId = (dispatch, roomId) => {
	dispatch({ type: REQUEST_ROOM_START });
	return API.room
		.buyersList(roomId)
		.then(res => dispatch({
			type: SET_BUYERS_ID,
			payload: res.data.data.ids
		}))
		.catch(error => {
			dispatch({
				type: SET_BUYERS_ID,
				payload: []
			})
			dispatch({
				type: REQUEST_ROOM_ERROR,
				payload: error.message
			});
		});	
};

export const fetchMerchantRooms = (merchantId, offset = 0) => dispatch => {
	dispatch({ type: SET_MERCHANT_ID_REQUESTING_ROOMS, payload: merchantId });
	const params = { 
		id: merchantId,
		offset
	};

	API.merchant
		.merchantRoomsList(params)
		.then(res => {

			const payloadData = {
				rooms: res.data.data.data,
				merchantId: merchantId,
				count: res.data.data.count
			};

			dispatch({
				type: REQUEST_MERCHANT_ROOMS_SUCCESS,
				payload: payloadData
			});
			dispatch({ type: RESET_MERCHANT_ID_REQUESTING_ROOMS });
		}).catch(error => {
			dispatch({ type: REQUEST_ROOM_ERROR });
			dispatch({ type: RESET_MERCHANT_ID_REQUESTING_ROOMS });
		})
}

export const fetchRoomTerminals = (roomId, offset = 0) => dispatch => {
	dispatch({ type: SET_ROOM_ID_REQUESTING_TERMINALS, payload: roomId });

	const params = {
		id: roomId,
		offset
	}

	API.room
		.roomTerminalsList(params)
		.then(res => {

			const payloadData = {
				terminals: res.data.data.data,
				roomId: roomId,
				count: res.data.data.count
			};

			dispatch({
				type: REQUEST_ROOM_TERMINALS_SUCCESS,
				payload: payloadData
			});
			dispatch({ type: RESET_ROOM_ID_REQUESTING_TERMINALS });
		}).catch(error => {
			dispatch({ type: REQUEST_TERMINALS_ERROR });
			dispatch({ type: RESET_ROOM_ID_REQUESTING_TERMINALS });
		})
}

export const resetFilteredMerchants = () => ({
	type: RESET_FILTERED_MERCHANT
});

export default merchants;
