import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
	root: {
		width: 'auto',
		display: 'inline-flex',
		justifyContent: 'center',
		color: theme.palette.primary.contrastText,
		alignItems: 'center',
		padding: 0,
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1)
	},
	button: {
		paddingLeft: 0
	}
});
const Bread = props => {
	const getButton = () => {
		if (!props.isRoot) {
			return <Button />
		} else {
			return <Button className={props.classes.button} />
		}
	} 

	const ButtonWithStyles = getButton();
	return (
		<ListItem
			component={Button}
			onClick={props.onClick}
			className={props.classes.root}>
			{props.title || props.children}
		</ListItem>
	);
};
export default withStyles(styles)(Bread);
