import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import TableControls from '../TableControls';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';

const styles = theme => ({
	// root: {
	// 	display: 'flex',
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	flexWrap: 'wrap',
	// 	minHeight: '400px',
	// 	width: '100%',
	// 	padding: '10px'
	// },
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
		minHeight: '400px',
		width: '100%',
		padding: '10px'
	},
	controls: {
		width: '100%'
	},
	icon: {
		fontSize: '150px',
		marginBottom: '35px'
	},
	block: { width: '100%' },
	message: {
		textAlign: 'center',
		color: red['500']
	}
});

const  ErrorTerminal = ({classes, message}) => (
	<div className={classes.root}>
		<div>
			<WarningIcon className={classes.icon} />
		</div>
		<div className={classNames(classes.block)}>
			<Typography
				variant="h4"
				component="p"
				className={classes.message}>
				{message}
			</Typography>
		</div>
	</div>
);

export default withStyles(styles)(ErrorTerminal)