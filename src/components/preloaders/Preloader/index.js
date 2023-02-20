import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	rootWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	}
});

const LazyLoading = ({ classes, ...props }) => {
	return (
		<div className={classes.rootWrapper}>
			<CircularProgress 
				{ ...props }
			/>
		</div>
	);
};

export default withStyles(styles)(LazyLoading);
