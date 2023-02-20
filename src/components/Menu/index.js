import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import config from './config';
import DropdawnMenu from './DropdawnMenu';
import MenuItem from './MenuItem';
import { compose } from 'redux';

const styles = theme => ({
	styleDivider:{
		background: theme.palette.background.styleDivider
	}
})
class Menu extends Component {

	render() {
		const {
			selected,
			user,
			classes,
			location: {pathname},
			handlerDrawerClose
		} = this.props;

		const Items = _.map(config, item => {
			if (item.line && item.checkRender(user.resources, selected, selected.terminal)) {
				return <Divider className={classes.styleDivider} key={_.uniqueId('menu-items')}/>;
			} else {
				if (item.checkRender(user.resources, selected, selected.terminal)) {
					if (item.children !== undefined) {
						return <DropdawnMenu
							terminalData={selected.terminal}
							resources={user.resources}
							selected={selected} 
							key={_.uniqueId('menu-items')}
							data={item}
							pathname={pathname}
							handlerDrawerClose={handlerDrawerClose}
						/>
					} else { // Item haven't children
						return (
							<MenuItem
								key={_.uniqueId('menu-items')}
								to={item.href}
								text={item.text}
								handlerDrawerClose={handlerDrawerClose}
							/>
						);
					}
				}
			}
		});

		return <div>{Items}</div>;
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
	user: state.authorization.userData.user,
	terminals: state.widgets.terminals.data
});

export default compose(
	withRouter,
	connect(mapStateToProps),
	withStyles(styles)
)(Menu);
