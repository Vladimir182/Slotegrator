import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import classNames from 'classnames';
import _ from 'lodash';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { fetchCreateEncashment } from '../../ducks/validator';
import { fetchValidatorStatus } from '../../ducks/testing';
import PreloaderOverlay from '../../components/preloaders/PreloaderOverlay'
import ErrorTerminal from '../../components/Terminal/ErrorTerminal';
import EncashmentValidatorForm from '../../components/forms/ValidatorForm';
import { compose } from 'redux';

const SHADE = 'A200';
const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		padding: theme.spacing.unit  * 2,
		display: 'flex',
		justifyContent: 'space-around',
		[theme.breakpoints.between('xs','sm')]: {
			flexDirection: 'column'
		},
		[theme.breakpoints.only('xs')]: {
			padding: 0
		} 
	},
	table: {
		width: '700px',
		maxWidth: '40%',
		overflowX: 'auto',
		[theme.breakpoints.between('xs','sm')]: {
			width: '100%',
			maxWidth: 'none',
	  	},
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
	correct: {
		backgroundColor: `${green[SHADE]} !important`,

		'&:hover': {
			backgroundColor: `${green[SHADE]} !important`,
		}
	},
	unCorrect: {
		backgroundColor: `${red[SHADE]} !important`,

		'&:hover': {
			backgroundColor: `${red[SHADE]} !important`,
		}
	},
	formWrapper: {
		padding: 0
	}
});

class Validator extends Component {

	state = {
		encashmentChoice: null
	}

	handleSubmit = values => {
		const { fetchCreateEncashment, selected } = this.props;
			this.setState({
				encashmentChoice: values.encashmentChoice
			})
		if (selected.nodeType === 'terminal') {
			const data = { ...values };

			data.terminal_id = selected.terminal.id;
			data.stated = data.stated ?? [null];

			return fetchCreateEncashment(data);
		}
	};

	componentDidMount() {
		const { selected, fetchValidatorStatus } = this.props;

		if (!selected.terminal)
			return 
		
		fetchValidatorStatus(selected.terminal.id);
	}

	render() {
		let {
			loadingTesting,
			loadingTerminals,
			error,
			errorValidator,
			classes, 
			history, 
			selected, 
			encashment, 
			errorTerminals,
			validatorStatus
		} = this.props;

			const {encashmentChoice} = this.state;

		error = (error && error.isError) ? error
			: errorValidator.isError ? errorValidator
			: errorTerminals.isError ? errorTerminals
			: validatorStatus !== 'ok'? { message: 'Terminal is not ready' }
			: (selected.terminal && !selected.terminal.is_connected) ? { message: 'Terminal is not connected' }
			: null; 
		
		const loading = loadingTerminals || loadingTesting;

		return (
			<div>
				{
					selected.nodeType !== 'terminal'
					? <Redirect to="/" /> 
					: loading ? <PreloaderOverlay/>
					: <Paper className={classes.root}>
						{ error ? (
							<ErrorTerminal message={error.message} />
						) : (
								<React.Fragment>
									<div>
										<EncashmentValidatorForm
											currency={selected.terminal?.validator?.currency}
											textSubmit="Create"
											onSubmit={this.handleSubmit}
										/>
									</div>

									<div className={classes.table}>
										{ !encashmentChoice ? '' : encashmentChoice === 'daily' ? '' :
											<Table>
												<TableHead>
													<TableRow>
														<TableCell align={'center'}>
															{'Nominal'}
														</TableCell>
														<TableCell align={'center'}>
															{'Amount'}
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{_.map(
														encashment.stacked_bills,
														item => (
															<TableRow
																className={classNames({
																	[classes.correct]: encashment.is_correct,
																	[classes.unCorrect]: !encashment.is_correct
																})}>
																<TableCell align={'center'}>
																	{item.nominal}
																</TableCell>
																<TableCell align={'center'}>
																	{item.number}
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										}
									</div>
								</React.Fragment>
							)}
					</Paper>
				}
			</div>
		);
	}
}

Validator.defaultProps = {
	encashment: { stacked_bills: [] }
};

const mapStateToProps = state => ({
	selected: state.selected,
	encashment: state.validator.currentEncashment,
	errorTerminals: state.widgets.terminals.error,
	errorValidator: state.testing.errorValidator,
	validatorStatus: state.testing.validatorStatus.status,
	loadingTerminals: state.widgets.terminals.loading,
	loadingTesting: state.testing.loading
});

const mapDispatchToProps = {
	fetchCreateEncashment,
	fetchValidatorStatus
};

export default compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles),
)(Validator);
