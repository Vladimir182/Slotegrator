import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => {
	return {
		root: {
			opacity: '.5',
			zIndex: 9999
		}
	};
};

export default withStyles(styles)(({ classes }) => {
	return <div className={classes.root}>v{process.env.REACT_APP_VERSION}</div>;
});