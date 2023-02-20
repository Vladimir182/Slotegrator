import API from '../service/apiSingleton';

const REQUEST_REPORTS_START = 'REQUEST_REPORTS_START';
const REQUEST_REPORTS_SUCCESS = 'REQUEST_REPORTS_SUCCESS';
const REQUEST_REPORTS_ERROR = 'REQUEST_REPORTS_ERROR';

const initialState = {
	data: [],
	loading: false,
	error: {
		isError: false,
		message: ''
	}
};

const reports = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_REPORTS_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_REPORTS_SUCCESS:
			return {
				...state,
				data: action.payload.data,
				loading: false
			};
		case REQUEST_REPORTS_ERROR:
			return {
				...state,
				error: { isError: true, message: action.payload },
				loading: false
			};
		case 'LOG_OUT':
			return initialState;
		default:
			return state;
	}
};

export const fetchReports = (params, table, id) => async dispatch => {
	dispatch({ type: REQUEST_REPORTS_START });

	API.reports
		.list(params, table, id)
		.then(data => {
			dispatch({
				type: REQUEST_REPORTS_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_REPORTS_ERROR,
				payload: error.response.data.message
			});
		});
};
export default reports;
