import moment from 'moment';
import tm from 'moment-timezone';

const SET_TIMEZONE = 'SET_TIMEZONE';
const LOG_OUT = 'LOG_OUT';

export const getIntialTimeZone = () => {
	const storageTimeZone = localStorage.getItem('timezone');
	if (storageTimeZone) {
		tm.tz.setDefault(storageTimeZone);
		return storageTimeZone;
	} else return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
const initialState = {
	currentTimeZone: getIntialTimeZone()
};

const timezone = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_TIMEZONE:
			return { ...state, currentTimeZone: payload };
		case LOG_OUT:
			return initialState;
		default:
			return state;
	}
};

export const setTimeZone = zone => async dispatch => {
	localStorage.setItem('timezone', zone);
	tm.tz.setDefault(zone);

	dispatch({
		type: SET_TIMEZONE,
		payload: zone
	});
};

export default timezone;
