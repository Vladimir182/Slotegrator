import React, { Component } from 'react';
import Form from '../components/forms/LoginForm';
import { loginRequest } from '../ducks/authorization';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { compose } from 'redux';

class Login extends Component {
	_onSubmit = e => {
		return this.props.loginRequest(e).catch(error => {
			throw error;
		});
	};
	render() {
		if (this.props.isAuth) {
			return (
				<Redirect
					to={{
						pathname: '/',
						state: { from: this.props.location }
					}}
				/>
			);
		}
		return (
			<Paper>
				<Form
					ifError={this.props.ErrorMessage || ''}
					onSubmit={this._onSubmit}
				/>
			</Paper>
		);
	}
}
const mapStateToProps = state => ({
	isAuth: state.authorization.isAuth,
	ErrorMessage: state.authorization.errorMessage
});
const mapDispatchToProps = {
	loginRequest
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps)
)(Login);
