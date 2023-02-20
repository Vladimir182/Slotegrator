import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Arrow from '@material-ui/icons/KeyboardArrowLeft';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { logOut } from '../../ducks/authorization';
import { setTheme } from '../../ducks/theme';
import { setTimeZone, getIntialTimeZone } from '../../ducks/timezone';
import { sideBarState } from '../../utils/helper';
import Menu from '../Menu';
import { connect } from 'react-redux';
import CurrentTime from './CurrentTime';
import UserInfoList from './UserInfoList';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { InputAdornment, TextField } from '@material-ui/core';
import timezones, { stringifyZone } from '../../utils/timezones';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { rRender } from '../../utils/helper';
import { compose } from 'redux';
import { setSelectedNode } from '../../ducks/selected';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import CloseIcon from '@material-ui/icons/Close';

const drawerWidth = 240;

const styles = theme => {
	return ({
		grow: {
			flexGrow: 1
		},
		logout: {
			marginRight: '40px'
		},
		appBar: {
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}),
			boxShadow:'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14)'
		},
		customStylesInput: {
			'&>div': {
				color: 'rgba(255,255,255,0.8)',
				letterSpacing: '1px',
				fontWeight: '500'
			}
		},
		toolBar: {
			[theme.breakpoints.down('sm')]: {
				minHeight: theme.spacing(14)
			},
			backgroundColor:  theme.palette.type === 'dark' ? theme.palette.background.paper: theme.palette.dark,
			'& .MuiIconButton-root':{
				'&:hover' :{
					backgroundColor: theme.palette.buttonHover
				}
			}
			// fontSize: '0.925rem',
			// backgroundColor: theme.palette.background.paper
		},
		appBarShift: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			}),
			[theme.breakpoints.down('xs')]: {
				width: '100%',
				marginLeft: 0
			},
		},
		rightMenu: {
			display: 'flex',
			maxWidth: '700px',
			width: '100%',
			justifyContent: 'flex-end'
		},
		currentTime: {
			padding: '0 10px',
			fontSize: '16px'
		},
		timezoneBlock: {
			display: 'inline-block',
			width: '100%',
			maxWidth: '300px',
			[theme.breakpoints.down('sm')]: {
				maxWidth: '250px',
				},
			[theme.breakpoints.down('xs')]: {
			maxWidth: '200px'
			}
		},
		timezoneItems:{
			[theme.breakpoints.down('xs')]: {
				fontSize: '14px'
				}
		},
		hide: {
			display: 'none'
		},
		drawer: {
			width: drawerWidth,
			[theme.breakpoints.down('xs')]: {
				  width: '100%',
			},
			flexShrink: 0
		},
		drawerPaper: {
			width: drawerWidth,
			background: theme.palette.sidebarBackground,
			[theme.breakpoints.down('xs')]: {
				width: '100%',
			},
		},
		drawerHeader: {
			display: 'flex',
			alignItems: 'center',
			padding: '0 8px',
			...theme.mixins.toolbar,
			justifyContent: 'flex-end',
			background: theme.palette.background.bgArrowMenu,
			'& .MuiIconButton-root':{
				color: theme.palette.button.menuItem.color,
				'&:hover':{
					backgroundColor: theme.palette.buttonHover
				}
			},
			[theme.breakpoints.down('xs')]: {
				'&:hover':{
					cursor: 'pointer',
					backgroundColor: 'rgba(0, 0, 0, 0.16)',
					transition: '250ms'
				},
				'& .MuiIconButton-root':{
					'&:hover':{
						backgroundColor: 'transparent !important'
					}
				},
			}
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing.unit * 3,
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}),
			marginLeft: -drawerWidth
		},
		contentShift: {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			}),
			marginLeft: 0
		},
		breadcrumbs: {
			width: '100%',
			background: theme.palette.breadCrumbs.breadCrumbBackground,
			//height: '25px'
		},
		breadcrumbsShift: {
			width: '100%',
			background: theme.palette.breadCrumbs.breadCrumbBackground,
			paddingLeft: `${drawerWidth}px`,
			[theme.breakpoints.down('xs')]: {
				paddingLeft: 0
			},
		},
		autocompleteRoot: {
			height: '100%',
			'& .MuiInputBase-root': {
				padding: 0,
			}
		},
		autocompleteInputRoot: {
			height: '100%',
			letterSpacing: '1px',
			backgroundColor: 'rgba(0,0,0,0)',
			fontWeight: '500',
			color: 'rgba(255,255,255,0.8)!important',
			'&::before': {
				borderBottom: 'none!important'
			},
			'& input': {
				padding: '17px 5px!important',
			},
		},
		autocompleteEndAdorment: {
			paddingLeft: '5px',
			borderLeft: '1px solid rgb(204, 204, 204)',
			'& *': {
				color: 'rgb(204, 204, 204)!important'
			}
		},
		switchThemeButton: {
			width: 'fit-content',
			height: 'fit-content',
			alignSelf: 'center'
		},
		timezoneOption: {
			[theme.breakpoints.down('xs')]: {
				fontSize: '14px'
				}
		}
	})
};
class Header extends Component {

