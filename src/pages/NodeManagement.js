import React, { Component } from 'react';
// import Tree from '../components/NodeManagement';
import Tree from '../components/NodeMap';

import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit * 1
	},
	reload: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	loading: {
		height: '5px',
		width: '100%'
	}
});

class NodeManagment extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Paper className={classes.root}>
					<Tree />
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.authorization.userData.user,
	permissions: state.authorization.userData.permissions,
	rooms: state.merchants.rooms,
	terminals: state.merchants.terminals,
	merchants: state.merchants.merchants,
	tree: state.merchants.tree,
});

export default compose(
	connect(mapStateToProps),
	withStyles(styles)
)(NodeManagment);
