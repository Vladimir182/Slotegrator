import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import FieldCheckBox from '../default-fields/FieldCheckBox';
// import FieldAutocomplete from '../default-fields/FieldAutocomplete';
import NewFieldAutocomplete from '../default-fields/NewFieldAutocomplete';
// import NewBuyerIdFieldAutocomplete from './BuyerIdFieldAutocomplete';
import NewBuyerIdFieldAutocomplete from './NewBuyerIdFieldAutocomplete';
import BuyerIdFieldText from './BuyerIdFieldText';
import { required, minLength, maxLength, regExpTest, validationRegs } from '../formValidation';
import { fetchBuyersId } from '../../../ducks/merchants'; 

import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import currencies from '../../../utils/currencies';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { compose } from 'redux';

let styles = theme => ({
	overflowVisible: {
		overflow: 'visible',
		'&>div>div': {
			overflow: 'visible'
		}
	},
	fixHeight: {
		maxHeight: 'max-content',
	}
})

const validate = values => {
	const errors = {};
	if (!values.terminal_id) {
		errors.terminal_id = 'Is required!';
	} else if (!values.terminal_password) {
		errors.terminal_password = 'Is required!';
	}
	return errors;
};

const numtersTest = regExpTest(validationRegs.numbersOnly);
const lettersTest = regExpTest(validationRegs.lettersOnly);
const min1 = minLength(1);
const min2 = minLength(2);
const min3 = minLength(3);
const min8 = minLength(8);
const max3 = maxLength(3);	
const max20 = maxLength(20);
const max32 = maxLength(32);

const buyerIdWarningText = "WARRNING: When binding a buyer_id (player) to the terminal, please be aware that the terminal will be locked to a specified buyer_id (player). In case that the player(buyer_id) needs to be assigned to a different terminal, setting should be reconfigured through the form above. Always check if the terminal is locked to the correct buyer_id (player).";
const buyerIdDisabledText = "When ATM mode is enabled buyer id should be empty.";

class TerminalCreate extends Component {
	state = {
		currencyTypes: currencies,
	}

	componentDidMount() {
		const roomId = this.props.roomData.id;
		const { fetchBuyersId, buyersId, merchantData } = this.props;
			
		if (merchantData.buyers_url && !buyersId) {
			fetchBuyersId(roomId);
		}
	}

	componentDidUpdate() {
		const { removeFieldBuyer, one_to_all, buyer_id } = this.props;
		if (one_to_all && buyer_id !== '') removeFieldBuyer();
	}

	parceFieldObjectValue(value) {
		if (value && value.value) {
			return String(value.value);
		}
		return String(value);
	}

	handlerOnlyNumbers = (e) => {
		if( e.which < 48 || e.which > 57 ){
			e.preventDefault();
			return false
		}
	}
	render() {
		const {
			handleSubmit,
			one_to_all,
			ifError,
			buyer_id,
			currency,
			handlerClose,
			buyersId,
			merchantData,
			classes,
			errorHandler
		} = this.props;

		const disabledSubmit = !((one_to_all || buyer_id) && currency);
		const { currencyTypes } = this.state;
		const buyerIdWarn = one_to_all ? buyerIdDisabledText : buyerIdWarningText;

		// don't remove
		const buyerIdFieldComponent = merchantData.buyers_url ? NewBuyerIdFieldAutocomplete : BuyerIdFieldText;
		return (
			<div>
				<form onSubmit={handleSubmit} className="TerminalCreate">
					<Dialog
						className={classes.overflowVisible}
						classes={{ paper: classes.fixHeight }}
						open={true}
						onClose={handlerClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							Create Terminal
						</DialogTitle>
						<DialogContent className={classes.overflowVisible}>
							<DialogContentText>
								Please fill in and send the application form below to create a new terminal.
							</DialogContentText>
							<Field
								name="terminal_id"
								component={FieldText}
								label="Terminal ID (only Numbers)"
								placeholder="Enter Terminal ID"
								variant="filled"
								validate={[required, min1, max20, numtersTest]}
								fullWidth
								helperText={errorHandler.isError === false ? "" : "Enter an existing id terminal"}
								onKeyPress={this.handlerOnlyNumbers}
							/>
							<Field
								name="terminal_password"
								component={FieldText}
								label="Terminal password"
								placeholder="Enter Terminal password"
								variant="filled"
								validate={[required, min8, max32]}
								fullWidth
							/>
							<Field
								name="currency"
								onKeyPress={(e)=>{
									e.preventDefault();
									return false;
								}}
								component={NewFieldAutocomplete}
								popupIcon={<KeyboardArrowDownIcon color="action" />}
								parse={(value) => this.parceFieldObjectValue(value)}
								label="Terminal currency"
								placeholder="Enter Terminal currency"
								options={currencies}
								validate={[required, min3, max3, lettersTest]}
							/>
							<Field
								name="buyer_id"
								component={buyerIdFieldComponent}
								popupIcon={<KeyboardArrowDownIcon color="action" />}
								parse={(value) => this.parceFieldObjectValue(value)}
								label="Buyer id"
								variant="filled"
								options={buyersId}
								placeholder="Buyer ID"
								validate={[min2, max20]}
								disabled={one_to_all}
								helperText={buyerIdWarn}
								fullWidth
							/>
							<Field
								name="printer"
								component={FieldCheckBox}
								label="Printer"
								variant="filled"
								carefully
								fullWidth
							/>
							<Field
								name="validator"
								component={FieldCheckBox}
								label="Validator"
								variant="filled"
								carefully
								fullWidth
							/>
							<Field
								name="dispenser"
								component={FieldCheckBox}
								label="Dispenser"
								variant="filled"
								carefully
								fullWidth
							/>
							<Field
								name="one_to_all"
								component={FieldCheckBox}
								label="ATM mode"
								variant="filled"
								carefully
								fullWidth
							/>
						</DialogContent>
						{ifError && (
							<Typography
								variant="body1"
								gutterBottom
								align="center"
								color="error">
								{ifError}
							</Typography>
						)}
						<DialogActions>
							<Button onClick={handlerClose} color="primary">
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								disabled={disabledSubmit}
								type="submit"
								variant="contained"
								color="primary"
								size="medium">
								Create
							</Button>
						</DialogActions>
					</Dialog>
				</form>
			</div>
		);
	}
}

const selector = formValueSelector('TerminalCreate');

const mapDispatchToProps = dispatch => {
	return {
		removeFieldBuyer: () => dispatch(change('TerminalCreate', 'buyer_id', '')),
		fetchBuyersId: (roomId) => fetchBuyersId(dispatch, roomId),
	};
}

const mapStateToProps = (state, ownProps) => {
	
	return {
		errorHandler: state.merchants.error,
		initialValues: ownProps.formData,
		one_to_all: selector(state, 'one_to_all'),
		currency: selector(state, 'currency'),
		buyer_id: selector(state, 'buyer_id'),
		buyersId: state.merchants.buyersId
	};
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	reduxForm({
		form: 'TerminalCreate', // a unique identifier for this form
		validate,
		touchOnChange: true
		// asyncValidate
	}),
	withStyles(styles)
)(TerminalCreate);
