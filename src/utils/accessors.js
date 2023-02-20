export const getUserData = state => {
	return state.authorization.userData;
};
export const getUserResources = state => {
	return state.authorization.userData.user.resources;
};
export const getTerminals = state => {
	return state.merchants.terminals;
};
export const getRooms = state => {
	return state.merchants.rooms;
};
export const getMerchants = state => {
	return state.merchants.merchants;
};
export const getCurrent = state => {
	return state.merchants.current;
};
export const getUsers = state => {
	return state.users.data;
};
export const getRoles = state => {
	return state.roles.data;
};
