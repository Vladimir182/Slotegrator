import API from '../service/apiSingleton';
import _ from 'lodash';
import tm from 'moment-timezone';

const REQUEST_DATA_WITHDRAW_START = 'REQUEST_DATA_WITHDRAW_START';
const REQUEST_DATA_WITHDRAW_SUCCESS = 'REQUEST_DATA_WITHDRAW_SUCCESS';
const REQUEST_DATA_WITHDRAW_ERROR = 'REQUEST_DATA_WITHDRAW_ERROR';

const REQUEST_DATA_WITHDRAW_VERIFIED_START = 'REQUEST_DATA_WITHDRAW_VERIFIED_START';
const REQUEST_DATA_WITHDRAW_VERIFIED_SUCCESS = 'REQUEST_DATA_WITHDRAW_VERIFIED_SUCCESS';
const REQUEST_DATA_WITHDRAW_VERIFIED_ERROR = 'REQUEST_DATA_WITHDRAW_VERIFIED_ERROR';
const REQUEST_CHART_DATA_WITHDRAW_SUCCESS = 'REQUEST_CHART_DATA_WITHDRAW_SUCCESS';
const CLEAN_DATA_WITHDRAW = 'CLEAN_DATA_WITHDRAW';

const initialState = {
	data: [],
	countPage: 1,
	chartPagesCount: 1,
	loading: false,
	error: {
		isError: false,
		message: ''
	}
};

const withdraw = (state = initialState, { type, payload }) => {
	switch (type) {
		case REQUEST_DATA_WITHDRAW_START:
			return {
				...state,
				loading: true,
				error: {
					isError: false,
					message: ''
				}
			};
		case REQUEST_CHART_DATA_WITHDRAW_SUCCESS:
			
			const result = _.chain(state.data)
				.concat(payload.data.result)
				.uniqBy('id')
				.value();
		
			const countPage = payload.data.count 
			? Math.ceil(payload.data.count / (process.env.REACT_APP_API_LIMIT || 50)) 
			: state.chartPagesCount;

			const loading = payload.data.offset + payload.data.result.length < payload.data.count;
			
			return {
				...state,
				data: result,
				chartPagesCount: countPage,
				loading: loading
			};
		case CLEAN_DATA_WITHDRAW: 
			return {
				...state,
				data: []
			}	
		case REQUEST_DATA_WITHDRAW_SUCCESS:
			return {
				...state,
				data: payload.data.result,
				countPage: payload.data.count,
				loading: false
			};
		case REQUEST_DATA_WITHDRAW_ERROR:
			return {
				...state,
				error: { isError: true, message: payload },
				loading: false
			};
		case REQUEST_DATA_WITHDRAW_VERIFIED_SUCCESS: {
			const newData = _.map(state.data, item => {
				if (item.id === payload.id) {
					return payload;
				} else return item;
			});
			return {
				...state,
				data: newData,
				loading: false
			};
		}
		case REQUEST_DATA_WITHDRAW_VERIFIED_ERROR:
			return {
				...state,
				error: { isError: true, message: payload },
				loading: false
			};
		default:
			return state;
	}
};

export const fetchWithdraw = params => async dispatch => {
	dispatch({ type: REQUEST_DATA_WITHDRAW_START });

	API.withdraw
		.list(params)
		.then(data => {
			dispatch({
				type: REQUEST_DATA_WITHDRAW_SUCCESS,
				payload: data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DATA_WITHDRAW_ERROR,
				payload: error.message
			});
		});
};

export const fetchCashOutWithraw = id => async dispatch => {
	dispatch({ type: REQUEST_DATA_WITHDRAW_VERIFIED_START });

	API.withdraw
		.CashOut(id)
		.then(res => {
			dispatch({
				type: REQUEST_DATA_WITHDRAW_VERIFIED_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({
				type: REQUEST_DATA_WITHDRAW_VERIFIED_ERROR,
				payload: error.message
			});
		});
};

const getLatestItem = itemsArr => {
	let latestItem = itemsArr[0];

	_.forEach((itemsArr), function(item) {
		if(tm(item.created_at).isAfter(tm(latestItem.created_at), 'day')) {
			latestItem = {...item};
		}
	});

	return latestItem;
}

const getEarliestItem = itemsArr => {
	let earliestItem = itemsArr[0];

	_.forEach((itemsArr), function(item) {
		if(tm(item.created_at).isBefore(tm(earliestItem.created_at), 'day')) {
			earliestItem = {...item};
		}
	});

	return earliestItem;
}

export const fetchChartWithdraw = (params, selectedTimeZone) => async dispatch => {
	dispatch({ type: REQUEST_DATA_WITHDRAW_START });
	dispatch({ type: CLEAN_DATA_WITHDRAW });

	API.withdraw

	.list(params)
	.then(res => {
		const { result, offset, count } = res.data.data;
	
		if (offset + result.length === count) {
			dispatch({
				type: REQUEST_CHART_DATA_WITHDRAW_SUCCESS,
				payload: res.data
			});

			return false;
		}

		const latestItem = getLatestItem(result); 
		const earliestItem = getEarliestItem(result);

		params.offset = 0;

		params.filter_created_at_end = tm(earliestItem.created_at).tz(selectedTimeZone).isSame(latestItem.created_at, 'day') === true 
			? tm(latestItem.created_at)
				.add(1, 'days')
				.endOf('day')
				.tz(selectedTimeZone)
				.format()
			: tm(latestItem.created_at)
				.endOf('day')
				.tz(selectedTimeZone)
				.format();

		let i = 0;
		let max = Math.ceil(Number(count) / Number(process.env.REACT_APP_API_LIMIT));

		(async function Load() {
			let result;

			for (; i < max; i++) {
				params.offset = process.env.REACT_APP_API_LIMIT * i

				await API.withdraw.list(params).then(res => {
					result = _.chain(result)
					.concat(...res.data.data.result)
					.uniqBy('id')
					.value();
				})
				
				result = _.filter(result, item => {
					return !_.isEmpty(item);
				});
			}
			dispatch({
				type: REQUEST_CHART_DATA_WITHDRAW_SUCCESS,
				payload: { 
					data: { 
						result, 
						count: count
					} 
				}
			});
		})()	
	}).catch(error => {
		dispatch({
			type: REQUEST_DATA_WITHDRAW_ERROR,
			payload: error.message
		});
	});
}

export default withdraw;
