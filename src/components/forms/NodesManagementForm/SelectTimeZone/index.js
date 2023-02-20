import React from 'react';
import PropTypes from 'prop-types';
import CustomTimePickerCreateRoom from './CustomeTimePickerCreateRoom';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

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

const FieldTimezonePicker = ({
	classes,
	name,
	input,
	label,
	meta: { touched, error },
	fullWidth,
	children,
	...custom
}) => (
	<FormControl
		error={touched && error}
		className={fullWidth && classes.fullWidth}>
		<CustomTimePickerCreateRoom
			{...input}
			{...custom}
			onBlur={() => input.onBlur(input.value)}
			handlerChange={e => input.onChange((e && e.name) || '')}
		/>

		<FormHelperText htmlFor={name}>{touched && error}</FormHelperText>
	</FormControl>
);

FieldTimezonePicker.defaultProps = {
	name: 'name',
	type: 'text'
};

FieldTimezonePicker.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default withStyles(styles)(FieldTimezonePicker);
