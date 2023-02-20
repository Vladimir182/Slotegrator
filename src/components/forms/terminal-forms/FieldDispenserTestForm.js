import React, {Component} from 'react';
import {Field, reduxForm, FieldArray} from 'redux-form';
import FieldText from '../default-fields/FieldText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {positiveNumber} from "../../../utils/helper";
import FieldSelect from "../default-fields/FieldSelect";
import MenuItem from "@material-ui/core/MenuItem";
import { compose } from 'redux';

const styles = theme => ({
	// input: {
	// 	backgroundColor: 'rgba(0,0,0,0)',
	// 	'&:focus': {
	// 		backgroundColor: 'rgba(0,0,0,0)'
	// 	}
	// },
	root: {
		minWidth: '350px',
		maxWidth: '600px',
		padding: '22px 0'
	},
	btnStyle: {
		width: '200px',
		marginRight: '10px',
		padding: '8px',  
		fontSize: '16px'
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
		margin: '0 10px'
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	row: {
		display: 'flex',
		alignItems: 'center',
		padding: '8px 17px'
	},
	error: {
		margin: '20px 0'
	},
	rowBlock: {
		width: '50%'
	},
	selectField:{
		width:'150px'
	},
	MuiFormControl:{
		width: '100px'
	}
});
const required = value => value ? undefined : 'Required';
const maxValue = max => value =>
	value && Number(value) > Number(max) ? `Max amount ${max}` : undefined;
const maxValue10000 = maxValue(10000);
const validate = values => {
	const errors = {};
	if (!values || !values.first_name || !values.last_name) {
		errors.encashmentChoice = 'Is required!';
	}
	return errors
};

class FieldDispenserTestForm extends Component {
	handleReset() {
		const {reset, handleResetForm} = this.props;

		reset();
		handleResetForm('leftBills');
	}

	getCurrenciesValues(currencies) {

		const currenciesArr = currencies.length
			? currencies.map(item => ({
				value: item,
				label: item
			}))
			: [];

		return currenciesArr;
	}

	render() {
		const {
			handleSubmit,
			handleChange,
			errorHandler,
			handleButton,
			handleCurrencyChange,
			handleAmountChange,
			currencies,
			nominals,
			textSubmit,
			classes,
			currencyError,
			amountError,
			valid,
			disabledDenomination,
			resetNominalField,
			pristine,
			submitting
		} = this.props;
		const currenciesItems = this.getCurrenciesValues(currencies);
		return (
			<div className={classes.root}>
				<form onSubmit={handleSubmit}>
					<div className={classes.row}>
						<Button className={classes.btnStyle}
						        variant="contained"
						        color="secondary"
						        onClick={e => handleButton('ask-dispense')}
						        disableElevation>
							Ask For Dispense
						</Button>
						<Field
							color="secondary"
							error={amountError}
							normalize={positiveNumber}
							name={`number`}
							type="number"
							component={FieldText}
							label="Amount"
							className={`${classes.selectField} ${classes.MuiFormControl}`}
							onChange={handleAmountChange}
							validate={[required, maxValue10000]}
						/>
					</div>

					<div className={classes.row}>
						<Button className={classes.btnStyle}
						        variant="contained"
						        color="secondary"
						        onClick={e => handleButton('dispense')}
						        disableElevation>
							Dispense
						</Button>
						<Field
							error={currencyError}
							name={`currency`}
							key={`currency`}
							type="text"
							placeholder="Currency"
							label="Currency"
							component={FieldSelect}
							color="secondary"
							className={`${classes.selectField} ${classes.MuiFormControl}`}
							onChange={handleCurrencyChange}
							validate={[required]}>
							{currenciesItems.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Field>
					</div>
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
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	errorHandler: state.dispenser.error,
	// initialValues: ownProps.formData,
	user: state.authorization.userData.user,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps),
	reduxForm({
		form: 'EncashmentDispanserTestForm', // a unique identifier for this form
		validate,
		enableReinitialize: true,
		// asyncValidate
	})
)(FieldDispenserTestForm);
