import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import {withStyles} from '@material-ui/core/styles';
import {DateTimePicker} from "material-ui-pickers";
import { compose } from 'redux';
import { KeyboardDateTimePicker } from '@material-ui/pickers';

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
		},
		'& .MuiFormHelperText-root':{
			color:'red'
		},
		'& .MuiIconButton-root': {
			color: theme.palette.iconColor,
			padding: theme.spacing(2),
			'&:hover': {
				backgroundColor: theme.palette.button.background
			}
		},
	},
	fullWidth: {
		width: '100%'
	}
});

const CustomDateTimePicker = (props) => {

	const { 
		classes,
		name,
		input,
		label,
		meta,
		fullWidth,
		children,
		active,
		...custom} = props;

	const value = (meta.initial && !meta.touched && !input.value) ? meta.initial : input.value;

	return (
		<FormControl
			error={meta.touched && meta.error}
			className={fullWidth && classes.fullWidth}
		>
			<KeyboardDateTimePicker
				color="primary"
				inputVariant="outlined"
				format="YYYY-MM-DD HH:mm"
				className={classes.root}
				name={input.name}
				label={label}
				{...input}
				{...custom}
				value={value}
				invalidLabel="Unknown"
				error={!meta.valid}
				InputLabelProps={{
					shrink: true,
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