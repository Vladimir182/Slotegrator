import { enqueueSnackbar } from './notification';
import API from '../service/apiSingleton';

const REQUEST_DATA_ENCASHMENT_DISPENSER_START = 'REQUEST_DATA_ENCASHMENT_START';
const REQUEST_DATA_ENCASHMENT_DISPENSER_SUCCESS = 'REQUEST_DATA_ENCASHMENT_SUCCESS';
const REQUEST_DATA_ENCASHMENT_DISPENSER_ERROR = 'REQUEST_DATA_ENCASHMENT_ERROR';
const REQUEST_STAKED_DATA_SUCCESS = "REQUEST_STAKED_DATA_SUCCESS";
const REQUEST_ENCASHMENT_DISPENSER_HISTORY_SUCCESS = "REQUEST_ENCASHMENT_DISPENSER_HISTORY_SUCCESS";
const SET_IS_ENCASHMENT_DISPENSER_DONE = 'SET_IS_ENCASHMENT_DISPENSER_DONE';

const initialState = {
	data: [],
	countPage: 1,
	loading: false,
	error: {
		isError: false,
		message: ''
	},
	stacked_bills: null,
	single_stacked_bills: null,
	historyData: [],
	isEncashmentDispenserDone: false
};

const encashmentDespanser = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_DATA_ENCASHMENT_DISPENSER_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_DATA_ENCASHMENT_DISPENSER_SUCCESS:
			return {
				...state,
				data: action.payload.data.result,
				stacked_bills: null,
				countPage: action.payload.data.count,
				loading: false
			};
		case REQUEST_DATA_ENCASHMENT_DISPENSER_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case REQUEST_STAKED_DATA_SUCCESS:
			const stakedBillsData = action.payload?.data?.stacked_bills ?? [];
			const SingleStakedBillsData = [].concat(action.payload?.data?.stacked_bills[0]) ?? [];
			return {
				...state,
				loading: false,
				single_stacked_bills: SingleStakedBillsData,
				stacked_bills: stakedBillsData,
			}
		case REQUEST_ENCASHMENT_DISPENSER_HISTORY_SUCCESS:
			return {
				...state,
				historyData: action.payload.data.result,
				countPage: action.payload.data.count,
				loading: false,
				error: {
					isError: false,
					message: ''
				},
			}
		case SET_IS_ENCASHMENT_DISPENSER_DONE:
			return {
				...state,
				isEncashmentDispenserDone: action.payload
			}
		default:
			return state;
	}
};

export const fetchCreateEncashmentDispenser = params => async dispatch => {
	dispatch({ type: REQUEST_DATA_ENCASHMENT_DISPENSER_START });

	API.dispenser
		.create(params)
		.then(data => {
			
			let status = data.data.success;
			
			dispatch({
				type: REQUEST_DATA_ENCASHMENT_DISPENSER_SUCCESS,
				payload: data.data
			});
			dispatch({
				type: SET_IS_ENCASHMENT_DISPENSER_DONE,
				payload: true
			});
			if(status){
				dispatch(
					enqueueSnackbar({
						message: 'Encashment dispenser was success!',
						options: {
							variant: 'success'
				}}));
			} else throw 'Error'
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DATA_ENCASHMENT_DISPENSER_ERROR,
				payload: error.message
			});
			dispatch(
				enqueueSnackbar({
					message: 'Error of Encashment dispenser!',
					options: {
						variant: 'error'
					}
				})
			);
		});
};

export const fetchStakedData = id => async dispatch => {
	dispatch({ type: REQUEST_DATA_ENCASHMENT_DISPENSER_START });

	API.dispenser
		.getStakedData(id)
		.then(data => {
			dispatch({
				type: REQUEST_STAKED_DATA_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DATA_ENCASHMENT_DISPENSER_ERROR,
				payload: error.message
			});
		});
};

export const fetchEncashmentDispenserHistoryData = (params) => async dispatch => {
	dispatch({ type: REQUEST_DATA_ENCASHMENT_DISPENSER_START });

	API.dispenser
		.list(params)
		.then(data => {
			dispatch({
				type: REQUEST_ENCASHMENT_DISPENSER_HISTORY_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DATA_ENCASHMENT_DISPENSER_ERROR,
				payload: error.message
			});
		});
};

export const setIsEncashmentDispenserDone = (status) => ({
	type: SET_IS_ENCASHMENT_DISPENSER_DONE,
	payload: status
})

export default encashmentDespanser;
