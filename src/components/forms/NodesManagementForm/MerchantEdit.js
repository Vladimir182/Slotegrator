import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FieldText from '../default-fields/FieldText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { required, minLength, maxLength, regExpTest, validationRegs } from './../formValidation';
import { withStyles } from '@material-ui/core/styles';
import { debouncedCheckMerchantTitleoccupied } from '../../../ducks/merchants';
import { compose } from 'redux';

let styles = theme => ({
	fixHeight: {
		maxHeight: 'max-content',
	}
})

const urlReg = regExpTest(validationRegs.url);
const min2 = minLength(2);
const min0 = minLength(0);
const max20 = maxLength(20);
const max140 = maxLength(140);
const max255 = maxLength(255);

class MerchantEdit extends Component {
	render() {
		const { handleSubmit, ifError, handlerClose, classes } = this.props;
	
		return (
			<div>
				<form onSubmit={handleSubmit} className="MerchantEdit">
					<Dialog
						classes={{ paper: classes.fixHeight }}
						open={true}
						onClose={handlerClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							Edit Merchant
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Please fill in and send the application form below to edit the merchant data.
							</DialogContentText>
							<Field
								name="title"
								component={FieldText}
								label="Title"
								placeholder="Enter title"
								variant="filled"
								validate={[required, min2, max20]}
								fullWidth
							/>
							<Field
								name="callback_url"
								component={FieldText}
								label="Callback link"
								placeholder="Enter callback link"
								variant="filled"
								validate={[required, min0, max255, urlReg]}
								fullWidth
							/>
							<Field
								name="buyers_url"
								component={FieldText}
								label="Players in room callback"
								placeholder="Enter players in room callback"
								variant="filled"
								fullWidth
								validate={[max255, urlReg]}
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
	initialValues: ownProps.formData
});

export default compose(
	connect(mapStateToProps),
	reduxForm({
		form: 'EditMerchant',
		asyncValidate: debouncedCheckMerchantTitleoccupied,
		asyncChangeFields: ['title'],
		touchOnChange: true
	}),
	withStyles(styles)
)(MerchantEdit);
