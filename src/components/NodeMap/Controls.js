import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CurrentIcon from '@material-ui/icons/TouchApp';
import DeleteIcon from '@material-ui/icons/Delete';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { setSelectedNode } from '../../ducks/selected';
import { compose } from 'redux';


const styles = theme => ({
	root: {
		marginLeft: theme.spacing.unit
	}
});
class Controls extends Component {
	render() {
		const { classes, config, handlerEdit, handlerCreate, item, user, setSelectedNode, handlerRemove, handlerReset, customId} = this.props;

		const isResetDisabled = item.nodeType !== 'terminal' ? false : item.is_connected === false ? true : false;
		
		return (
			<div className={classes.root}>
				{config['create'] && (
					<Tooltip title="Add"  aria-label="Add">
						<Button 
							color='secondary'
							id={customId} 
							onClick={() => handlerCreate(item)}>
							<AddIcon />
						</Button>
					</Tooltip>
				)}
				{config['edit'] && (
					<Tooltip title="Edit" aria-label="Edit">
						<Button 
							color='secondary' 
							id={customId} 
							onClick={() => handlerEdit(item)}>
							<EditIcon />
						</Button>
					</Tooltip>
				)}
				{config['current'] && (
					<Tooltip title="Select" aria-label="Select">
						<Button
							color='secondary' 
							id={customId}
							onClick={() => setSelectedNode(item.id, item.nodeType, user.resources)}
						>
							<CurrentIcon />
						</Button>
					</Tooltip>
				)}
				{config['reset'] && (
					<Tooltip title="Reset" aria-label="Reset">
						<Button 
							color='secondary' 
							disabled={isResetDisabled} 
							id={customId} 
							onClick={() => handlerReset(item)}>
							<RotateLeftIcon />
						</Button>
					</Tooltip>
				)}
				{config['trash'] && (
					<Tooltip color='secondary' title="Delete" aria-label="Delete">
						<Button 
							id={customId} 
							onClick={() => handlerRemove(item)}>
							<DeleteIcon />
						</Button>
					</Tooltip>
				)}
			</div>
		);
	}
}
Controls.defaultProps = {
	config: {
		create: true,
		edit: true,
		current: true,
		trash: true
	},
	item: {},
	handlerEdit: () => {},
	handlerCreate: () => {},
	handlerRemove: () => {}
};

const mapStateToProps = state => ({
	user: state.authorization.userData.user
});

const mapDispatchToProps = {
	setSelectedNode
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Controls);
