import React from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import {withStyles} from '@material-ui/core/styles';
import {DatePicker} from "@material-ui/pickers";
import { compose } from 'redux';

const styles = theme => ({

	root: {
		'& .MuiInputLabel-outlined': {
      	color: theme.typography.color,

		'& .MuiInputBase-formControl': {
			border: '1px solid red'
		}
    },
	},
	fullWidth: {
		width: '100%'
	}
});

const CustomDateTimePicker = ({
      classes,
      name,
      input,
      label,
      meta,
      fullWidth,
      children,
      ...custom
   }) => {
	// const value = (meta.initial && !meta.touched && !input.value) ? meta.initial : input.value;
	const value = (meta.initial) ? meta.initial : input.value;
	return (
		<FormControl
			error={meta.touched && meta.error}
			className={fullWidth && classes.fullWidth}
		>
			 <DatePicker
			 		className={classes.root}
					name={input.name}
					label={label}
					{...input}
					{...custom}
					inputVariant="outlined"
					value={value}
					error={!meta.valid}
					InputProps={{ 
						disableUnderline: true
					 }}
				/>
			<FormHelperText htmlFor={name} style={{color: 'red'}}>{!meta.valid && meta.error}</FormHelperText>
		</FormControl>
	)
};
CustomDateTimePicker.defaultProps = {
	name: 'name',
	type: 'text'
};

CustomDateTimePicker.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default compose(
	withStyles(styles)
)(CustomDateTimePicker);