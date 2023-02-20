import _ from 'lodash';
export const rRender = (resources, code, access) => {
	let item = _.find(resources, { resource_code: code });
	return item && item[access];
};
