import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import Typography from '@material-ui/core/Typography';
import './style.scss';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { required, minLength, maxLength, regExpTest, validationRegs } from "../formValidation";

const validate = values => {
	const errors = {};
	if (values.password && values.password[0] === ' ') {
		errors.password = 'Space cannot be the first character!';
	}
	return errors;
};

const allTest = regExpTest(validationRegs.all);
const min2 = minLength(2);
const min1 = minLength(1);
const max32 = maxLength(32);	
const max100 = maxLength(100);	

class LoginForm extends Component {
	render() {
		const { handleSubmit, ifError, error } = this.props;
		return (
			<div className="LoginContainer">
				<FormControl>
					<form onSubmit={handleSubmit} className="LoginForm">
						<Typography align="center" variant="h3" gutterBottom>
							Login
						</Typography>
						<Field
							name="username"
							component={FieldText}
							label="Username"
							placeholder="Enter username"
							variant="filled"
							validate={[required, min2, max32]}
						/>
						<Field
							name="password"
							type="password"
							component={FieldText}
							label="Password"
							placeholder="Enter password"
							variant="filled"
							validate={[required, min1, max100, allTest]}
						/>
						{error && (
							<Typography
								variant="body1"
								gutterBottom
								align="center"
								color="error">
								{error}
							</Typography>
						)}
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="medium">
							Login
						</Button>
					</form>
				</FormControl>
			</div>
		);
	}
}

export default reduxForm({
	form: 'LoginForm', // a unique identifier for this form
	validate
	// asyncValidate
})(LoginForm);
