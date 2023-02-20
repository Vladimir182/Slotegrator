import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
	fetchGetUsers,
	fetchGetMerchantUsers,
	fetchGetRoomUsers,
	fetchGetTerminalUsers,
	fetchRemoveUsers,
	fetchNewUsers,
	fetchEditUser
} from '../ducks/users';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { fetchGetAllRoles } from '../ducks/roles';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import CreateUser from '../components/forms/user-forms/CreateUser';
import EditUser from '../components/forms/user-forms/EditUser';
import ModalAlert from '../components/modals/ModalAlert';
import AddIcon from '@material-ui/icons/PersonAdd';
import Zoom from '@material-ui/core/Zoom';
import CreatorTableHeader from '../components/CreatorTableHeader';
import { rRender } from '../utils/helper';
import ActionsList from "../components/ActionsList";
import { compose } from 'redux';

import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import DefaultSort from '@material-ui/icons/Sort';
import SearchIcon from "@material-ui/icons/Search";
import TableControls from '../components/TableControls/index';
import { red } from '@material-ui/core/colors';

import  {numbersOnly, regExpTest, validationRegs } from '../components/forms/formValidation';

const numberOnly = regExpTest(validationRegs.numbersOnly);

let filtersHalls = ['Merchants', 'Rooms', 'Terminals'];

