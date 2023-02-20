import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
	// root: {
	// 	[theme.breakpoints.only('xs')]: {
	// 		width: '100%',
	// 		overflow: 'auto',
	// 		maxWidth: '320px'
	// 	},
	// 	[theme.breakpoints.only('sm')]: {
	// 		width: '100%',
	// 		overflow: 'auto',
	// 		maxWidth: '960px'
	// 	},
	// 	[theme.breakpoints.only('md')]: {
	// 		width: '100%',
	// 		overflow: 'auto',
	// 		maxWidth: '1280px'
	// 	},
	// 	[theme.breakpoints.only('lg')]: {
	// 		maxWidth: '100%'
	// 	}
	// }
});
class Page extends Component {
	render() {
		const { classes, component } = this.props;
		return (
			<div className={classes.root}>
				{component}
			</div>
		);
	}
}
export default withStyles(styles)(Page);
