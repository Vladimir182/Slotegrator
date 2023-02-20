import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Settings from '../components/Terminal/Settings';
import System from '../components/Terminal/System';
import Testing from '../components/Terminal/Testing';
import SystemControl from '../components/Terminal/SystemControl';
import { cleanTerminalTestData } from '../ducks/testing';
import { Redirect, withRouter } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		color: theme.palette.type === 'dark' ? theme.palette.primary.contrastText : theme.palette.dark
	},
	table: {
		width: '100%',
		overflowX: 'auto'
	},
	reload: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	loading: {
		height: '5px',
		width: '100%'
	},
	tabsStyleSticky: {
		[theme.breakpoints.up('md')]:{
			background: theme.palette.tableControl.tableControlColor,
			position: 'sticky',
			top: '88px',
			zIndex: '20',
		}
	} 
});

class Terminal extends Component {
	constructor(props) {
		super(props);
		const storageTabs = sessionStorage.getItem('saveTabs');

		this.state = {
			currentTab: storageTabs ? JSON.parse(storageTabs) : 0
		};
	}

	handleChangeTab = (event, newValue) => {
		const { currentTab } = this.state;
		const { cleanTerminalTestData} = this.props;

		sessionStorage.setItem('saveTabs', newValue);

		if (currentTab === 1 && newValue !== 1) {
			cleanTerminalTestData();
		}

		this.setState({ currentTab: newValue });
	};

	render() {
		const { classes, selected, user } = this.props;
		const { currentTab } = this.state;

		if (
			!selected.terminal 
			|| selected.nodeType !== 'terminal' 
			|| selected.preloadNodeType !== 'terminal'
		) {
			return <Redirect to="/" />
		}

		if (user.role_code !== 'super_admin' && (currentTab === 2 || currentTab === 3)) {
			this.handleChangeTab(1);
		}

		return (
			<div>
				<Paper className={classes.root}>
					<Tabs 
						value={currentTab} 
						className={classes.tabsStyleSticky}
						onChange={this.handleChangeTab}
						variant="scrollable"
						scrollButtons="auto"
					>
						<Tab
							label="Settings"
						/>
						<Tab
							label="Testing"
						/>
						{user.role_code === 'super_admin' && (
							<Tab
								label="System Info"
							/>
						)}
						{user.role_code === 'super_admin' && (
							<Tab
								label="System Control"
							/>
						)}
					</Tabs >
					<div className={classes.table}>
						{currentTab === 0 && <Settings />}
						{currentTab === 1 && <Testing />}
						{user.role_code === 'super_admin' &&
							currentTab === 2 && <System />}
						{user.role_code === 'super_admin' &&
						currentTab === 3 && <SystemControl />}
					</div>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
	user: state.authorization.userData.user
});

const mapDispatchToProps = {
	cleanTerminalTestData
};

export default compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Terminal);
