import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import FieldText from "../default-fields/FieldText";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from '@material-ui/core/Fade';
import {required , minLength} from "../formValidation";
import { compose } from 'redux';


let styles = theme => ({
	fixHeight: {
		maxHeight: 'max-content',
	},
	card: {
		marginBottom: '15px',
		maxWidth: '700px',
		boxShadow: 'none'
	},
	styleBtn: {
		marginRight: '10px',
	},
	cardContent: {
		paddingTop: '0px'
	},
	styleCopy: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	greenColor: {
		color: 'green'
	},
	redColor: {
		color: 'red'
	},
});

const min2 = minLength(2);

class FieldSystemControlForm extends Component {

	state = {
		tokenValue: "",
		copied: false,
		open: false,
	};

	static getDerivedStateFromProps(nextProps, prevState){
		const {tokenValue} = prevState;
		const authtoken = nextProps.upRemoteTunnelData.authtoken;
		if(prevState.tokenValue.length === 0){
			return {
				tokenValue: authtoken
			}
		}
	}

	handleChangeToken = (event) => {
		const {changeTokenRemoteTunnel} = this.props;
		let value = event.target.value;
		this.setState({
			tokenValue: value
		});
		changeTokenRemoteTunnel(value)
	};

	handleClick = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const {
			handleSubmit,
			classes,
			handleTokenOpen,
			handleTokenClose,
			upRemoteTunnelData,
			downRemoteTunnelData,
			initialValues
		} = this.props;
		const { tokenValue } = this.state;
		let sshToken = '';
		let url = upRemoteTunnelData.message;
		if( url.length > 0){
			if(upRemoteTunnelData.status !== 'ok' ){
				sshToken = upRemoteTunnelData.message + " : " + upRemoteTunnelData.description
			} else {
				let remoteUrl = upRemoteTunnelData.message;
				remoteUrl = remoteUrl.replace('tcp', 'http');
				const tunnelUrl = new URL(remoteUrl);
				const urlDomen = tunnelUrl.hostname;
				let urlPort = tunnelUrl.port;
				sshToken = `ssh ubuntu@${urlDomen} -oStrictHostKeyChecking=no -p ${urlPort}`
			}
		}

		// let sshToken = `ssh ubuntu@${urlDomen} -oStrictHostKeyChecking=no -p ${urlPort}`;
		return (
			<div>
				<form onSubmit={handleSubmit}>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h4" component="h2">
								Open Remote Tunnel
							</Typography>
						</CardContent>
						<CardContent>
							<Field
								name="authtoken"
								onChange={this.handleChangeToken}
								style={{maxWidth: '500px'}}
								component={FieldText}
								label="Ngrok auth token"
								validate={[required, min2]}
								placeholder="Enter authtoken"
								variant="filled"
								InputProps={{
									readOnly: false,
								}}
								fullWidth
							/>
						</CardContent>
						<CardContent className={classes.cardContent}>
							<Button
								onClick={() => handleTokenOpen(tokenValue)}
								className={classes.styleBtn}
								color='secondary'
								variant='contained'
								size="medium">
								Open
							</Button>
							<Button
								onClick={() => handleTokenClose(tokenValue)}
								color='secondary'
								variant='contained'
								size="medium">
								Close
							</Button>
						</CardContent>
						<CardContent className={classes.styleCopy}>
							<TextField
								error={upRemoteTunnelData.status==='error'? true: false}
								style={{marginRight: '30px', width:'500px'}}
								value={sshToken}
								id="outlined-read-only-input"
								label={upRemoteTunnelData.status==='error'? "SSH Error": "SSH Tunnel"}
								// defaultValue=""
								InputProps={{
									readOnly: true,
								}}
								onChange={({ target: { value } }) =>
									this.setState({ value, copied: false })
								}
								variant="outlined"
							/>
							<CopyToClipboard
								text={sshToken}
								onCopy={() => this.setState({ copied: true })}
							>
								<div>
								<Button
									onClick={this.handleClick}
									// onClick={handleTokenCopy}
									className={classes.styleBtn}
									color='secondary'
									variant='contained'
									size="medium">
									Copy
								</Button>
								<Snackbar
									open={this.state.open}
									onClose={this.handleClose}
									TransitionComponent={Fade}
									autoHideDuration={2000}
									ContentProps={{
										'aria-describedby': 'message-id',
									}}
									message={<span id="message-id">COPY: {sshToken}</span>}
								/>
								</div>
							</CopyToClipboard>

							{/*{this.state.copied ? (*/}
							{/*	<span style={{ color: "green" }}>Copied.</span>*/}
							{/*) : null}*/}
						</CardContent>

						{/*<CardContent className={classes.cardContent}>*/}
						{/*	<Typography variant="h6" component="h2" >*/}
						{/*		<span>Status: </span>*/}
						{/*		<span className={classNames(classes.bold, {*/}
						{/*			[classes.redColor]: upRemoteTunnelData.status === 'error',*/}
						{/*			[classes.greenColor]: upRemoteTunnelData.status !== 'error'*/}
						{/*		})}>{upRemoteTunnelData.status}</span>*/}
						{/*	</Typography>*/}
						{/*</CardContent>*/}
					</Card>
				</form>
			</div>
		)
	}

}

const mapStateToProps = (state, ownProps) => ({
	current: state.merchants.current,
	upRemoteTunnelData: state.testing.upRemoteTunnelData,
	error: state.settings.error,
	// errorHandler: state.merchants.error,
	initialValues: ownProps.upRemoteTunnelData
});


export default compose(
	connect(mapStateToProps),
	reduxForm({
		form: 'SystemControlForm', // a unique identifier for this form
		enableReinitialize: true,
		keepDirtyOnReinitialize: true,
		updateUnregisteredFields: true,
		destroyOnUnmount: false
		// asyncValidate
	}),
	withStyles(styles)
)(FieldSystemControlForm);