	constructor(props) {
		super(props);

		const isSmallScreen = window.innerWidth <= props.theme.breakpoints.width('sm');
		const initialSideBarState = isSmallScreen ? false : sideBarState();

		this.state = {
			open: initialSideBarState,
			timezoneValue: ''
		};
		props.setTimeZone(getIntialTimeZone());
	}

	static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.timezoneValue !== nextProps.timezone) {
			return {
				timezoneValue : nextProps.timezone
			};
       	}

		return null;
	}

	handlerDrawerOpen = () => {
		this.setState({ open: true }, () => {
			this.props.handlerDrawerToggle(this.state.open);
			sideBarState(true);
		});
	};

	handlerDrawerClose = () => {
		this.setState({ open: false }, () => {
			this.props.handlerDrawerToggle(this.state.open);
			sideBarState(false);
		});
	};

	handlerTimezoneChange = value => {
		const { setTimeZone } = this.props;
		
		if (value.name) {
			setTimeZone(value.name);
		}
		this.setState({
			timezoneValue: value
		});
	};

	handlerLogOut = () => {
		const { logOut, history } = this.props;
		logOut();
		history.push('/login');
	};

	render() {
		const { 
			classes, 
			timezone, 
			userData, 
			setTheme,
			selected,
			theme
		} = this.props;

		const { open } = this.state;
		const timezonePlaceholder = 'Select timezone';
		const timezoneValue = timezones.find(timezineItem => timezineItem.name === timezone);
		const isSmallScreen = window.innerWidth <= theme.breakpoints.width('sm');

		return (
			<div>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar className={classes.toolBar} disableGutters={!open}>
						<IconButton
							color="inherit"
							aria-label="Open drawer"
							onClick={this.handlerDrawerOpen}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							variant="h6"
							color="inherit"
							noWrap
							className={classes.grow}>
							{this.state.caption}
						</Typography>
						<div className={classes.rightMenu}>
							<div className={classes.currentTime}>
								<CurrentTime />
							</div>
							<div className={classes.timezoneBlock}>
								<Autocomplete
									autoComplete={true}
									disableClearable={true}
									autoHighlight={true}
									classes={{
										input: classes.timezoneItems,
										root: classes.autocompleteRoot,
										inputRoot: classes.autocompleteInputRoot,
										endAdornment: classes.autocompleteEndAdorment,
										option: classes.timezoneOption
									}}
									id="header-timezone-select"
									options={timezones}
									clearOnEscape={true}
									value={timezoneValue?.label ?? timezonePlaceholder}
									clearOnBlur={true}
									onChange={(e, value) => {
										this.handlerTimezoneChange(value);
									}}
									getOptionLabel={(item)=> typeof item === 'string' ? item : stringifyZone(item, 'GMT')}
									popupIcon={<KeyboardArrowDownIcon color="action" />}
									renderInput={params => {
										const newValue = params.inputProps.value.split(' ')[1];

										return (
											<TextField
												classes={{
													root: classes.autocompleteInputRoot
												}}
												{...params}
												variant="filled"
												fullWidth={true}
												// InputProps={{
												// 	endAdornment: <InputAdornment position="start">Kg</InputAdornment>,
												// }}
											/>
										)
									}}
								/>
							</div>
							<IconButton
								className={classes.switchThemeButton}
								color="inherit"
								aria-label="Open drawer"
								onClick={setTheme}
							>
								{theme.palette.type === 'light' 
								? <Brightness3Icon fontSize='small' /> 
								: <WbSunnyIcon fontSize='small' />
								}
							</IconButton>
							<UserInfoList 
								className={classes.buttonHover}
								userData={userData}
								handlerLogOut={this.handlerLogOut}
							/>
						</div>
					</Toolbar>
					<div
						className={
							open
								? classes.breadcrumbsShift
								: classes.breadcrumbs
						}
						id="header-breadcrumbs"	
					>
					<HeaderBreadcrumbs />
					</div>
				</AppBar>
				<Drawer
					className={classes.drawer}
					variant="persistent"
					anchor="left"
					open={open}
					classes={{paper: classes.drawerPaper}}
				>
					{ isSmallScreen ?
						<div 
							className={classes.drawerHeader} 
							onClick={this.handlerDrawerClose}>
							<IconButton>
								<CloseIcon />
							</IconButton>
						</div> : 
						<div className={classes.drawerHeader}>
							<IconButton onClick={this.handlerDrawerClose}>
								<Arrow />
							</IconButton>
						</div>
					}
					<Divider />
					<Menu 
						handlerDrawerClose={this.handlerDrawerClose} 
					/>
					<Divider />
					<List />
				</Drawer>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isLoading: state.merchants.isLoading,
	user: state.authorization.userData.user,
	timezone: state.timezone.currentTimeZone,
	userData: state.authorization.userData.user,
	selected: state.selected
});

const mapDispatchToProps = {
	logOut,
	setTimeZone,
	setTheme,
	setSelectedNode,
};

export default compose(
	withRouter,
	connect(mapStateToProps,mapDispatchToProps),
	withStyles(styles),
	withTheme,
)(Header);
