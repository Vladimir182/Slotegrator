import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import FormGroup from '@material-ui/core/FormGroup';
import FieldText from '../default-fields/FieldText';
import FieldSelect from '../default-fields/FieldSelect';
import { connect } from 'react-redux';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Save from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { required, minLength, maxLength, regExpTest, validationRegs } from './../formValidation';
import { compose } from 'redux';

const styles = theme => {
	return {
		dialog: {
			maxWidth: 'unset'
		},
		inputWidth100: {
			width: '100%'
		},
		container: {
			display: 'flex',
			flexWrap: 'wrap'
		},
		formGroup: {
			margin: '10px',
			minWidth: '400px',
			maxWidth: '600px'
		},
		label: {
			textAlign: 'center',
			marginBottom: '20px'
		}
	};
};
//[startup, encashment, hot_fix
const UpdateType = [
	{
		text: 'Startup',
		value: 'startup'
	},
	{
		text: 'Encashment',
		value: 'encashment'
	},
	{
		text: 'Hotfix',
		value: 'hot_fix'
	}
];
const allTest = regExpTest(validationRegs.all);
const versionTest = regExpTest(validationRegs.version);
const updateTypeTest = regExpTest(validationRegs.updateType);
const urlTest = regExpTest(validationRegs.url);
const min0 = minLength(0);
const min1 = minLength(1);
const max19 = maxLength(19);
const max100 = maxLength(100);
const max140 = maxLength(140);
const max2000 = maxLength(2000);
class TerminalDriversForm extends Component {
	render() {
		const {
			handleSubmit,
			classes,
			superadmin,
			protocol,
			title,
			terminalState,
			ifError,
			handleClose,
			textSubmit,
			subTitleText
		} = this.props;

		const updateTypeItems = _.map(UpdateType, item => (
			<MenuItem key={item.value} value={item.value}>
				{item.text}
			</MenuItem>
		));
		return (
			<Fragment>
				<form>
					<Dialog
						classes={{ paper: classes.dialog }}
						open={true}
						onClose={handleClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							{title}
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{subTitleText}
							</DialogContentText>

							<Field
								name="app_version"
								component={FieldText}
								label="App version"
								placeholder='Driver version example "2.1.2.0"'
								variant="filled"
								validate={[required, min1, max19, versionTest]}
								fullWidth
							/>
							<Field
								name="description"
								component={FieldText}
								label="Description"
								placeholder="Description for current update"
								variant="filled"
								validate={[min0, max2000, allTest]}
								fullWidth
							/>
							<Field
								name="link"
								component={FieldText}
								label="Link"
								placeholder="Link to download the current update"
								variant="filled"
								validate={[required, min0, max140, urlTest]}
								fullWidth
							/>
							<Field
								name="update_type"
								component={FieldSelect}
								label="Update type"
								placeholder="Enter dispenser model"
								variant="filled"
								validate={[required, min0, max100, updateTypeTest]}
								fullWidth>
								{updateTypeItems}
							</Field>
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
							<Button onClick={handleClose} color="primary">
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								type="submit"
								variant="contained"
								color="primary"
								size="medium">
								{textSubmit}
							</Button>
						</DialogActions>
					</Dialog>
				</form>
			</Fragment>
		);
	}
}

TerminalDriversForm = reduxForm({
	form: 'TerminalDriversForm', // a unique identifier for this form
	enableReinitialize: true
})(withStyles(styles)(TerminalDriversForm));
// const selector = formValueSelector('TerminalDriversForm');
const mapStateToProps = state => ({
	current: state.merchants.current,
	settings: state.settings.settings,
	loading: state.settings.loading,
	error: state.settings.error,
	user: state.authorization.userData.user
	// protocol: selector(state, 'validatorProtocol')
});

export default compose(
	connect(mapStateToProps)
)(TerminalDriversForm);
