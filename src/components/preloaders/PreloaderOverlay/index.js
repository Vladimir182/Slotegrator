import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	root: {
		display: 'flex',
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		// width: '100%',
		// height: '100%',
		// minHeight: '450px'
		backgroundColor: theme.palette.preloaderOverlayBackground,
		zIndex: 9999
	}
});

const LazyLoading = ({ classes }) => {
	return (
		<div className={classes.root}>
			<CircularProgress />
		</div>
	);
};

export default withStyles(styles)(LazyLoading);
