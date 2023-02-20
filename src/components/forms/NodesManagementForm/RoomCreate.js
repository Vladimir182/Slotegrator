import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldText from '../default-fields/FieldText';
// import FieldTimeZone from './SelectTimeZone';
import AutocompleteTimeZone from './SelectTimeZone/AutocompleteTimeZone'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { required, minLength, maxLength, regExpTest, validationRegs } from '../formValidation';
import { compose } from 'redux';
import timezones, { stringifyZone } from '../../../utils/timezones';
import { setTimeZone, getIntialTimeZone } from '../../../ducks/timezone';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const titleTest = regExpTest(validationRegs.title);
const numbersTest = regExpTest(validationRegs.numbersOnly);
const timezoneTest = regExpTest(validationRegs.timezone);
const min2 = minLength(2);
const min1 = minLength(1);
const max20 = maxLength(20);
const max32 = maxLength(32);
const styles = theme => {
	return {
		content: {
			overflowY: 'initial'
		},
		paper: {
			overflowY: 'initial'
		},
		fixHeight: {
			maxHeight: 'max-content',
		}
	};
};
class RoomCreate extends Component {
	render() {
		const { handleSubmit, currentTimezone, ifError, classes, handlerClose } = this.props;

		const timezonePlaceholder = 'Select timezone';
		// const timezoneValue = timezones.find(timezineItem => timezineItem.name === timezone);

		return (
			<div>
				<form onSubmit={handleSubmit} className="RoomCreate">
					<Dialog
						classes={{ paper: classes.fixHeight }}
						open={true}
						onClose={handlerClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							Create Room
						</DialogTitle>
						<DialogContent className={classes.content}>
							<DialogContentText>
								Please fill in and send the application form below to create a new room.
							</DialogContentText>
							<Field
								name="title"
								id="create-room-title"
								component={FieldText}
								label="Title"
								placeholder="Enter title"
								variant="filled"
								validate={[required, min2, max20, titleTest]}
								fullWidth
							/>
							<Field
								name="club_name"
								id="create-room-club"
								component={FieldText}
								label="Club name"
								placeholder="Enter name"
								variant="filled"
								fullWidth
							/>
							<Field
								name="merchant_id"
								component={FieldText}
								label="Merchant id"
								variant="filled"
								validate={[required, min1, max20, numbersTest]}
								fullWidth
								disabled
							/>
							<Field
								name="timezone"
								id="createRoom-timezone-select"
								component={AutocompleteTimeZone}
								options={timezones}
								popupIcon={<KeyboardArrowDownIcon color="action" />}
								getOptionLabel ={(item) => typeof item === 'string' ? item : stringifyZone(item, 'GMT')}
								label={'Room zone'}
								placeholder={timezonePlaceholder}
								variant="filled"
								validate={[required, min1, max32, timezoneTest]}
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
								type="submit"
								variant="contained"
								color="primary"
								size="medium">
								Save
							</Button>
						</DialogActions>
					</Dialog>
				</form>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	errorHandler: state.merchants.error,
	initialValues: ownProps.formData,
	currentTimezone: state.timezone.currentTimeZone,
});

const mapDispatchToProps = {
	setTimeZone
}

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps),
	reduxForm({
		form: 'RoomCreate', // a unique identifier for this form
		// asyncValidate
	}),
	withStyles(styles)
)(RoomCreate);
