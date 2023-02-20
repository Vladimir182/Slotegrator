import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import themes from './themes';

const { lightTheme, darkTheme } = themes;

const light = createMuiTheme(lightTheme);
const dark = createMuiTheme(darkTheme);

const themesMap = { 
	dark, 
	light 
};

const Theme = (props) => {
	const { type } = useSelector(state => state.theme);

	return (
			<ThemeProvider theme={themesMap[ localStorage.getItem('themeState') ]}>	
				<CssBaseline />
				{props.children}
			</ThemeProvider>
	);
}

export default Theme;
