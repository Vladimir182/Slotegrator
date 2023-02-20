import React, { Component } from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import FieldText from '../default-fields/FieldText';
import FieldEncashment from './CassetteDispenserRow';
import Warning from './Warning';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { minLength, maxLength, regExpTest, validationRegs } from '../formValidation';
import { fetchStakedData } from '../../../ducks/dispenser';
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

		'& .MuiInputLabel-formControl': {
			top: '-2px',
			left: '2px',
			position: 'absolute'
		}
	},
	titleWrapper: {
		marginBottom: '20pt'
    },
    tableTittle: {
        margin: 0,
    },
    secondTitle: {
        margin: 0,
    }
});
const required = value => value ? '' : 'Required';
const lettersOnly = regExpTest(validationRegs.lettersOnly);
const min2 = minLength(2);
const max20 = maxLength(20);

const checkSpace = (event) => {
	if(event.which == 32) {
		 event.preventDefault();
		 return false;
	}
}
class TakenBillsForm extends Component {
	componentDidMount() {
		const { 
			fetchStakedData,
			stackedData,
			selected,
		} = this.props;

		if (!stackedData) {
			fetchStakedData(selected.terminal.id);
		}
	}

	componentDidUpdate(prevProps) {
		const setTakenBillsFormValid = this.props.setTakenBillsFormValid;
		if (prevProps.valid !== this.props.valid) {
			setTakenBillsFormValid(this.props.valid);
		}
	}
	handleReset() {
		const { handleResetForm, initialize } = this.props;
		
		handleResetForm('takenBills');
		initialize(this.props.formData);
	}
	render() {
		const {
			handleSubmit,
			errorHandler,
			textSubmit,
			classes,
			valid,
			dirty,
			billsData,
			disabledDenomination,
			updateInitValues,
			isFormReseted
		} = this.props;
		
		return (
			<div className={classes.root}>
				<div className={classes.titleWrapper}>
					<h2 className={classes.tableTittle}>Taken bills</h2>
					<p className={classes.secondTitle}>Here you should to set denomination and currency of taken bills.</p>
				</div>
				<form onSubmit={handleSubmit} className={classes.form}>
					<div className={`${classes.row} ${classes.rowSpacingPosition}`}>
						<Field
							autoComplete='off'
							name="first_name"
							component={FieldText}
							label="First name"
							placeholder="Enter your first name"
							variant="outlined"
							className={classes.userInput}
							validate={[required, min2, max20, lettersOnly]}
							onKeyPress={checkSpace}
						/>
						<Field
							autoComplete='off'
							name="last_name"
							component={FieldText}
							label="Last name"
							placeholder="Enter your last name"
							variant="outlined"
							className={classes.userInput}
							validate={[required, min2, max20, lettersOnly]}
							onKeyPress={checkSpace}
						/>
					</div>
						<FieldArray
							data={billsData}
							disabledDenomination={disabledDenomination}
							handleChange={updateInitValues}
							formName="takenBills"
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
							disabled={!dirty}
							size="medium"
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
							onClick={handleSubmit}
						>
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
	selected: state.selected,
	errorHandler: state.dispenser.error,
	initialValues: ownProps.formData,
	stackedData: state.dispenser.stacked_bills,
	user: state.authorization.userData.user,
});

const mapDispatchToProps = {
	fetchStakedData
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps),
	reduxForm({
		form: 'EncashmentDispanserTakenBillsForm', // a unique identifier for this form
		enableReinitialize: true,
		keepDirtyOnReinitialize: false,
		touchOnChange: true,
		destroyOnUnmount: false
	})
)(TakenBillsForm);
