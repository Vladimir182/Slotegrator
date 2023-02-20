import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
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
	}
});

const FieldSelect = ({
	classes,
	name,
	input,
	label,
	meta: { touched, error },
	fullWidth,
	children,
	endAdornment,
	...custom
}) => (
	<FormControl
		error={touched && error}
		className={fullWidth && classes.fullWidth}>
		<TextField
			select
			// hintText={label}
			name={name}
			label={label}
			// floatingLabelText={label}
			error={touched && error}
			InputProps={{
				classes: {
					input: classes.input,
					root: classes.root,
					focused: classes.root
				},
				endAdornment
			}}
			//onChange={(event, index, value) => input.onChange(value)}
			{...input}
			{...custom}
			children={children}
		/>

		<FormHelperText htmlFor={name}>{touched && error}</FormHelperText>
	</FormControl>
);
FieldSelect.defaultProps = {
	name: 'name',
	type: 'text'
};

FieldSelect.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};
export default compose(
	withStyles(styles)
)(FieldSelect);
