import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
	fetchGetAllRoles,
	fetchGetOfRoles,
	fetchGetResourcesList,
	fetchPermissions,
	fetchEditRoles,
	fetchCreateRole,
	fetchRemoveRoles
} from '../ducks/roles';
import _ from 'lodash';
import CreatorTableHeader from '../components/CreatorTableHeader';
import AddIcon from '@material-ui/icons/PersonAdd';
import Zoom from '@material-ui/core/Zoom';
import LinearProgress from '@material-ui/core/LinearProgress';
import RolesForm from '../components/forms/RolesForm';
import Tooltip from '@material-ui/core/Tooltip';
import ModalAlert from '../components/modals/ModalAlert';
import { rRender } from '../utils/helper';
import ActionsList from "../components/ActionsList";
import { compose } from 'redux';
import TableControls from '../components/TableControls';

const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		'& .MuiTableCell-stickyHeader': {
			top: '164px!important',
			zIndex: '10',
			[theme.breakpoints.down('1200')]:{
				position: 'slicky',
				top: '0!important'
			},
		},
		[theme.breakpoints.between('xs','sm')]:{
			overflowX: 'auto'
		},
		'& .MuiButton-textSecondary': {
			minWidth: '52px',
			height: '52px',
			marginLeft: '10px',
			border: theme.palette.button.borderColor,
			borderRadius: theme.palette.button.radius,
			'&:hover':{
				backgroundColor: theme.palette.button.hover,
			}
		},

		'& .MuiTableHead-root': {	

			[theme.breakpoints.down('1200')]:{
				'& > tr > th': {
					top: '0 !important'
				}				
			},
		},
	},
	table: {
		width: '100%'
	},
	reload: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	loading: {
		height: '5px',
		width: '100%'
	},
	controls: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(3, 2),
		backgroundColor: theme.palette.tableControlPanelBG,
		position: 'sticky',
		top: '78px!important',
		zIndex: '5',

		[theme.breakpoints.down('1200')]:{
			top: '0px!important',
		}
	},
	tableCellRoles: {
		width: '200px'
	},
	wrapTableForScroll: {	
		[theme.breakpoints.down('1200')]:{
			overflowX: 'auto',
		},
	},
	controlsFixMobile: {
		[theme.breakpoints.down('600')]:{
			width: '100%',
			padding: `0 0 0 ${theme.spacing(2)}px`
		},
	},
	wrapPaginateRight: {},
	wrapButtonCreateUser: {
		marginTop: '-3px',
	}
});