const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		'& .MuiTableCell-stickyHeader': {
			top: '158px!important',
		},
		[theme.breakpoints.between('xs','sm')]:{},			
		'& .MuiFormControl-root': {
			flexShrink: '1',
			marginLeft: '10px !important',
		},
		'& .MuiButton-textSecondary': {
			minWidth: '48px',
			height: '48px',
			color: theme.palette.button.color,
			marginLeft: '10px',
			border: '2px solid #fff',
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
	buttonClear: {
		marginTop: '3px'
	},
	controlsWrapper: {
		padding: '10px 0 5px'
	},		
	table: {
		width: '100%'
	},
	tableCell: {
		width: '180px'
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
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	controlsCell: {
		minWidth: '180px'
	},
	styleNoData:{
		padding: '10px 0',
		fontSize: '15px',
		lineHeight: '1.43',
		color: theme.palette.tableHeaderColor
	},
	wrapTableForScroll: {				

		[theme.breakpoints.down('1200')]:{
			overflowX: 'auto',
		},
	},
	usersTableControl: {
		display: 'flex',
		flexWrap: 'wrap',	
		paddingBottom: theme.spacing(2),
		backgroundColor: theme.palette.tableControlPanelBG,
		position: 'sticky',
		top: '88px!important',
		zIndex: '5',

		[theme.breakpoints.down('1200')]:{
			top: '0px!important',
		}
	},
	wrapSearchUsers: {

		[theme.breakpoints.down('800')]:{
			width: '100%',
			paddingTop: theme.spacing(3)
		},	
	},
	firstButtonCreateUser: {
		marginTop: "3px",
	}
});
const rows = [
	{
		id: 'Username',
		numeric: false,
		// alignCenter: true,
		disablePadding: false,
		label: 'Username',
		disableSort: true
	},
	{
		id: 'role',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		label: 'Roles',
		disableSort: true
	},
	{
		id: 'merchant_id',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		disableSort: true,
		label: 'Merchant id'
	},
	{
		id: 'room_id',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		disableSort: true,
		label: 'Room id'
	},
	{
		id: 'terminal_id',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		disableSort: true,
		label: 'Terminal id'
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
class Users extends Component {
	constructor(props) {
		super(props);

		this.searchInputRef = React.createRef();

		const filterUsersSearchValue = sessionStorage.getItem('saveUsersSearch');
		const savedStatusFilterValue = sessionStorage.getItem('saveFilterSearchId');

		this.state = {
			page: 0,
			createUser: false,
			editUser: false,
			formData: null,
			trash: false,
			usersFilters: savedStatusFilterValue ?? 'Merchants',
			filterSearchValue: filterUsersSearchValue ?? '',
			preDeleteUser: ''
		};
	}

	openModalCreateUser = () => {
		this.setState({ createUser: true });
	};

	closeModalCreateUser = () => {
		this.setState({ createUser: false });
	};

	openModalEditUser = user => {
		this.setState({ editUser: true, formData: user });
	};

	closeModalEditUser = () => {
		this.setState({ editUser: false, formData: null });
	};

	openModalDeleteUser = user => {	
		this.setState({ trash: true, formData: user, preDeleteUser: user.username });
	};

	answerModalDeleteUser = value => {
		const { fetchRemoveUsers } = this.props;
		const { formData } = this.state;
		this.setState(
			{ trash: false, formData: null },
			() => value && fetchRemoveUsers(formData.id)
		);
	};

	handlerSubmitCreateUser = values => {
		const { username, password, role_id } = values;
		const { 
			selected, 
			fetchNewUsers
		} = this.props;
		const data = {
			username: _.trimStart(username),
			password,
			role_id: role_id
		};

		if (selected !== 'root') {
			if (selected.nodeType === 'terminal') {
				data['terminal_id'] = selected.terminal.id;
				data['room_id'] = selected.room.id
				data['merchant_id'] = selected.merchant.id;
			}
			if (selected.nodeType === 'room') {
				data['merchant_id'] = selected.merchant.id;
				data['room_id'] = selected.room.id;
			}
			if (selected.nodeType === 'merchant')
				data['merchant_id'] = selected.merchant.id;

			return fetchNewUsers(data, this.closeModalCreateUser).catch(
				error => {
					throw error;
				}
			);
		} else {
			return fetchNewUsers(data, this.closeModalCreateUser).catch(
				error => {
					throw error;
				}
			);
		}
	};

	handlerSubmitEditUser = values => {
		const { formData } = this.state;
		const { username, password, role_id } = values;
		const { fetchEditUser } = this.props;
		const data = {
			username: _.trimStart(username),
			role_id: role_id
		};
		if (password) {
			data['password'] = password;
		}

		return fetchEditUser(formData.id, data, this.closeModalEditUser).catch(
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

	componentDidUpdate(prevProps) {
		const { selected } = this.props;

		if (!_.isEqual(prevProps.selected, selected)) {
			this.updateData();
		}
	}

	updateData = () => {
		const { 
			resources, 
			selected, 
			fetchGetUsers,
			fetchGetMerchantUsers, 
			fetchGetRoomUsers,
			fetchGetTerminalUsers,
			fetchGetAllRoles
		} = this.props;

		const {page, filterSearchValue, usersFilters} = this.state;

		const data = {
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
		}

		if (rRender(resources, 'permissions', 'allow_view')) fetchGetAllRoles();

		if(filterSearchValue) {
			if(usersFilters === 'Merchants') {
				if(Boolean(filterSearchValue) === true){
					fetchGetMerchantUsers(filterSearchValue)
				}		
			}
			if(usersFilters === 'Rooms') {
				if(Boolean(filterSearchValue) === true){
					fetchGetRoomUsers(filterSearchValue)
				}		
			}
			if(usersFilters === 'Terminals') {
				if(Boolean(filterSearchValue) === true){
					fetchGetTerminalUsers(filterSearchValue)
				}		
			}
		}

		if (selected) {
			if (selected.nodeType === 'terminal' && !filterSearchValue) {
				fetchGetTerminalUsers(selected.terminal.id);
			}
			if (selected.nodeType === 'room' && !filterSearchValue) {
				fetchGetRoomUsers(selected.room.id);
			}
			if (selected.nodeType === 'merchant' && !filterSearchValue) {
				fetchGetMerchantUsers(selected.merchant.id);
			}
			if (selected.nodeType === 'root' && !filterSearchValue) {
				fetchGetUsers(data);
			}
		}
	};

	handleSearchClick = (value) => {	
		this.setState({
			filterSearchValue: value,
			page: 0
		}, () => this.updateData());	
		
	}

	handleKeyPress = (value) => {
		this.setState({
			filterSearchValue: value,
			page: 0
		}, () => this.updateData());
	}

	handleUsersFilters = (e) => {
		const value = e.target.value;

    	this.setState({
			...this.state,
			usersFilters: value
		}, ()=> {
			sessionStorage.setItem('saveFilterSearchId', value);
		});	
  	}
	handleSearchChange = (e) => {
		const value = e.target.value;

		this.setState({
			filterSearchValue: value
		}, () => {
			sessionStorage.setItem('saveUsersSearch', value);
		});
	}

	clearAll = () => {
		this.setState({
				usersFilters: 'Merchants',
				filterSearchValue: '',
				page: 0
			}, () => {
				sessionStorage.removeItem('saveUsersSearch', '');
				this.updateData();
			});
	};

	componentWillUnmount() {
	 	this.clearAll()
	}

	render() {
		const {
			users,
			classes,
			loading,
			roles,
			count,
			user,
			resources,
			selected
		} = this.props;

		const { 
			createUser, 
			editUser, 
			formData, 
			trash, 
			usersFilters, 
			filterSearchValue 
		} = this.state;

		const searchFieldPlaceholder = usersFilters === 'Merchants' ? 'Merchant'
			: usersFilters === 'Rooms' ? 'Room'
			: usersFilters === 'Terminals' ? 'Terminal' : 'Search';

		const itemsBody = _.map(users, item => {

			const role = _.find(roles, role => role.id === item.role_id);
			
			return (
				<TableRow key={item.id} style={{'height':'69px'}}>
					<TableCell
						component="th"
						scope="row"
						align="left"
						className={classes.tableCell}>
						{item.username}
					</TableCell>
					<TableCell align="center" className={classes.tableCell}>
						{/* {(role && role.role_name) || ''} */}
						{item.role_name ?? (role?.role_name)}
					</TableCell>
					<TableCell align="center" className={classes.tableCell}>
						{item.merchant_id}
					</TableCell>
					<TableCell align="center" className={classes.tableCell}>
						{item.room_id}
					</TableCell>
					<TableCell align="center" className={classes.tableCell}>
						{item.terminal_id}
					</TableCell>
					<TableCell align="center" className={`${classes.tableCell} ${classes.controlsCell}`}>
						{/* role && */}
						{(item.role_name !== 'Super Admin' ) && (
							<ActionsList
								config={{
									editUser: {
										title: 'Edit',
										handler: () => this.openModalEditUser({
											...item,
											password: null,
											role: item.permissions_id
										}),
										allowPermission: rRender(
											resources,
											'users',
											'allow_update'
										)
									},
									removeUser: {
										title: 'Delete',
										handler: () => this.openModalDeleteUser(item),
										allowPermission: rRender(
											resources,
											'users',
											'allow_delete'
											)
										}
									}}
							/>
						)}

					</TableCell>
				</TableRow>
			);
		});
		return (
			<div>


					

				{createUser && (
					<CreateUser
						title={"Create User"}
						textSubmit="Create"
						onSubmit={this.handlerSubmitCreateUser}
						handleClose={this.closeModalCreateUser}
					/>
				)}
				{editUser && (
					<EditUser
						title="Edit User"
						formData={formData}
						textSubmit="Save"
						onSubmit={this.handlerSubmitEditUser}
						handleClose={this.closeModalEditUser}
					/>
				)}
				{trash && (
					<ModalAlert
						answer={this.answerModalDeleteUser}
						text={`This action will remove "${this.state.preDeleteUser}" and cannot be undone! Are you sure?`}
						titel={'Title'}
					/>
				)}
  
  


				<Paper className={classes.root}>	

					<div className={`${classes.controlsWrapper} ${classes.usersTableControl}`}>		

						{selected.nodeType !== 'root' &&
							rRender(resources, 'users', 'allow_create') && (
								<div className={classes.firstButtonCreateUser}>
									<Tooltip title="Create User" aria-label="Create User">
										<Button 
											color='secondary' 
											onClick={this.openModalCreateUser}>
											<AddIcon />
										</Button>
									</Tooltip>
								</div>
						)}										

						<Tooltip className={classes.buttonClear} title="Default sort" aria-label="Default">
							<Button color='secondary' onClick={this.clearAll}> 
								<DefaultSort /> 
							</Button>
						</Tooltip>

						<FormControl variant="outlined">
							<InputLabel>Search by</InputLabel>
							<Select 
								variant='outlined'
								label="Search by"
								autoComplete={true}
								autoHighlight={true}
								disableClearable={true}
								value={usersFilters}
								onChange={this.handleUsersFilters}
								>
									{_.map(filtersHalls, item =>(
										// <MenuItem disabled={item === 'Rooms'|| item === 'Terminals'} key={item} value={item}>{item}</MenuItem>
										<MenuItem key={item} value={item}>{item}</MenuItem>
									))}
							</Select>
						</FormControl>	
							<div className={classes.wrapSearchUsers}>
								<TextField
									color="secondary"
									className={classes.searchInput}
									label='Search id'
									variant='outlined'
									onChange={this.handleSearchChange}
									inputRef={this.searchInputRef}
									value={!filterSearchValue ? '' : filterSearchValue}
									placeholder={searchFieldPlaceholder}
									validate={[numberOnly]} 
									onPaste={(e)=>{e.preventDefault()}}
									
									// error={ filteredMerchants === null ? false : true}
									// helperText={ filteredMerchants === null ? "" : "Merchant does not exist."}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											this.handleKeyPress(filterSearchValue)
										} else if( e.which < 48 || e.which > 57 ){
											e.preventDefault();
											return false
										}
									}} 
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
									endAdornment: (
									<InputAdornment>
											<IconButton
											color='secondary'
											id={'search'}
											onClick={() => {
												const value = this.searchInputRef.current.value;

												this.handleSearchClick(value);
											}}
											>
												<SearchIcon/>
											</IconButton>
										</InputAdornment>
										)
									}}					
								/> 
							</div>

					</div>








					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>

					{/* <div className={classes.controls}>
						{selected.nodeType !== 'root' &&
							rRender(resources, 'users', 'allow_create') && (
								<Button 
									color='secondary' 
									onClick={this.openModalCreateUser}>
									<AddIcon />
								</Button>
							)}
					</div> */}
					
					<div className={`${classes.table} ${classes.wrapTableForScroll}`}>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<CreatorTableHeader rows={rows} />
								</TableRow>
							</TableHead>
							<Zoom in={!loading}>
								<TableBody>{itemsBody}</TableBody>
							</Zoom>
						</Table>
					</div>

					{ users.length 
						?
							<TableControls
							form={'bottom'}
							updateData={this.updateData}
							settings={['paginate']}
							page={this.state.page}
							handleChangePage={this.handleChangePage}
							count={count}
							/> 
						: <div align="center" className={classes.styleNoData}>No data</div>
					}
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	users: state.users.data,
	selected: state.selected,
	count: state.users.countPage,
	rooms: state.merchants.rooms,
	terminals: state.merchants.terminals,
	user: state.authorization.userData,
	roles: state.roles.data,
	loading: state.users.loading,
	resources: state.authorization.userData.user.resources,
	filtereUsers: state.users.filtereUsers,
});

const mapDispatchToProps = {
	fetchGetUsers,
	fetchRemoveUsers,
	fetchNewUsers,
	fetchEditUser,
	fetchGetAllRoles,
	fetchGetMerchantUsers,
	fetchGetRoomUsers,
	fetchGetTerminalUsers
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Users);
