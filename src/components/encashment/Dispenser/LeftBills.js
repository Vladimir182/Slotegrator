import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import currencies from '../../../utils/currencies';
import notesNominals from '../../../utils/notesNominals'
import LeftBillsForm from '../../forms/dispenser-forms/LeftBillsForm';
import { compose } from 'redux';

const SHADE = 50;
const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		display: 'flex',
		justifyContent: 'space-around'
	},
	table: {
		width: '700px',
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
	correct: {
		backgroundColor: green[SHADE]
	},
	unCorrect: {
		backgroundColor: red[SHADE]
    },
    formWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
		justifyContent: 'flex-start',
    },
	leftBillsForm: {
		[theme.breakpoints.down('xs')]: {
			width: '100%'
		}
	}
});

class LeftBills extends Component {
	getCurrencies() {
		const currenciesArr = [];
		currencies.map(item => {
			currenciesArr.push({
				value: item,
				label: item
			});
		});

		return currenciesArr;
	}
	render() {
		const { 
			classes, 
			userData, 
			handleSubmit, 
			initValues,
			handleChange, 
			handleResetForm, 
			resetNominalField,
			isTerminalConnected
		} = this.props;
		const currencies = this.getCurrencies();

		return (
			<div>
				<Paper className={classes.root}>
					<React.Fragment>
						<div className={classes.formWrapper}>
							<div className={classes.leftBillsForm}>
								<LeftBillsForm
									currencies={currencies}
									nominals={notesNominals}
									userData={userData}
									textSubmit="Create"
									disabledDenomination={false}
									onSubmit={handleSubmit}
									handleChange={handleChange}
									handleResetForm={handleResetForm}
									resetNominalField={resetNominalField}
									initValues={initValues}
									isTerminalConnected={isTerminalConnected}
								/>
							</div>
						</div>
					</React.Fragment>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

export default compose (
	withRouter,
	connect(mapStateToProps,{}),
	withStyles(styles)
)(LeftBills)
