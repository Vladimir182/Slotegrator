import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import timezones, { stringifyZone } from '../../../../utils/timezones';
const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)',
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

const AutocompleteTimeZone = ({
	classes,
	name,
	input,
	label,
	meta: { touched, error },
	fullWidth,
	children,
	...custom
}) => {
	
 	const setTimeZoneLabel = timezones.find(zone => zone.name === input.value);

	return  (
		<FormControl
			error={touched && error}
			className={fullWidth && classes.fullWidth}
		>
			<Autocomplete
				{...input}
				{...custom}
				value={setTimeZoneLabel?.label || ''}
				autoComplete={true}
				disableClearable={true}
				autoHighlight={true}
				onBlur={() => input.onBlur(input.value)}
				onChange={(event, value) => input.onChange((value.name) || '')}
				renderInput={(params) => {
					return (
						<TextField 
							className={classes.root}
							// value={input.value.name}
							{...params}
							placeholder={custom?.placeholder ?? ''}
							fullWidth={true}		
							variant="filled"/>
					)
				}}
			/>
			<FormHelperText htmlFor={name}>{touched && error}</FormHelperText>
		</FormControl>
	)
};

AutocompleteTimeZone.defaultProps = {
	name: 'name',
	type: 'text'
};

AutocompleteTimeZone.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default withStyles(styles)(AutocompleteTimeZone);
