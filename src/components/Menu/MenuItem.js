import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import { compose } from 'redux';

const styles = theme => ({
	button: {
		width: '100%',
		fontWeight: '600',
		color: theme.palette.button.menuItem.color
	},
	root: {
		justifyContent: 'flex-start',
			'&:hover' :{
				background: theme.palette.buttonHover
		}
		//color: theme.palette.type === 'light' ? theme.palette.primary.dark : theme.palette.primary.light
	},
	text: {
		textAlign: 'left'
	},
	activeLink: {
		borderRadius: 0,
		color: theme.palette.button.menuItem.color,
		background: theme.palette.button.menuItem.activeItem,
		'&:hover': {
			background: theme.palette.button.menuItem.activeItem,
		}
	}
});
class MenuItem extends Component {

	onClick = e => {
		const { handlerDrawerClose, target, theme, to } = this.props;
		const isSmallScreen = window.innerWidth <= theme.breakpoints.width('sm');

		if (isSmallScreen) {
			handlerDrawerClose();
		}
		if (target) {
			window.open(to,'_blank')
		}
	}

	render() {
		const { 
			to,
			text,
			classes,
			target,
			location: { pathname }
		} = this.props;

		const Component = target ? Button : Link;
		// const color = pathname === to ? 'primary' : 'default';
		return (
			<Button
				// color={color}
				size="large"
				classes={{ root: classes.root }}
				to={to}
				component={Component}
				className={classNames(classes.button, {
					[classes.activeLink]: pathname === to
				})}
				onClick={this.onClick}
			>
				{text}
			</Button>
		);
	}
}

export default compose(
	withStyles(styles),
	withTheme,
	withRouter
)(MenuItem);
