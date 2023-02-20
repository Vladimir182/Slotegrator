import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import TableControls from '../TableControls';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
const styles = theme => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		minHeight: '400px',
		width: '100%',
		padding: '10px'
	},
	controls: {
		width: '100%'
	},
	icon: {
		fontSize: '150px'
	},
	block: { width: '100%', display: 'flex', flexDirection: 'column', color: 'red', justifyContent: 'center' },
	message: {
		textAlign: 'center',
		color: 'red'
	}
});
export default withStyles(styles)(function ErrorTerminalMultiple({
	classes,
	errorsArr,
	handleBack
}) {
	return (
		<div className={classes.root}>
			{handleBack && (
				<div className={classes.controls}>
					<TableControls
						settings={['back']}
						handleBack={handleBack}
					/>
				</div>
			)}
			<div>
				<WarningIcon className={classes.icon} />
			</div>
			<div className={classNames(`${classes.block} ${classes.root}`)}>
				{
					errorsArr.map(errorItem => (
					<Typography
						variant="h4"
						component="p"
						className={classes.message}>
						{errorItem.message}
					</Typography>
				))}
			</div>
		</div>
	);
});
