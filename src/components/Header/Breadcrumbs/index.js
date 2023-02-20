import React, { Component } from 'react';
import { connect } from 'react-redux';
import Arrow from '@material-ui/icons/KeyboardArrowRight';
import { withStyles } from '@material-ui/core/styles';
import { setSelectedNode, resetSelectedNode } from '../../../ducks/selected';
import FolderIcon from '@material-ui/icons/Folder';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import ComputerIcon from '@material-ui/icons/Computer';
import Bread from './Bread';
import EmptyBread from './EmptyBread';
import _ from 'lodash';
import { compose } from 'redux';
import { rRender } from '../../../utils/helper';

const styles = theme => ({
	root: {
		display: 'flex',
		paddingLeft: '15px',
		alignItems: 'center',
		flexWrap: 'wrap',
		'& .MuiButton-root':{
			'&:hover' :{
				background: theme.palette.buttonHover
			}
		}
	},
	rootIcon: { 
		width: '18px',
		marginRight: theme.spacing(1), 
		color: theme.palette.breadCrumbs.iconColor
	}
});

class BreadCrumbs extends Component {

	handleBreadClick(item) {
		const { user, setSelectedNode, resetSelectedNode } = this.props;

		if (item.nodeType === 'root') {
			resetSelectedNode()
			
			return;
		}

		setSelectedNode(item.id, item.nodeType, user.resources);
	}

	Root = (item, active = false, resetSelectedNode) => (
		<React.Fragment key={_.uniqueId('bread_crumb')}>
			<Bread
				isRoot={true}
				active={active}
				onClick={
					!active
						? () => this.handleBreadClick(item)
						: this.props.onClick
				}>
				<FolderIcon className={this.props.classes.rootIcon} />
				{item.title}
			</Bread>
			<Arrow />
		</React.Fragment>
	);
	Merchant = (item, active = false) => (
		<React.Fragment key={_.uniqueId('bread_crumb')}>
			<Bread
				active={active}
				onClick={
					!active
						? () => this.handleBreadClick(item)
						: this.props.onClick
				}>
				<PersonIcon className={this.props.classes.rootIcon} />
				{item.title}
			</Bread>
			<Arrow />
		</React.Fragment>
	);
	Room = (item, active = false) => (
		<React.Fragment key={_.uniqueId('bread_crumb')}>
			<Bread
				active={active}
				onClick={
					!active
						? () => this.handleBreadClick(item)
						: this.props.onClick
				}>
				<HomeIcon className={this.props.classes.rootIcon} />
				{item.title}
			</Bread>
			<Arrow />
		</React.Fragment>
	);
	Terminal = item => (
		<React.Fragment key={_.uniqueId('bread_crumb')}>
			<Bread active={true} onClick={this.props.onClick}>
				<ComputerIcon className={this.props.classes.rootIcon} />
				{`Terminal ${item.id}`}
			</Bread>
		</React.Fragment>
	);
	render() {
		const { data, classes, isLoading, selected, size, user } = this.props;
		const items = [];

		if (isLoading) {
			return (
				<div className={classes.root}>
					{Array.apply(null, Array(size)).map((item, index) => (
						<React.Fragment key={_.uniqueId('bread_crumb')}>
							<EmptyBread />
							{ (index < size - 1) && <Arrow /> }
						</React.Fragment>
					))}
				</div>
			); 
		} else if(selected.merchant === null || !rRender(user.resources, 'merchants', 'allow_view')){
			return <div className={classes.root} style={{'height':'24px'}}></div> 
		} else {
			_.map(data, (item, index) => {
				const active = index + 1 === data.length;
				if (item.nodeType === 'root') {
					items.push(this.Root(item, active));
				} else if (item.nodeType === 'merchant') {
					items.push(this.Merchant(item, active));
				}
				if (item.nodeType === 'room') {
					items.push(this.Room(item, active));
				}
				if (item.nodeType === 'terminal') {
					items.push(this.Terminal(item));
				}
			});
			return <div className={classes.root}>{items}</div>;
		}		
	}
}

const mapStateToProps = (state) => ({
	user: state.authorization.userData.user,
	selected: state.selected
})

const mapDispatchToProps = {
	setSelectedNode,
	resetSelectedNode
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(BreadCrumbs);