const rows = [
	{
		id: 'id',
		numeric: false,
		disablePadding: false,
		label: 'ID',
		disableSort: true
	},
	{
		id: 'role_code',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		label: 'Roles code',
		disableSort: true
	},
	{
		id: 'role_name',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		label: 'Role name',
		disableSort: true
	},
	{
		id: 'description',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		label: 'Description',
		disableSort: true
	},
	{
		id: 'Action',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		disableSort: true,
		label: 'Action'
	}
];
class Roles extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			create: false,
			edit: false,
			formData: null,
			trash: false,
			preDeleteRole: ''
		};
	}

	openModalCreateRole = () => {
		this.setState({ create: true });
	};
	closeModalCreateRole = () => {
		this.setState({ create: false });
	};
	openModalEditRole = role => {
		this.setState({ edit: true, formData: role });
	};
	closeModalEditRole = () => {
		this.setState({ edit: false, formData: null });
	};
	openModalDeleteRole = role => {
		this.setState({ trash: true, formData: role, preDeleteRole: role.role_name });
	};
	answerModalDeleteRole = value => {
		const { fetchRemoveRoles } = this.props;
		const { formData } = this.state;
		this.setState(
			{ trash: false, formData: null },
			() => value && fetchRemoveRoles(formData.id)
		);
	};
	handlerSubmitCreateRole = values => {
		const { fetchCreateRole } = this.props;
		const data = { ...values };
		data.resources = _.map(values.resources, item => item);
		return fetchCreateRole(data, this.closeModalCreateRole).catch(error => {
			throw error;
		});
	};
	handlerSubmitEditRole = values => {
		const { fetchEditRoles } = this.props;
		const data = { ...values };
		data.resources = _.map(values.resources, item => item);
		
		return fetchEditRoles(data.id, data, this.closeModalEditRole).catch(
			error => {
				throw error;
			}
		);
	};
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
	}
	componentDidMount() {
		this.updateData();
	}
	createTableHeader = () => {
		return _.map(rows, row => (
			<TableCell
				key={row.id}
				align={row.numeric ? 'right' : 'left'}
				padding={row.disablePadding ? 'none' : 'default'}>
				{row.label}
			</TableCell>
		));
	};
	updateData = () => {
		const { fetchGetAllRoles, fetchGetResourcesList, fetchGetOfRoles } = this.props;
		const {page} = this.state;

		const data = {
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
		}
		fetchGetOfRoles(data);
		// fetchGetAllRoles();
		fetchGetResourcesList();
	};
	
	render() {
		const { create, edit, formData, trash, page } = this.state;
		const { roles, resources, loading, classes, countRoles } = this.props;
		const itemsBody = _.map(roles, item => {
			return (
				<TableRow key={item.id} style={{'height':'69px'}}>
					<TableCell align="left" className={classes.tableCellRoles}>{item.id}</TableCell>
					<TableCell align="center" className={classes.tableCellRoles}>{item.role_code}</TableCell>
					<TableCell align="center" className={classes.tableCellRoles}>{item.role_name}</TableCell>
					<TableCell align="center" className={classes.tableCellRoles}>{item.description}</TableCell>
					<TableCell align="center" className={classes.tableCellRoles}>
						{(item.role_code !== 'super_admin' ) && (
							<ActionsList
								config={{
									edit: {
										title: 'Edit',
										handler: () => this.openModalEditRole(item),
										allowPermission: rRender(resources, 'permissions', 'allow_update')

									},
									remove: {
										title: 'Delete',
										handler: () => this.openModalDeleteRole(item),
										allowPermission: rRender(resources, 'permissions', 'allow_delete')
									}
								}}
							/>
						)}
					</TableCell>
				</TableRow>
			);
		});
		return (
			<Paper className={classes.root}>
				{trash && (
					<ModalAlert
						answer={this.answerModalDeleteRole}
						text={`This action will remove role "${this.state.preDeleteRole}". Are you sure?`}
						titel={'Title'}
					/>
				)}
				{create && (
					<RolesForm
						hideTitleTableCreateRole={false}
						title="Create role"
						textSubmit="Create"
						onSubmit={this.handlerSubmitCreateRole}
						handleClose={this.closeModalCreateRole}
						subTitleText="Please fill Role name and its description."
						subDescriptionText="This action will create role with no permissions. To give permissions you have to edit role."
					/>
				)}
				{edit && (
					<RolesForm
						hideTitleTableCreateRole={true}
						title="Edit role"
						textSubmit="Save"
						roleId={formData.id}
						formData={formData}
						onSubmit={this.handlerSubmitEditRole}
						handleClose={this.closeModalEditRole}
						subTitleText="Please fill in and send the application form below to edit the role data."
					/>
				)}
				<div className={classes.loading}>
					{loading ? <LinearProgress /> : null}
				</div>
				<div className={`${classes.controls}`}>
					{rRender(resources, 'permissions', 'allow_create') && (
						<div className={classes.wrapButtonCreateUser}> 
							<Tooltip title="Add role" aria-label="Add role">
								<Button 
									color='secondary'
									onClick={this.openModalCreateRole}>
									<AddIcon />
								</Button>
							</Tooltip>
						</div>
					)}
					<div className={classes.controlsFixMobile} >
						<TableControls
							form={'bottom'}
							settings={['paginate']}
							updateData={this.updateData}
							handleChangePage={this.handleChangePage}
							page={page}
							count={countRoles}
							className={classes.wrapPaginateRight}
						/>
					</div>	
				</div>

				<div className={`${classes.table} ${classes.wrapTableForScroll}`}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<CreatorTableHeader
									{...this.state}
									rows={rows}
									handleSort={this.handleSort}
								/>
							</TableRow>
						</TableHead>
						<Zoom in={!loading}>
							<TableBody>{itemsBody}</TableBody>
						</Zoom>
					</Table>
				</div>
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	user: state.authorization.userData,
	roles: state.roles.data,
	loading: state.roles.loading,
	resources: state.authorization.userData.user.resources,
	count: state.widgets.terminals.countPage,
	countRoles: state.roles.count
});
const mapDispatchToProps = {
	fetchGetAllRoles,
	fetchGetOfRoles,
	fetchEditRoles,
	fetchPermissions,
	fetchGetResourcesList,
	fetchCreateRole,
	fetchRemoveRoles
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Roles);
