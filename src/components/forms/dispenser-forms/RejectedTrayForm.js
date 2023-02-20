import React, { Component } from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import FieldEncashment from './CassetteDispenserRow';
import Warning from './Warning';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { compose } from 'redux';

const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	root: {
		maxWidth: '400pt',
		padding: '30px 30px',
		[theme.breakpoints.down('xs')]: {
			padding: '30px 10px'
		}
	},
	fullWidth: {
		width: '100%'
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
		margin: '0 10px',
		[theme.breakpoints.down('xs')]: {
			margin: '0'
		}
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		alignItems: 'flex-start',	
		'&>div':{
			width: 'calc(50% - 10px)',			
			[theme.breakpoints.down('600')]: {	
				width: '100%',		
				marginBottom: theme.spacing(4),	
				'&:last-child': {
					marginBottom: 0,	
				},
				'&>div': {
					width: '100%',
				}
			},	
			'&>div': {				
				marginLeft: '0px',
				marginRight: '0px',
			}
		},
	},
	titleWrapper: {
		marginBottom: '20pt'
    },
    tableTittle: {
        margin: 0,
    },
    secondTitle: {
        margin: 0,
	},
	namesField: {
		[theme.breakpoints.only('xs')]: {
			flexDirection: 'column'
		}
	}
});
const validate = values => {
	const errors = {};
	if (!values || !values.first_name || !values.last_name) {
		errors.encashmentChoice = 'Is required!';

	} 

	return errors;
};
class RejectedTrayForm extends Component {
	handleReset() {
		const { handleResetForm, initialize } = this.props;
		
		handleResetForm('rejectedTray');
		initialize(this.props.formData);
	}
	render() {
		const {
			handleSubmit,
			billsData,
			errorHandler,
			textSubmit,
			classes,
			valid,
			dirty,
			updateInitValues,
			disabledDenomination,
		} = this.props;
		return (
			<div className={classes.root}>
				<div className={classes.titleWrapper}>
					<h2 className={classes.tableTittle}>Rejected tray bills</h2>
					<p className={classes.secondTitle}>Here you should to set denomination and currency of taken bills from rejected tray.</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={classNames(classes.row, classes.namesField)}>
						<Field
							autoComplete='off'
							name="first_name"
							disabled={true}
							component={FieldText}
							label="First name"
							placeholder="Enter your first name"
							variant="outlined"
							className={classes.userInput}
						/>
						<Field
							autoComplete='off'
							name="last_name"
							disabled={true}
							component={FieldText}
							label="Last name"
							placeholder="Enter your last name"
							variant="outlined"
							className={classes.userInput}
						/>
					</div>
					<FieldArray
						data={billsData}
						disabledDenomination={disabledDenomination}
						handleChange={updateInitValues}
						formName='rejectedTray'
						noCassets={true}
						name="stated"
						component={FieldEncashment}
					/>
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
					<div className={classes.buttons}>
						<Button
							className={classes.button}
							variant="contained"
							color="secondary"
							size="medium"
							disabled={!dirty}
							onClick={this.handleReset.bind(this)}>
							Clear
						</Button>
						<Button
							className={classes.button}
							type="submit"
							variant="contained"
							color="secondary"
							size="medium"
							disabled={!valid}
							onClick={handleSubmit}>
							{textSubmit}
						</Button>
					</div>
					<Warning text="Warning: All fields are required!" />
				</form>
			</div>
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	errorHandler: state.dispenser.error,
	initialValues: ownProps.formData,
	user: state.authorization.userData.user,
});
export default compose(
	withStyles(styles),
	connect(mapStateToProps),
	reduxForm({
		form: 'EncashmentDispanserRejectedTrayForm', // a unique identifier for this form
		validate,
		enableReinitialize: true,
		keepDirtyOnReinitialize: false
		// asyncValidate
	})
)(RejectedTrayForm);
