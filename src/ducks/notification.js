const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

const defaultState = {
	notifications: []
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case ENQUEUE_SNACKBAR:
			return {
				...state,
				notifications: [
					...state.notifications,
					{
						...action.notification
					}
				]
			};

		case REMOVE_SNACKBAR:
			return {
				...state,
				// notifications: state.notifications.filter(notification => notification.key !== action.key)
				notifications: []
			};

		default:
			return state;
	}
};

export const enqueueSnackbar = notification => async dispatch => {
	const key = new Date().getTime() + Math.random();
	dispatch({
		type: REMOVE_SNACKBAR,
	});
	dispatch({
		type: ENQUEUE_SNACKBAR,
		notification: {
			key: key,
			...notification
		}
	});
};

export const removeSnackbar = key => async dispatch => {
	dispatch({
		type: REMOVE_SNACKBAR,
		key
	});
};
