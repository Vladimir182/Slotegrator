const SET_SIDEBAR_STATE = 'SET_SIDEBAR_STATE';

const initialState = {
    isOpen: localStorage.getItem('sidebar_state') ?? true
};

const sidebar = (state = initialState, action) => {
	switch (action.type) {
		case SET_SIDEBAR_STATE:
			return {
				...state,
                isOpen: action.payload
			};
		default:
			return state;
	}
};

export const setSidebarState = (isOpen) => ({
    type: SET_SIDEBAR_STATE,
    payload: isOpen
});

export default sidebar;
