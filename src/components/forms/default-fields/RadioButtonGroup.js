import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RadioButtonGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { compose } from 'redux';

const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	radioGroup: {
		display: 'flex',
		width: '100%',
		justifyContent: 'space-around',
		flexDirection: 'row',
		flexWrap: 'nowrap'
	},
	root: {
		marginTop: '20px',
		marginBottom: '20px'
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	error: {
		color: theme.palette.error.main,
		textAlign: 'center'
	}
});

const RadioGroup = ({ input, classes, meta: { touched, error }, ...rest }) => (
	<div className={classes.root}>
		<RadioButtonGroup
			{...input}
			{...rest}
			className={classes.radioGroup}
			valueSelected={input.value}
			onChange={(event, value) => input.onChange(value)}
		/>
		<div className={classes.error}>
			<Typography variant="p" component="p">
				{touched && error}
			</Typography>
		</div>
	</div>
);
RadioGroup.defaultProps = {
	name: 'name',
	type: 'text'
};

RadioGroup.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};
export default compose(
	withStyles(styles)
)(RadioGroup);

