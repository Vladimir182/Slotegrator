import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FieldTextValidatorAmount from '../default-fields/FieldTextValidatorAmount';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import InputAdornment from '@material-ui/core/InputAdornment';
import { positiveNumber, normalizeAll } from '../../../utils/helper';
import FieldSelectValidatorNominal from '../default-fields/FieldSelectValidatorNominal';
import MenuItem from '@material-ui/core/MenuItem';
import Zoom from '@material-ui/core/Zoom';
import { compose } from 'redux';
import { required } from '../formValidation';

const styles = theme => ({
	currency: {
		position: 'absolute',
		left: '100%',
		width: '2px',
		marginLeft: '5px'
	},
	row: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'stretch',
		marginBottom: '10px',
		'&: last-child': {
			marginBottom: 0
		},
	},
	rowBlock: {
		width: '50%'
	},
	addBlock: {
		display: 'flex',
		justifyContent: 'center',
		margin: '20px 0'
	},
	button: {
		position: 'relative',
		bottom: '-15px'
	},

	fullWidth: {
		width: '100%'
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	root: {
		width: '100%',
		margin: 'auto',
		'& .MuiFormControl-root': {
			minWidth: '100px',
		},
		'& .MuiFormControl-root:first-child': {
			marginRight: '50px',
			position: 'relative'
		}
	}
});

class EncashmentValidatorRow extends React.Component{
	getNominalsValues(currency) {
		const { nominals } = this.props;
		const nominalsArr = nominals[currency]
		? nominals[currency].map(item => ({
			value: item,
			label: item
		}))
		: []; 
		return nominalsArr;
	}

	render(){
		const {
			currency,
			classes,
			fields,
			isRequired,
			meta: { error, submitFailed }
		} = this.props;

		const validate = [];

		if (isRequired)
			validate.push(required);

		return (
			<div className={classes.root}>
				{fields.map((money, index) => (
					<Zoom in={true} key={index}>
						<div className={classes.row}>
							<Field
								normalize={positiveNumber}
								name={`${money}.nominal`}
								type="number"
								color="secondary"
								component={FieldSelectValidatorNominal}
								label="Nominal"
								className={classes.input}
								variant="standard"
								validate={validate}
								endAdornment={
									<InputAdornment className={classes.currency} position="end">
										{currency}
									</InputAdornment>
								}
							>
									{this.getNominalsValues(currency).map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Field>
							<Field
								normalize={positiveNumber}
								name={`${money}.number`}
								type="number"
								component={FieldTextValidatorAmount}
								label="Amount"
								className={classes.input}
								validate={validate}
							/>
							<Button className={classes.button} onClick={() => fields.remove(index)}>
								<DeleteIcon color="secondary" />
							</Button>
						</div>
					</Zoom>
				))}
				<div className={classes.addBlock}>
					<Fab size="small" color="secondary" aria-label="Add" onClick={() => fields.push()}>
						<AddIcon />
					</Fab>
				</div>
			</div>
		)
	}
}
					
EncashmentValidatorRow.defaultProps = {
	name: 'name',
	type: 'text'
};

EncashmentValidatorRow.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default compose(
	withStyles(styles)
)(EncashmentValidatorRow);
