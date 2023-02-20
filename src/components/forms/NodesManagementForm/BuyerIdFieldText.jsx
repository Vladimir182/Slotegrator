import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	root: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	fullWidth: {
		width: '100%'
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	carefully: {
		color: amber['600']
	},
	halperText: {
		color: '#ffb300',
		padding: '8px 12px 0',
		fontSize: '0.75rem'
	},
});

const BuyerIdTextField = ({
	classes,
	name,
	input,
	label,
	meta: { touched, error },
	fullWidth,
	hidden,
	carefully,
	endAdornment,
	helperText,
	isBuyerId,
	...custom
}) => (
	<FormControl
		error={touched && error}
		className={fullWidth && classes.fullWidth}>
		<TextField
			// hintText={label}
			name={name}
			label={label}
			errorText={touched && error}
			// floatingLabelText={label}
			error={touched && error}
			// type={hidden || 'text'}
			InputProps={{
				classes: {
					input: classes.input,
					root: classes.root,
					focused: classes.root
				},
				endAdornment
			}}
			FormHelperTextProps={{
				classes: {
					root: carefully ? classes.carefully : {}
				}
			}}
			{...input}
			{...custom}
		/>
		<FormHelperText className={classes.halperText} htmlFor={name}>{helperText}</FormHelperText>
	</FormControl>
);
BuyerIdTextField.defaultProps = {
	name: 'name',
	type: 'text',
	carefully: false
};

BuyerIdTextField.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default withStyles(styles)(BuyerIdTextField);
