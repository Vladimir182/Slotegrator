import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FieldText from '../default-fields/FieldText';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import InputAdornment from '@material-ui/core/InputAdornment';
import { positiveNumber, normalizeAll } from '../../../utils/helper';
import { required, minValue, maxValue } from '../formValidation';
import classNames from 'classnames';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		[theme.breakpoints.down('xs')]: {
			marginLeft: '0',
		}
	},
	input: {
		// maxWidth: '150px',
		maxWidth: '100%'
	},
	inputsWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
		flexGrow: 1,
		justifyContent: 'space-between',
		[theme.breakpoints.down('700')]: {
			width: '100%'
		},		
		'&>div': {
			width: 'calc(50% - 10px)'
		}
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		margin: '15px 0',
		[theme.breakpoints.down('700')]: {
			flexDirection: 'column',
			marginTop: '20px',
			'&:last-child': {
				marginBottom: '20px',
			},
		},
	},
	flexStart: {
		display: 'flex',
		justifyContent: 'flex-start',
	},
	customMargins: {
		// margin: '0 15px',
		[theme.breakpoints.down('700')]: {
			margin: 0
		}
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
	cassetteNumWrapper: {
		alignSelf: 'center',
		color: theme.palette.text.secondary,
		marginRight: '20pt',
		padding: '10px 0',
		minWidth: '85px',
		[theme.breakpoints.down('700')]: {
			minWidth: '98%',
			textAlign: 'center'
		}
	},
	hiddenFiledNoBorder: {
		'&>div::before': {
			borderBottom: 'none'
		}
	}
});

const maxValue5000 = maxValue(5000);
const minValue0 = minValue(0);

const FieldEncashment = ({
	fields,
	dynamicFields,
	classes,
	disabledDenomination,
	handleChange,
	formName,
	noCassets,
}) => {

	const data = fields.getAll();

	return (
		<div className={classes.root}>
			{fields.map((item, index, fields) => (
				<div className={classNames(classes.row, {[classes.flexStart]: noCassets })} key={index}>
					{ !noCassets ?
						<div className={classes.cassetteNumWrapper}>
							<span>Cassette {index + 1}</span>
						</div> : ''
					}
					<div className={classes.inputsWrapper}>
						<Field
							disabled={disabledDenomination}
							normalize={positiveNumber}
							name={`${item}.denomination`}
							type="number"
							variant="outlined"
							component={FieldText}
							label="Nominal"
							className={classNames(classes.input)}
							endAdornment={
								<InputAdornment position="end">
									{data[index].currency}
								</InputAdornment>
							}
						/>
						<Field
							normalize={positiveNumber}
							name={`${item}.amount`}
							type="number"
							component={FieldText}
							variant="outlined"
							label="Amount"
							onChange={(e) => handleChange([e, 'amount', index, formName])}
							className={classNames(classes.input, {[classes.customMargins]: noCassets })}
							validate={[required, maxValue5000, minValue0]}
							InputLabelProps={{
								shrink: true,
							}}
						/>
						<Field
							name={`${item}.currency`}
							className={`${classNames({[classes.customMargins]: noCassets})} ${classes.hiddenFiledNoBorder}`}
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
	)
};
FieldEncashment.defaultProps = {
	name: 'name',
	type: 'text'
};

FieldEncashment.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};
export default compose(
	withStyles(styles)
)(FieldEncashment);
