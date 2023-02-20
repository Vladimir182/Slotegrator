import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import FieldSelect from '../default-fields/FieldSelect';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { required, minLength, maxLength, regExpTest, validationRegs } from '../formValidation';
import { compose } from 'redux';

const styles = theme => ({
	fixHeight: {
		maxHeight: 'max-content'
	}
});

const createUserNameTest = regExpTest(validationRegs.usersNumbersLettersOnly);
const passwordTest = regExpTest(validationRegs.password);
const min1 = minLength(1);
const min2 = minLength(2);
const min8 = minLength(8);
const max10 = maxLength(10);	
const max20 = maxLength(20);	
const max32 = maxLength(32);

class CreateUser extends Component {
	render() {
		const {
			handleSubmit,
			roles,
			textSubmit,
			title,
			handleClose,
			classes
		} = this.props;
		const rolesItems = _.map(roles, item => (
			<MenuItem key={item.id} value={item.id}>
				{item.role_name}
			</MenuItem>
		));
		return (
			<div>
				<form onSubmit={handleSubmit} className="CreateUser">
					<Dialog
						classes={{ paper: classes.fixHeight }}
						open={true}
						onClose={handleClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							{title}
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Please fill in and send the application form below to create a new user.
							</DialogContentText>
							<Field
								name="username"
								component={FieldText}
								label="Username"
								placeholder="Enter username"
								variant="filled"
								validate={[required, min2, max20, createUserNameTest]}
								fullWidth
							/>
							<Field
								name="password"
								type="password"
								component={FieldText}
								label="Password"
								placeholder="Enter password"
								variant="filled"
								validate={[required, min8, max32, passwordTest]}
								fullWidth
							/>
							<Field
								name="role_id"
								component={FieldSelect}
								label="Roles"
								placeholder="placeholder"
								variant="filled"
								validate={[required, min1, max10]}
								fullWidth
								Items={roles}>
								{rolesItems}
							</Field>
						</DialogContent>
						{/* {error.isError && (
							<Typography variant="body1" gutterBottom align="center" color="error">
								{error.message}
							</Typography>
						)} */}
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
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	error: state.users.error,
	initialValues: ownProps.formData,
	roles: state.roles.data,
	user: state.authorization.userData.user
});

export default compose(
	connect(mapStateToProps),
	reduxForm({
		form: 'UserForm', // a unique identifier for this form
		// asyncValidate
	}),
	withStyles(styles)
)(CreateUser);
