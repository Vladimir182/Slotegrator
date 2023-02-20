import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import FormHelperText from '@material-ui/core/FormHelperText';
import classNames from 'classnames';

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
		'& input[type=number]': {
			'-moz-appearance': 'textfield'
		},
		'& input[type=number]::-webkit-outer-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0
		},
		'& input[type=number]::-webkit-inner-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0
		}
	},
	fullWidth: {
		width: '100%'
	},
	slim: {
		width: '100pt',
		[theme.breakpoints.only('xs')]: {
			width: '70pt'
		}
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
	paginationStyle: {
		'& .MuiInput-input': {
			'&[type=number]': {
				'-moz-appearance': 'textfield',
			},
			'&::-webkit-outer-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0,
			},
			'&::-webkit-inner-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0,
			},
		}

	}
});

const FieldText = (props) => {
const	{
	classes,
	name,
	input,
	label,
	meta: { touched, error, active },
	fullWidth,
	size,
	hidden,
	carefully,
	endAdornment,
	helperText,
	...custom
	} = props

	const inputRef = React.createRef();

	React.useEffect(() => {
		if (custom.type === 'number' && inputRef.current) {
			inputRef.current.addEventListener("keypress", evt => {
				if (evt.which === 8) {
				return;
				}
				if (evt.which < 48 || evt.which > 57) {
				evt.preventDefault();
				}
			});
		}
	  }, []);

	const formControlClasses = classNames({
		[classes.fullWidth]: fullWidth,
		[classes.slim]: size === 'slim'
	})

	return (
		<FormControl
			error={Boolean(helperText) && Boolean(!active) || Boolean(touched) && Boolean(error)}
			className={`${formControlClasses} ${classes.paginationStyle}`}
		>
			<TextField
				// hintText={label}
				inputRef={inputRef}
				value={input.value}
				name={name}
				label={label}
				// errorText={Boolean(touched) && Boolean(error)}
				// floatingLabelText={label}
				error={Boolean(touched) && Boolean(error)}
				// type={hidden || 'text'}
				InputProps={{
					classes: {
						input: classes.input,
						root: classes.root,
						focused: classes.root
					},
					endAdornment
				}}
				onKeyPress={(e) => {
					if (input.value.length === 0 && e.which === 32) {
						e.preventDefault();
						}
					}}
				FormHelperTextProps={{
					classes: {
						root: carefully ? classes.carefully : {}
					}
				}}
				{...input}
				{...custom}
			/>
			<FormHelperText htmlFor={name}>{!active && helperText || touched && error}</FormHelperText>
		</FormControl>
	)
};
FieldText.defaultProps = {
	name: 'name',
	type: 'text',
	carefully: false
};

FieldText.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default withStyles(styles)(FieldText);
