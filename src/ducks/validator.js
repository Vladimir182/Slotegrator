import API from '../service/apiSingleton';
import { enqueueSnackbar } from './notification';
import { SubmissionError } from 'redux-form';

const REQUEST_DATA_ENCASHMENT_START = 'REQUEST_DATA_ENCASHMENT_START';
const REQUEST_DATA_ENCASHMENT_SUCCESS = 'REQUEST_DATA_ENCASHMENT_SUCCESS';
const REQUEST_DATA_ENCASHMENT_ERROR = 'REQUEST_DATA_ENCASHMENT_ERROR';
const REQUEST_CREATE_ENCASHMENT_START = 'REQUEST_CREATE_ENCASHMENT_START';
const REQUEST_CREATE_ENCASHMENT_SUCCESS = 'REQUEST_CREATE_ENCASHMENT_SUCCESS';
const REQUEST_CREATE_ENCASHMENT_ERROR = 'REQUEST_CREATE_ENCASHMENT_ERROR';
const REQUEST_FORCE_ENCASHMENT_SUCCESS = 'REQUEST_FORCE_ENCASHMENT_SUCCESS';
const REQUEST_FORCE_ENCASHMENT_ERROR = 'REQUEST_FORCE_ENCASHMENT_ERROR';
const RESET_FORCE_ENCASHMENT = 'RESET_FORCE_ENCASHMENT';

const initialState = {
	data: [],
	countPage: 1,
	loading: false,
	error: {
		isError: false,
		message: ''
	},
	currentEncashment: {
		stacked_bills: []
	},
	forceCorrectStatus: null
};

const encashmentValidator = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_DATA_ENCASHMENT_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_CREATE_ENCASHMENT_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_DATA_ENCASHMENT_SUCCESS:
			return {
				...state,
				data: action.payload.data.result,
				countPage: action.payload.data.count,
				loading: false
			};
		case REQUEST_DATA_ENCASHMENT_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case REQUEST_CREATE_ENCASHMENT_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case REQUEST_CREATE_ENCASHMENT_SUCCESS: {
			return {
				...state,
				currentEncashment: action.payload.data
			};
		}
		case REQUEST_FORCE_ENCASHMENT_SUCCESS: {
			return {
				...state,
				loading: false,
				forceCorrectStatus: true
			}
		};
		case REQUEST_FORCE_ENCASHMENT_ERROR: {
			return {
				...state,
				forceCorrectStatus: false,
				loading: false
			}
		}
		case RESET_FORCE_ENCASHMENT: {
			return {
				...state,
				forceCorrectStatus: null
			}
		}
		default:
			return state;
	}
};

export const fetchEncashmentEvent = params => async dispatch => {
	dispatch({ type: REQUEST_DATA_ENCASHMENT_START });

	API.validator
		.list(params)
		.then(data => {
			dispatch({
				type: REQUEST_DATA_ENCASHMENT_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DATA_ENCASHMENT_ERROR,
				payload: error.message
			});
		});
};

export const fetchCreateEncashment = params => async dispatch => {
	dispatch({ type: REQUEST_CREATE_ENCASHMENT_START });

	if (params.encashmentChoice === 'immediate') {
		return API.validator
			.immediate(params)
			.then(data => {
				console.log(data)
				dispatch({
					type: REQUEST_CREATE_ENCASHMENT_SUCCESS,
					payload: data.data
				});

				let status = data.data.success;

				if(status) {
					dispatch(enqueueSnackbar({
						message: 'Validator encashment X-Immediate was success!',
						options: {
							variant: 'success'
				}}));
				} else throw 'Error'	
			})
			.catch(error => {
				if (error instanceof SubmissionError) {
					dispatch({
						type: REQUEST_CREATE_ENCASHMENT_ERROR,
						payload: ''
					});
					throw error;
				}
				dispatch({
					type: REQUEST_CREATE_ENCASHMENT_ERROR,
					payload: error.message
				});
				dispatch(enqueueSnackbar({
					message: 'Error of X-Immediate encashment.',
					options: {
						variant: 'error'
			}}));
			});
	} else {
		return API.validator
			.daily(params)
			.then(data => {
				dispatch({
					type: REQUEST_CREATE_ENCASHMENT_SUCCESS,
					payload: data.data
				});

				let status = data.data.success;

				if(status){
					dispatch(enqueueSnackbar({
						message: 'Validator encashment Z-Daily was success!',
						options: {
							variant: 'success'
				}}));
				} else throw 'Error';
			})
			.catch(error => {
				if (error instanceof SubmissionError) {
					dispatch({
						type: REQUEST_CREATE_ENCASHMENT_ERROR,
						payload: ''
					});
					throw error;
				}
				dispatch({
					type: REQUEST_CREATE_ENCASHMENT_ERROR,
					payload: error.message
				});
				dispatch(enqueueSnackbar({
					message: 'Error of Z-Daily encashment.',
					options: {
						variant: 'error'
			}}));
			});
	}
};
export const fetchForceEncashment = (id) => async dispatch => {
	dispatch({ type: REQUEST_DATA_ENCASHMENT_START });

	API.validator
		.forceEncashment(id)
		.then(res => {
			dispatch({type: REQUEST_FORCE_ENCASHMENT_SUCCESS});

			const status = res.data.success;

			if (status) {
				dispatch(enqueueSnackbar({
						message: 'Force encashment was success!',
						options: {
							variant: 'success'
				}}));
			} else throw 'Error';

		}).catch(error => {
			dispatch({
				type: REQUEST_FORCE_ENCASHMENT_ERROR,
				payload: error.message
			});
			dispatch(enqueueSnackbar({
					message: 'Error of Force encashment.',
					options: {
						variant: 'error'
			}}));
		});
}
export const ResetForceStatus = () => async dispatch => {
	dispatch({type: RESET_FORCE_ENCASHMENT})
}
export default encashmentValidator;
