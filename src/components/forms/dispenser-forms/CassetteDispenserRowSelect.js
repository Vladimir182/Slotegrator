import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FieldText from '../default-fields/FieldText';
import FieldSelect from '../default-fields/FieldSelect';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import InputAdornment from '@material-ui/core/InputAdornment';
import { positiveNumber, normalizeAll } from '../../../utils/helper';
import {required, minValue, maxValue } from '../formValidation';
import MenuItem from '@material-ui/core/MenuItem';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		[theme.breakpoints.down('xs')]: {
			margin: '0'
		}
	},
	input: {
		maxWidth: '100%',
		margin: '0 0px',
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '15px 0',
		[theme.breakpoints.down('700')]: {
			marginTop: '20px',
			'&:last-child': {
				marginBottom: '20px',
			},
			flexWrap: 'wrap',
			justifyContent: 'flex-start',
		}
	},
	inputsWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		width: 'calc(100% - 85px - 20px)',		
		
		[theme.breakpoints.down('700')]: {
			display: 'flex',
			flexWrap: 'wrap',
			width: '100%',
		},

		'& > div': {
			width: 'calc(33.33% - 40px/3)',
		}
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
		margin: '0 auto'
	},

	fullWidth: {
		width: '100%'
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	selectField: {
		width: '100%',
		marginRight: '0px',
	},
	cassetteNumWrapper: {
		alignSelf: 'center',
		color: theme.palette.text.secondary,
		marginRight: '20px',
		padding: '10px 0',
		minWidth: '85px',
		[theme.breakpoints.down('700')]: {
			minWidth: '98%',
			textAlign: 'center'
		}
	},
});

let maxValue5000 = maxValue(5000)
let minValue0 = minValue(0)
const notEmpty = value => !value || value.length === 0 ? 'Shouldn\'t be empty' : undefined

class FieldEncashmentSelect extends Component {
	state = {
		currencyValues: {}
	}
	static getDerivedStateFromProps(props, state) {
		if (props.fields) {
			const { fields } = props;
			let currencyValues = {};
			let data = fields.getAll();
			fields.map((item, index) => {
				currencyValues[item] = data[index].currency;
			})

			return {
				currencyValues: currencyValues
			}
		}
	}
	handleCurrencyChange([e, item, index]) {
		if (!e || !e.target || !e.target.value) return;
		const { handleChange, resetNominalField } = this.props;

		let { currencyValues } = this.state;
		let value = e.target.value;
		let newCurrencyValues = { ...currencyValues, [item]: value };
		resetNominalField(index);
		handleChange([e, 'currency', index, 'leftBills']);
		this.setState({ currencyValues: newCurrencyValues });
	}
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
	render() {
		const {
			fields,
			currencies,
			dynamicFields,
			classes,
			handleChange,
			disabledDenomination,
			meta: { error, submitFailed }
		} = this.props;
		const data = fields.getAll();
		const { currencyValues } = this.state;
		return (
			<div className={classes.root}>
				{fields.map((item, index) => (
					<div className={classes.row} key={index}>
						<div className={classes.cassetteNumWrapper}>
							<span>Cassette {index + 1}</span>
						</div>
						<div className={classes.inputsWrapper}>
							<Field
								name={`${item}.currency`}
								key={`${item}.currency`}
								type="text"
								placeholder="Currency"
								label="Currency"
								variant="outlined"
								component={FieldSelect}
								className={classes.selectField}
								onChange={(e) => this.handleCurrencyChange.call(this, [e, item, index, 'leftBills'])}
								validate={[required, notEmpty]}
								InputLabelProps={{
									shrink: true,
								}}
							>
							{currencies.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
							</Field>
							<Field
								// disabled={disabledDenomination}
								normalize={positiveNumber}
								name={`${item}.denomination`}
								key={`${item}.denomination`}
								type="number"
								component={FieldSelect}
								placeholder='Nominal'
								label="Nominal"
								variant="outlined"
								disabled={!currencyValues[item]}
								className={classes.selectField}
								onChange={(e) => handleChange([e, 'denomination', index, 'leftBills'])}
								validate={[required, notEmpty]}
								InputLabelProps={{
									shrink: true,
								}}
							>
							{this.getNominalsValues(currencyValues[item]).map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
							</Field>
							<Field
								normalize={positiveNumber}
								name={`${item}.amount`}
								key={`${item}.stated`}
								type="number"
								component={FieldText}
								label="Amount"
								size="slim"
								className={classes.input}
								onChange={(e) => handleChange([e, 'amount', index, 'leftBills'])}
								variant="outlined"
								validate={[required, maxValue5000, minValue0]}
								InputLabelProps={{
									shrink: true,
							}}
							/>
							<Field
								className={classes.rootHidden}
								name={`${item}.casset_id`}
								key={`${item}.casset_id`}
								type="hidden"
								component={FieldText}
							/> 
							{dynamicFields &&
								<Button onClick={() => fields.remove(index)}>
									<DeleteIcon />
								</Button>
							}
						</div>	
					</div>
				))}
				{dynamicFields && 
					<div className={classes.addBlock}>
						<Fab size="small" aria-label="Add" onClick={() => {
							fields.push({});
						}}>
							<AddIcon />
						</Fab>
					</div>
				}
			</div>
		);
	}
};
FieldEncashmentSelect.defaultProps = {
	name: 'name',
	type: 'text'
};

FieldEncashmentSelect.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};
export default compose(
	withStyles(styles)
)(FieldEncashmentSelect);
