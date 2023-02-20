import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import SettingForm from '../forms/terminal-forms/SettingTerminalForm';
import {
	fetchSaveSettings,
	fetchSettings,
	clearError
} from '../../ducks/settings';
import ErrorTerminal from './ErrorTerminal';
import { compose } from 'redux';
import { 
	Button, 
	Tooltip, 
	LinearProgress, 
	Typography 
} from '@material-ui/core';
import Update from '@material-ui/icons/RestorePage';

let SHADE = 50;
const styles = theme => {
	if (theme.palette.type === 'dark') {
		SHADE = 'A200';
	} else {
		SHADE = 50;
	}

	return {
		root: {
			// paddingTop: '10px',
			'& .MuiButton-root':{
				color: theme.palette.button.color,
				marginLeft: theme.spacing(2),
				minWidth: '48px',
				padding: '10px',
				border: theme.palette.button.borderColor,
				borderRadius: '50%',
					'&:hover':{
						backgroundColor: theme.palette.button.hover + '!important',
					}
			},
		},
		table: {
			width: '100%',
			overflowX: 'auto'
		},
		maxWidth: {
			maxWidth: '1000px',
			overflow: 'auto'
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
		rowCorrect: {
			backgroundColor: green[SHADE]
		},
		rowUnCorrect: { backgroundColor: red[SHADE] },
		applySettingsNotify: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '200px'
		},
		toolBar: {
			display: 'flex',
			borderBottom: '1px solid rgba(0,0,0,0.1)!important',
			borderTop: '1px solid rgba(0,0,0,0.1)!important',
			padding: '5pt 10pt 5pt 10pt',
			marginBottom: '2vh',
		},
		empty: {
			height: '100vh'
		},
	};
};

class Settings extends Component {
	handleBack = () => {
		const { clearError } = this.props;

		clearError();
		this.setState({applySettings: false});
		this.updateData();
	};

	componentDidMount() {
		const { selected } = this.props;
		
		if (selected?.terminal?.is_connected === false)
			return;

		this.updateData();
	}

	handlerSubmit = values => {
		const { fetchSaveSettings, selected } = this.props;
		const terminalId = selected.terminal.id;

		fetchSaveSettings({ terminal_id: terminalId, ...values });
	};

	updateData = () => {
		const { fetchSettings, selected } = this.props;
		const terminalId = selected.terminal.id;

		fetchSettings(terminalId);
	};

	render() {
		let { 
			classes,
			loading, 
			loadingTerminals, 
			settings, 
			user, 
			error, 
			selected,
			saveSettingsLoading
		} = this.props;

		loading = loading || saveSettingsLoading || loadingTerminals || !selected.terminal;

		saveSettingsLoading = loading === false ? false : saveSettingsLoading;

		const isTerminalConnected = selected.terminal.is_connected;

		return (
			<div className={classes.root}>
				{loading && (
					<>
						<div className={classes.loading}>
							<LinearProgress />
						</div>
						<div className={classes.empty}></div>
					</>
				)}
				{isTerminalConnected === false && (
					<>
						<div className={classes.toolBar}>
							<Tooltip title="Update" aria-label="Update">
								<Button color='secondary' onClick={this.updateData}>
									<Update/>
								</Button>
							</Tooltip>
						</div>
						<ErrorTerminal
							message={'Terminal is not connected'}
						/>
					</>
				)}
				{ isTerminalConnected && error.isError && (
						<div className={classes.toolBar} style={{'marginBottom': 0}}>
							<Tooltip title="Update" aria-label="Update" onClick={this.updateData}>
								<Button >
									<Update />
								</Button>
							</Tooltip>
						</div>
					)}
				{(saveSettingsLoading && loading && !error.isError) && (
					<div className={classes.applySettingsNotify}>
						<Typography variant="h4" component="p">
							Apply new settings. Please wait!
						</Typography>
					</div>
				)}
				{!loading && !saveSettingsLoading && !error.isError && isTerminalConnected && (
					<SettingForm
						terminalState={selected.terminal}
						onSubmit={this.handlerSubmit}
						initialValues={settings}
						superadmin={user.role_code === 'super_admin'}
						updateData={this.updateData}
						addClassFormSettingsTertminal={true}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
	settings: state.settings.settings,
	loading: state.settings.loading,
	saveSettingsLoading: state.settings.saveSettingsLoading,
	loadingTerminals: state.widgets.terminals.loading,
	error: state.settings.error,
	user: state.authorization.userData.user,
});

const mapDispatchToProps = {
	fetchSaveSettings,
	fetchSettings,
	clearError,
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles),
)(Settings);
