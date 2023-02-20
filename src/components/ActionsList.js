import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from "@material-ui/core/IconButton";

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})((props) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles((theme) => ({
	// root: {
	// 	'&:focus': {
	// 		// backgroundColor: theme.palette.blueUser,
	// 		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
	// 			color: theme.palette.common.white,
	// 		},
	// 	},
	// },
}))(MenuItem);

class ActionsList extends Component {

	state = {
		anchorEl: null
	};

	handleClick = (event) => {
		this.setState({
			anchorEl : event.currentTarget
		})
	};

	handleClose = () => {
		this.setState({
			anchorEl: null
		})
	};
	render() {
		const { edit, remove, editUser, removeUser } = this.props.config;

		const isDisabled = Object.keys(this.props.config).filter(key => this.props.config[key].allowPermission);
		
		const {anchorEl} = this.state;
		return (
			<div>
				<IconButton
					disabled={!isDisabled.length}
					aria-label="more"
					aria-controls="long-menu"
					aria-haspopup="true"
					onClick={this.handleClick}
				>
					<MoreVertIcon />
				</IconButton>
				<StyledMenu
					id="customized-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					{ (edit && edit.allowPermission) &&
						<StyledMenuItem
							onClick={() => {
								edit.handler()
								this.handleClose()
							}}>
							<ListItemIcon>
								<EditIcon/>
							</ListItemIcon>
							<ListItemText primary={edit.title}/>
						</StyledMenuItem>
					}
					{(remove && remove.allowPermission) &&
						<StyledMenuItem
							onClick={() => {
								remove.handler()
								this.handleClose()
							}}>
							<ListItemIcon>
								<DeleteIcon />
							</ListItemIcon>
						<ListItemText primary={remove.title}/>
					</StyledMenuItem>
					}

					{(editUser && editUser.allowPermission) &&
					<StyledMenuItem
						onClick={() => {
							editUser.handler()
							this.handleClose()
						}}>
						<ListItemIcon>
							<EditIcon />
						</ListItemIcon>
						<ListItemText primary={editUser.title}/>
					</StyledMenuItem>
					}

					{(removeUser && removeUser.allowPermission) &&
					<StyledMenuItem
						onClick={() => {
							removeUser.handler()
							this.handleClose()
						}}>
						<ListItemIcon>
							<DeleteIcon />
						</ListItemIcon>
						<ListItemText primary={removeUser.title}/>
					</StyledMenuItem>
					}

				</StyledMenu>
			</div>
		);
	}
}
export default ActionsList