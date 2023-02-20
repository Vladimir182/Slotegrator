import React, { Component } from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import Warning from './Warning';

import FieldEncashmentSelect from './CassetteDispenserRowSelect';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	root: {
		maxWidth: '400pt',
		padding: '30px 30px',
		[theme.breakpoints.down('xs')]: {
			padding: '30px 10px'
		}
	},
	fullWidth: {
		width: '100%'
	},
	buttons: {
		marginTop: '25px',
		display: 'flex',
		justifyContent: 'flex-end'
	},
	button: {
		marginLeft: '20px'
	},
	userInput: {
		margin: '0 10px',
		[theme.breakpoints.down('xs')]: {
			margin: '0'
		}
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		alignItems: 'flex-start',	
		'&>div':{
			width: 'calc(50% - 10px)',			
			[theme.breakpoints.down('600')]: {	
				width: '100%',		
				marginBottom: theme.spacing(4),	
				'&:last-child': {
					marginBottom: 0,	
				},
				'&>div': {
					width: '100%',
				}
			},	
			'&>div': {				
				marginLeft: '0px',
				marginRight: '0px',
			}
		},
	},
	titleWrapper: {
		marginBottom: '20pt'
    },
    tableTittle: {
		margin: 0,
    },
    secondTitle: {
		margin: 0,
    }
});
const validate = values => {
	const errors = {};
	if (!values || !values.first_name || !values.last_name) {
		errors.encashmentChoice = 'Is required!';

	} 

	return errors
};
class LeftBillsForm extends Component {

	handleReset() {
		const { reset, handleResetForm } = this.props;

		reset();
		handleResetForm('leftBills');
	}

	getIsFormFilled(initialValues) {
		const { stated } = initialValues;
		let result = true;

		stated.map(row => {
			if (row.amount === '' || row.denomination === '' || row.currency === '') {

				result = false;
			}
		})

		return result;
	}

	render() {
		const {
			handleSubmit,
			handleChange,
			errorHandler,
			currencies,
			nominals,
			textSubmit,
			classes,
			valid,
			disabledDenomination,
			resetNominalField,
			isTerminalConnected,
			initialValues,
			dirty,
			pristine,
			submitting
		} = this.props;

		const isFormFilled = this.getIsFormFilled(initialValues);

		return (
			<div className={classes.root}>
				<div className={classes.titleWrapper}>
					<h2 className={classes.tableTittle}>Left bills</h2>
					<p className={classes.secondTitle}>Here you should to set denomination and currency of bills /n that you going to left in cassetts.</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={classes.row}>
						<Field
							autoComplete='off'
							name="first_name"
							disabled={true}
							component={FieldText}
							label="First name"
							placeholder="Enter your first name"
							variant="outlined"
							className={classes.userInput}
						/>
						<Field
							autoComplete='off'
							name="last_name"
							disabled={true}
							component={FieldText}
							label="Last name"
							placeholder="Enter your last name"
							variant="outlined"
							className={classes.userInput}
						/>
					</div>
					<FieldArray
						disabledDenomination={disabledDenomination}
						handleChange={handleChange}
						resetNominalField={resetNominalField}
						currencies={currencies}
						nominals={nominals}
						dynamicFields={false}
						name="stated"
						component={FieldEncashmentSelect}
					/>
					{errorHandler.isError && (
						<Typography
							className={classes.error}
							variant="body1"
							gutterBottom
							align="center"
							color="error">
							{errorHandler.message}
						</Typography>
					)}
					<div className={classes.buttons}>
						<Button
							className={classes.button}
							variant="contained"
							color="secondary"
							size="medium"
							disabled={!dirty}
							onClick={this.handleReset.bind(this)}>
							Clear
						</Button>
						<Button
							className={classes.button}
							type="submit"
							variant="contained"
							color="secondary"
							size="medium"
							disabled={(!valid || !isFormFilled) && isTerminalConnected}
							onClick={handleSubmit}>
							{textSubmit}
						</Button>
					</div>
					<Warning text="Warning: All fields are required!" />
				</form>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	errorHandler: state.dispenser.error,
	initialValues: ownProps.formData,
    user: state.authorization.userData.user,
    initialValues: ownProps.initValues
});
export default compose(
	withStyles(styles),
	connect(mapStateToProps),
	reduxForm({
		form: 'EncashmentDispanserLeftBillsForm', // a unique identifier for this form
		// validate,
		enableReinitialize: true,
		keepDirtyOnReinitialize: false
		// asyncValidate
	})
)(LeftBillsForm); 
