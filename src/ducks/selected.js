import API from '../service/apiSingleton';
import _ from 'lodash';
import { rRender } from '../utils/helper';
import { store } from '../App';

import { enqueueSnackbar } from './notification';

const REQUEST_SELECTED_DEPENDENCIES_START = 'REQUEST_SELECTED_DEPENDENCIES_START';

const REQUEST_SELECTED_DEPENDENCIES_SUCCESS = 'REQUEST_SELECTED_DEPENDENCIES_SUCCESS';

const REQUEST_SELECTED_DEPENDENCIES_ERROR = 'REQUEST_SELECTED_DEPENDENCIES_ERROR';

const RESET_SELECTED_NODE = 'RESET_SELECTED_NODE';

const initialState = {
	isLoading: false,
	nodeType: 'root',
	preloadNodeType: 'root',
    terminal: null,
    room: null,
    merchant: null,
    error: false
};

let storageSelected = sessionStorage.getItem('selected');
storageSelected = JSON.parse(storageSelected);

const merchants = (state = storageSelected || initialState, { type, payload }) => {
	switch (type) {
		case REQUEST_SELECTED_DEPENDENCIES_START:
			return {
				...state,
				preloadNodeType: payload,
				isLoading: true,
				error: false,
			};
		case REQUEST_SELECTED_DEPENDENCIES_SUCCESS: {
			const nodeType = payload.terminal ? 'terminal' :
				payload.room ? 'room' :
				payload.merchant ? 'merchant' : 'root';

			const newSelected = {
				...state,
				...payload,
				nodeType,
				isLoading: false
			};
			
			sessionStorage.setItem('selected', JSON.stringify(newSelected));

			return newSelected; 
		}         
		case REQUEST_SELECTED_DEPENDENCIES_ERROR:
			return {
				...state,
				isLoading: false,
				error: true
			};
		case RESET_SELECTED_NODE:
			return initialState;
		default:
			return state;
	}
};

export const setSelectedNode = (id, nodeType, resources) => async dispatch => {

	if (!id || !nodeType || !resources) {
		dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_ERROR });
		
		return;
	}

	const state = store.getState();

	let terminalFromState = null;

	if (nodeType === 'terminal') {
		terminalFromState = state.widgets?.terminals?.data.find(item => item.id === id);

		if (!terminalFromState)
			terminalFromState = state.terminals?.terminals.find(item => item.id === id);
		
		if (terminalFromState) {
			const terminalRoom = state.merchants?.rooms.find(item => item.id === terminalFromState.room_id);
			const terminalMerchant = state.merchants?.merchants.find(item => item.id === terminalFromState.merchant_id);

			dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_SUCCESS, payload: { 
				terminal: terminalFromState,
				room: terminalRoom,
				merchant: terminalMerchant
			}});

			if (terminalFromState && terminalRoom && terminalMerchant)
				return true;
		}
	}
	
	return (async () => {
		dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_START, payload: nodeType });

		try {
			const result = {};
			let merchantRes, roomRes, terminalRes;
			
			if (nodeType === 'merchant' && rRender(resources, 'merchants', 'allow_view')) {
				merchantRes = await API.merchant.show(id).then(res => res.data.data);
			} else if (nodeType === 'room' && rRender(resources, 'rooms', 'allow_view')) {
				roomRes = await API.room.show(id).then(res => res.data.data);
				if(rRender(resources, 'merchants', 'allow_view')){
				merchantRes = await API.merchant.show(roomRes.merchant_id).then(res => res.data.data);
				}
			} else if (nodeType === 'terminal' && rRender(resources, 'terminals', 'allow_view')) {
				terminalRes = terminalFromState ?? await API.terminal.terminalStateById(id).then(res => res.data.data);
				roomRes = await API.room.show(terminalRes.room_id).then(res => res.data.data);
				if(rRender(resources, 'merchants', 'allow_view')){
					merchantRes = await API.merchant.show(terminalRes.merchant_id).then(res => res.data.data);
				}
			}
	 
			result['merchant'] = merchantRes;
			result['room'] = roomRes;
			result['terminal'] = terminalFromState ?? terminalRes;

			dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_SUCCESS, payload: result });
		} catch (error) {
			dispatch(
				enqueueSnackbar({
					message: ' Error seting selected terminal',
					options: {
						variant: 'error'
					}
				})
			)
			dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_ERROR });
			dispatch(resetSelectedNode());
		}
	})()
}

/* BELLOW setSelectedNode VERSION WITHOULT GETTING DATA FROM STATE */

// export const setSelectedNode = (id, nodeType, resources) => async dispatch => {

// 	if (!id || !nodeType || !resources) {
// 		dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_ERROR });
		
// 		return;
// 	}

// 	return (async () => {
// 		dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_START, payload: nodeType });
			
// 		try {
// 			const result = {};
// 			let merchantRes, roomRes, terminalRes;
			
// 			if (nodeType === 'merchant' && rRender(resources, 'merchants', 'allow_view')) {
// 				merchantRes = await API.merchant.show(id).then(res => res.data.data);
// 			} else if (nodeType === 'room' && rRender(resources, 'rooms', 'allow_view')) {
// 				roomRes = await API.room.show(id).then(res => res.data.data);
// 				merchantRes = await API.merchant.show(roomRes.merchant_id).then(res => res.data.data);
// 			} else if (nodeType === 'terminal' && rRender(resources, 'terminals', 'allow_view')) {
// 				terminalRes = await API.terminal.terminalStateById(id).then(res => res.data.data);
// 				roomRes = await API.room.show(terminalRes.room_id).then(res => res.data.data);
// 				merchantRes = await API.merchant.show(terminalRes.merchant_id).then(res => res.data.data);
// 			}
	 
// 			result['merchant'] = merchantRes;
// 			result['room'] = roomRes;
// 			result['terminal'] = terminalRes;

// 			dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_SUCCESS, payload: result });
// 		} catch (error) {
// 			dispatch({ type: REQUEST_SELECTED_DEPENDENCIES_ERROR });
// 		}
// 	})()
// }

export const resetSelectedNode = () => dispatch => { 
	sessionStorage.removeItem('selected');  
	console.log('RESET')

	dispatch({
		type: RESET_SELECTED_NODE
	});
}

export default merchants;