import React, { Component, useEffect } from 'react';
import moment from 'moment';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import _ from 'lodash';
import Road from './components/Roads';
import Notifier from './components/Notifier';
import ThemeProvider from './ThemeProvider';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { initStore } from './store';
import './styles/main.scss';
import './App.css';

// const getStateFromStorage = () => {
// 	const state = localStorage.getItem('state');
// 	if (!state) return undefined;

// 	const parsedState = JSON.parse(state);
// 	return parsedState;
// };
window.sessionStorage.setItem('TerminalIdSearch', '');
window.sessionStorage.setItem('TerminalIdSearchValue', '');
window.sessionStorage.setItem('saveFilterSearchId', 'Merchants');
window.sessionStorage.setItem('saveChangeFilterUsers', '');
window.sessionStorage.setItem('nodeManagemntSaveValue', '');
window.sessionStorage.setItem('saveUsersSearch', '');
window.sessionStorage.setItem('LogsAdminBodyTextFilterValue', '');
window.sessionStorage.setItem('LogsTerminalsBodyTextFilterValue', '');
window.sessionStorage.setItem('LogsApiBodyTextFilterValue', '');
window.sessionStorage.setItem('LogsPlatformBodyTextFilterValue', '');
window.sessionStorage.setItem('withdrawBuyerIdSearch', '');
window.sessionStorage.setItem('depositBuyerIdSearch', '');

export const store = initStore({}); //getStateFromStorage()

// let currentValue;

// function handleChange() {
// 	let previousValue = currentValue;
// 	currentValue = store.getState();

// 	if (previousValue !== currentValue) {
// 		let omittedValue = _.pick(currentValue, ['authorization']);
// 		omittedValue.errorMessage = '';
// 		omittedValue.isError = false;

// 		setTimeout(() => {
// 			return localStorage.setItem('state', JSON.stringify(omittedValue));
// 		}, 2000);
// 	}
// }

// store.subscribe(handleChange);

if( !localStorage.getItem('themeState') ){
	localStorage.setItem("themeState", "light")
}

const App = () => (
	
	<Provider store={store}>
		<ThemeProvider>
			<BrowserRouter>
				<SnackbarProvider
					maxSnack={5}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right'
					}}
				>
					<MuiPickersUtilsProvider
						utils={MomentUtils}
						ibInstance={moment}
					>
						<Road />
						<Notifier />
					</MuiPickersUtilsProvider>
				</SnackbarProvider>
			</BrowserRouter>
		</ThemeProvider>
	</Provider>
	
);

export default App;
