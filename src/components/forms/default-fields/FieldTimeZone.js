import React from 'react';
import PropTypes from 'prop-types';
import TimezonePicker from '../../TimezonePicker';
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
	<FormControl error={touched && error} className={fullWidth && classes.fullWidth}>
		<TimezonePicker
			name={name}
			label={label}
			InputProps={{
				classes: {
					input: classes.input,
					root: classes.root,
					focused: classes.root
				}
			}}
			// floatingLabelText={label}
			error={touched && error}
			{...input}
			{...custom}
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
export default compose(
	withStyles(styles)
)(FieldTimezonePicker);
