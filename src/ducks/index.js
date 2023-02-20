import logs from './logs';
// import changeSettings from './changeSettings';
import authorization from './authorization';
import merchants from './merchants';
import deposit from './deposit';
import withdraw from './withdraw';
import settings from './settings';
import validator from './validator';
import dispenser from './dispenser';
import timezone from './timezone';
import reports from './reports';
import users from './users';
import roles from './roles';
import testing from './testing';
import notification from './notification';
import widgets from './widgets';
import drivers from './drivers';
import sidebar from './sidebar';
import terminals from './terminals';
import theme from './theme';
import selected from './selected';
import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';

const mainReducer = combineReducers({
	logs,
	// changeSettings,
	authorization,
	merchants,
	deposit,
	withdraw,
	settings,
	timezone,
	validator,
	dispenser,
	reports,
	users,
	roles,
	testing,
	notification,
	widgets,
	drivers,
	sidebar,
	theme,
	selected,
	terminals,
	form: formReducer
});

export default mainReducer;
