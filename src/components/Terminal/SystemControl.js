import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from "@material-ui/core/LinearProgress";
import {
	fetchUpRemoteTunnel,
	fetchDownRemoteTunnel,
	changeTokenRemoteTunnel,
	cleanAppRemoteTunnel
} from "../../ducks/testing";
import FieldSystemControlForm from "../forms/terminal-forms/FieldSystemControlForm";
import Update from '@material-ui/icons/RestorePage';
import Tooltip from "@material-ui/core/Tooltip";
import ErrorTerminal from "./ErrorTerminal";
import { compose } from 'redux';

const styles = theme => {
	return {
		root: {
			// paddingTop: '10px',
			'& .MuiButton-textSecondary': {
				minWidth: '48px',
				height: '48px',
				marginLeft: '10px',
				border: theme.palette.button.borderColor,
				borderRadius: theme.palette.button.radius,
				'&:hover':{
					backgroundColor: theme.palette.button.hover,
			}
		}
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		label: {
			textAlign: 'center',
			marginBottom: '20px'
		},
		bold: {
			fontWeight: '700',
			paddingLeft: '10px',
			marginRight: '10px'
		},
		caption: {
			marginLeft: '15px'
		},
		toolBar: {
			display: 'flex',
			borderBottom: '1px solid rgba(0,0,0,0.1)!important',
			borderTop: '1px solid rgba(0,0,0,0.1)!important',
			padding: '5pt 10pt',
			marginBottom: '2vh',
		},
		btnStyle: {
			justifyContent: 'space-between'
		}
	};
};


class SystemControl extends Component {
	state = {
		terminalState: null
	};

	updateSystemControl = () => {
		const {cleanAppRemoteTunnel} = this.props;
		cleanAppRemoteTunnel();
	};

	handleTokenOpen = (tokenValue) => {
		const {fetchUpRemoteTunnel, selected} = this.props;
		
		fetchUpRemoteTunnel(selected.terminal.id, tokenValue)
	};

	handleTokenClose = (tokenValue) => {
		const {fetchDownRemoteTunnel, selected} = this.props;

		fetchDownRemoteTunnel(selected.terminal.id, tokenValue);
	};

	render() {
		let { 
			classes, 
			loading, 
			loadingTerminals, 
			errorTerminals,
			upRemoteTunnelData, 
			downRemoteTunnelData,
			changeTokenRemoteTunnel,
			error,
			selected
		} = this.props;
		
			
		loading = loading || loadingTerminals;

		let errorMessage = error.isError ? error.message
			: errorTerminals.isError ? errorTerminals.message
			: (selected.terminal && !selected.terminal.is_connected)
			? 'Terminal is not connected.' : '';

		return (
			<div className={classes.root}>
				<div className={classes.loading}>
					{loading ? <LinearProgress/> : null}
				</div>
				<div className={classes}>
					<div className={classes.toolBar}>
						<Tooltip title="Update" aria-label="Update" onClick={this.updateSystemControl}>
							<Button color="secondary">
								<Update/>
							</Button>
						</Tooltip>
					</div>
				</div>
				{errorMessage ? (
					<ErrorTerminal message={errorMessage}/>
				) : (
					<FieldSystemControlForm
						handleTokenOpen={this.handleTokenOpen}
						handleTokenClose={this.handleTokenClose}
						upRemoteTunnelData={upRemoteTunnelData}
						downRemoteTunnelData={downRemoteTunnelData}
						changeTokenRemoteTunnel={changeTokenRemoteTunnel}
					/>
				)}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	loading: state.testing.loading,
	selected: state.selected,
	upRemoteTunnelData: state.testing.upRemoteTunnelData,
	downRemoteTunnelData: state.testing.downRemoteTunnelData,
	error: state.testing.errorSystemControl,
	errorTerminals: state.widgets.terminals.error,
	terminals: state.widgets.terminals.data,
	loadingTerminals: state.widgets.terminals.loading
});

const mapDispatchToProps = {
	fetchUpRemoteTunnel,
	fetchDownRemoteTunnel,
	changeTokenRemoteTunnel,
	cleanAppRemoteTunnel
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles),
)(SystemControl);
