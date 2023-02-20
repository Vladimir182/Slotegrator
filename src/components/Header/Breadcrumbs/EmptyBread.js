import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { getRandomArbitrary } from '../../../utils/helper';

const styles = theme => ({
	root: {
		height: '1.1rem',
		display: 'inline-flex',
		justifyContent: 'center',
		color: 'rgba(0,0,0,0)',
		backgroundColor: 'rgba(255,255,255,0.1)',
		borderRadius: "0px",
		alignItems: 'center',
		padding: '0px 0px 0px 2px',
		marginTop: '2px',
	}
});

const EmptyBread = ({ classes }) => {
	let width = Math.ceil(getRandomArbitrary(50, 100));

	return (
		<ListItem
			style={{width: `${width}px`}}
			component={Button}
			className={classes.root}
		>
			Empty Bread
		</ListItem>
	);
};
export default withStyles(styles)(EmptyBread);
