import React, { Component } from 'react';
import { Field, reduxForm, FieldArray, formValues } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import RadioButtonGroup from '../default-fields/RadioButtonGroup';
import EncashmentValidatorRow from './CassetteValidatorRow';
import { required, minLength, maxLength, regExpTest, validationRegs } from '../formValidation';
import notesNominals from '../../../utils/notesNominals'
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { compose } from 'redux';
// import {fetchGetAllRoles} from '../../../ducks/roles';

const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	root: {
		maxWidth: '400pt',
		minWidth: '400pt',
		[theme.breakpoints.down('lg')]: {
			minWidth: 'auto',
		},
		[theme.breakpoints.down('xs')]: {
			padding: '30px 10px'
		},
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
		[theme.breakpoints.only('xs')]: {
			margin: 0
		},
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		'&>div': {
			marginRight: '50px',
		},
		'&>div:nth-child(even)': {
			marginRight: 0
		},
		[theme.breakpoints.only('xs')]: {
			flexDirection: 'column',
			'&>div': {
				width: '100%',
				marginRight: 0,
				marginBottom: theme.spacing(2)
			},
		},
		'& .MuiInputLabel-formControl': {
			top: '-2px',
			left: '2px',
			position: 'absolute'
		}
	},
	// tableTittle: {
	// 	marginBottom: '20px',
	// 	color: theme.palette.type === 'dark' ? theme.palette.primary.contrastText : theme.palette.dark
	// },
	// secondTitle: {
	// 	marginBottom: '20px',
	// 	color: theme.palette.type === 'dark' ? theme.palette.primary.contrastText : theme.palette.dark
	// },
	error: {
		margin: '20px 0'
	}
});

const validate = values => {
	const errors = {};
	if (!values.encashmentChoice) {
		errors.encashmentChoice = 'Is required!';
	} else if (!values.first_name) {
		errors.first_name = 'Is required!';
	}

	return errors;
};

const min2 = minLength(2);
const max20 = maxLength(20);
const lettersOnly = regExpTest(validationRegs.lettersOnly)
const immediateRoleCode = ['super_admin', 'admin', 'merchant'];


const checkSpace = (event) => {
   if(event.which == 32) {
      event.preventDefault();
      return false;
   }
}
class EncashmentForm extends Component {
	
	componentDidMount(){
		// const {fetchGetAllRoles} = this.props;
		// fetchGetAllRoles();
	}

	render() {
		const {
			handleSubmit,
			currency,
			errorHandler,
			textSubmit,
			reset,
			classes,
			pristine,
			submitting,
			encashmentChoiceValue,
			statedValue,
			valid,
			user
		} = this.props;

		const	usersRoleCode = user.role_code;

		const isCreateButtonDisabled = encashmentChoiceValue === 'daily' && (!statedValue || (statedValue && !statedValue.length) || !valid);
		
		const isImmediateRoleCode = immediateRoleCode.indexOf(usersRoleCode) === -1;

		return (
			<div className={classes.root}>
				<div className={classes.titleWrapper}>
					<h2 className={classes.tableTittle}>Validator encashment</h2>
					<p className={classes.secondTitle}>Here you should to set denomination and currency of taken bills.</p>
				</div>
				<form onSubmit={handleSubmit} className={classes.form}>
					<div className={classes.row}>
						<Field
							autoComplete='off'
							name="first_name"
							component={FieldText}
							label="First name"
							placeholder="Enter your first name"
							variant="outlined"
							validate={[required, min2, max20, lettersOnly]}
							className={classes.userInput}
							onKeyPress={checkSpace}
						/>
						<Field
							name="last_name"
							component={FieldText}
							label="Last name"
							placeholder="Enter your last name"
							variant="outlined"
							validate={[required, min2, max20, lettersOnly]}
							className={classes.userInput}
							onKeyPress={checkSpace}
						/>
					</div>
					<Field component={RadioButtonGroup} name="encashmentChoice">
						<FormControlLabel
							className={classes.radio}
							value="immediate"
							control={<Radio color="secondary"/>}
							label="X (Immediate)"
							disabled={isImmediateRoleCode}
						/>
						<FormControlLabel
							className={classes.radio}
							value="daily"
							control={<Radio color="secondary" />}
							label="Z (Daily)"
						/>
					</Field>
					<FieldArray
						currency={currency}
						nominals={notesNominals}
						name="stated"
						component={EncashmentValidatorRow}
						isRequired={encashmentChoiceValue === 'daily' || encashmentChoiceValue === 'immediate'}
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
							disabled={pristine || submitting}
							className={classes.button}
							variant="contained"
							color="secondary"
							size="medium"
							onClick={reset}>
							Clear
						</Button>
						<Button
							disabled={isCreateButtonDisabled}
							className={classes.button}
							type="submit"
							variant="contained"
							color="secondary"
							size="medium"
							onClick={handleSubmit}>
							{textSubmit}
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	errorHandler: state.validator.error,
	initialValues: ownProps.formData,
	user: state.authorization.userData.user
});

// const mapDispatchToProps = {
// 	fetchGetAllRoles
// }

export default compose(
	withStyles(styles),
	connect(mapStateToProps),
	reduxForm({
		form: 'EncashmentValidatorForm', // a unique identifier for this form
		validate,
		touchOnChange: true
	}),
	formValues({encashmentChoiceValue: 'encashmentChoice'}),
	formValues({statedValue: 'stated'}),
)(EncashmentForm);
