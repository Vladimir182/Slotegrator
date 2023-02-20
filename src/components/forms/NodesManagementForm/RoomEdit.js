import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import SelectTimeZone from './SelectTimeZone';
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
import timezones,{ stringifyZone } from '../../../utils/timezones';
import AutocompleteTimeZone from './SelectTimeZone/AutocompleteTimeZone';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { compose } from 'redux';

const titleTest = regExpTest(validationRegs.title);
const numbersTest = regExpTest(validationRegs.numbersOnly);
const timezoneTest = regExpTest(validationRegs.timezone);
const min1 = minLength(1);
const min2 = minLength(2);
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
class RoomEdit extends Component {
	render() {
		const {
			handleSubmit,
			RefreshKeys,
			ifError,
			handlerClose,
			classes
		} = this.props;
		return (
			<div>
				<form onSubmit={handleSubmit} className="RoomEdit">
					<Dialog
						classes={{ paper: classes.fixHeight }}
						open={true}
						onClose={handlerClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							Edit Room
						</DialogTitle>
						<DialogContent className={classes.content}>
							<DialogContentText>
								Please fill in and send the application form below to edit the room data.
							</DialogContentText>
							<Field
								name="title"
								component={FieldText}
								label="Title"
								placeholder="Enter title"
								variant="filled"
								validate={[min2, max20, titleTest]}
								fullWidth
							/>
							<Field
								name="club_name"
								component={FieldText}
								label="Club name"
								placeholder="Enter name"
								variant="filled"
								fullWidth
							/>
							<Field
								name="merchant_id"
								component={FieldText}
								label="Project id"
								variant="filled"
								validate={[required, min1, max20, numbersTest]}
								fullWidth
								disabled
							/>
							<Field
								name="public_key"
								component={FieldText}
								label="Public key"
								variant="filled"
								fullWidth
								disabled
							/>
							<Field
								name="private_key"
								component={FieldText}
								label="Private key"
								variant="filled"
								fullWidth
								disabled
							/>
							<Field
								name="timezone"
								component={AutocompleteTimeZone}
								options={timezones}
								popupIcon={<KeyboardArrowDownIcon color="action" />}
								getOptionLabel ={(item) => typeof item === 'string' ? item : stringifyZone(item, 'GMT')}
								label={'Room zone'}
								placeholder="Select time zone"
								variant="filled"
								validate={[min1, max32, timezoneTest]}
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
							{RefreshKeys && (
								<div style={{ width: '100%' }}>
									<Button
										onClick={RefreshKeys}
										color="secondary">
										Refresh Keys
									</Button>
								</div>
							)}
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
	initialValues: ownProps.formData
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps),
	reduxForm({
		form: 'RoomEdit', // a unique identifier for this form
		// asyncValidate
		enableReinitialize: true
	})
)(RoomEdit);
