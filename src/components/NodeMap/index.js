import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { compose } from 'redux';
import _ from 'lodash';
import {
	MerchantEdit,
	RoomEdit,
	RoomCreate,
	MerchantCreate,
	TerminalCreate
} from '../forms/NodesManagementForm';
import lightBlue from '@material-ui/core/colors/lightBlue';
import cyan from '@material-ui/core/colors/cyan';
import teal from '@material-ui/core/colors/teal';
import Merchant from './Merchant';
import Room from './Room';
import Terminal from './Terminal';
import Controls from './Controls';
import DefaultSort from '@material-ui/icons/Sort';
import {
	fetchAddMerchant,
	fetchAddRoom,
	fetchAddTerminal,
	fetchEditMerchant,
	fetchEditRoom,
	fetchRefreshKeys,
	fetchDeleteTerminal,
	fetchDeleteMerchant,
	fetchResetTerminal,
	fetchMerchantRooms,
	fetchMerchants, 
	fetchRoomTerminals,
	fetchRooms,
	fetchDeleteRoom,
	resetFilteredMerchants
} from '../../ducks/merchants';
import { setSelectedNode } from '../../ducks/selected';
import ModalAlert from '../modals/ModalAlert';
import { rRender, sideBarState } from '../../utils/helper';
import PreloaderOverlay from '../preloaders/PreloaderOverlay';
import { Redirect } from 'react-router';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import TableControls from '../TableControls';
import SearchIcon from "@material-ui/icons/Search";
import validationRegs from '../../components/forms/formValidation'


let filtersHalls = ['Merchants', 'Rooms', 'Terminals'];
let SHADE = 100;
const styles = theme => {
	if (theme.palette.type === 'dark') SHADE = 400;

	return {
		root: {
			paddingTop: '10px',
			[theme.breakpoints.between('xs', 'sm')]: {
				padding: '10px'
			},
			'& .MuiFormControl-root': {
				flexShrink: '1',
				marginLeft: '10px !important',
			},
			'& .MuiButton-textSecondary': {
				minWidth: '48px',
				height: '48px',
				color: '#fff',
				marginLeft: '10px',
				border: '2px solid #fff',
				// border: theme.palette.button.borderColor,
				borderRadius: theme.palette.button.radius,
				'&:hover':{
					backgroundColor: theme.palette.button.hover,
				}
			},
			'& .MuiIconButton-root': {
				color: '#fff'
			}
		},
		tree: {
			display: 'flex',
			flexWrap: 'wrap',
			maxWidth: '100%',
			paddingLeft: theme.spacing(5),
			paddingRight: theme.spacing(5),
			flexWrap: 'wrap',
			[theme.breakpoints.only('xs')]: {
				padding: '5pt'
			},
		},
		treePaddingTop: {
			paddingTop: theme.spacing(9)
		},
		treeOpenSideBar: {
			[theme.breakpoints.between('xs', 'sm')]: {
				display: 'flex',
				justifyContent:'center',
			}
		},
		heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightRegular
		},
		container: {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'wrap'
		},
		merchantsRowOpenSideBar: {
			// width: '350px',
			// marginRight: '20px',
			// '&:last-child': {
			// 	marginRight: 0
			// },
			// [theme.breakpoints.between('xs', 'sm')]: {
			// 	width: '350px',
			// 	marginRight: 0
			// }
		},
		controlsWrapper: {
			padding: theme.spacing(3,2,4),
			display: 'flex',
			flexWrap: 'wrap',
			alignItems: 'center',
			[theme.breakpoints.up('md')]:{
				position: 'sticky',
				top: '88px',
				background: theme.palette.tableControl.tableControlColor,
				zIndex: '20',
			},
			'& .MuiSelect-select':{
				width: '100%',
				// minWidth: '100px'
			},
			'& MuiInputBase-root':{
				marginLeft: '10px'
			},
			'& .MuiButton-textSecondary': {
				minWidth: '48px',
				height: '48px',
				marginLeft: '10px',
				color: theme.palette.button.color,
				border: theme.palette.button.borderColor,
				borderRadius: theme.palette.button.radius,
				'&:hover':{
					backgroundColor: theme.palette.button.hover,
				}
			},
			'& .MuiIconButton-root': {
				color: theme.palette.button.color,
			}
		},
		moreButton: {
			padding: '2px 15px 0 15px',
			display: 'flex',
			margin: '10px auto 10px',
			minWidth: '48px',
			height: '48px',
			border: theme.palette.button.borderColor,
			borderRadius: '50px',
			'&:hover':{
				backgroundColor: theme.palette.button.hover,
			}
		},
		searchByFilter:{
			width: '150px',
			marginLeft: '10px'
		},
		searchInput:{
			marginLeft: '10px',
			height: '52px',
			flexShrink: '4 !important',
			'& .MuiIconButton-colorSecondary': {
				padding: theme.spacing(2),
				'&:hover': {
					backgroundColor: theme.palette.button.background
				}
			},
		},
		wrapSearchNodeManagement: {
			[theme.breakpoints.down('900')]: {
				width: '100%',
				paddingTop: theme.spacing(3),
			},
		},
		doesNotExist: {
			textAlign: 'center',
			width: '100%',
			paddingTop: '30px',
			paddingBottom: '30px'
		}
	};
};

class Tree extends Component {
			constructor(props) {
				super(props);

				const nodeManagementSearch = sessionStorage.getItem('nodeManagemntSaveValue')
				
				this.searchInputRef = React.createRef();

				this.state = {
					currentItem: [],
					edit: false,
					create: false,
					trash: false,
					reset: false,
					createMerchant: false,
					isSideBarOpen: sideBarState(),
					nodeFilters: 'Merchants',
					filterSearchValue: nodeManagementSearch ?? '',
					deleteIdTerminal: '',
					deleteNameRoomMerchant: ''
				};

			}

	componentDidMount() {
		const { merchants, merchantsCount } = this.props;
		// if (current) {
		// 	switch(current.table) {
		// 		case 'merchants':
		// 			if (document.querySelector(`#merchant${current.index}`)) {
		// 				document.querySelector(`#merchant${current.index}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
		// 			}
		// 		case 'rooms':
		// 			if (document.querySelector(`#room${current.index}`)) {
		// 				document.querySelector(`#room${current.index}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
		// 			}
		// 		case 'terminals':
		// 			if (document.querySelector(`#terminal${current.index}`)) {
		// 				document.querySelector(`#terminal${current.index}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
		// 			}
		// 		default: 
		// 			return;
		// 	}
		// }

		// if (rRender(user.resources, 'merchants', 'allow_view') && merchants.length <= 1) {
		// 	fetchMerchants();
		// } else if (rRender(user.resources, 'rooms', 'allow_view') && rooms.length <= 1) {
		// 	fetchRooms();
		// } else if (rRender(user.resources, 'terminals', 'allow_view') && terminals.length <= 1) {
		// 	fetchTerminals();
		// }

		if (!merchants.length || merchantsCount > 0)
			this.updateMerchants(0);

		// window.addEventListener('scroll', this.handleScrollBottom.bind(this));
	}

	// handleScrollBottom(e) {
	// 	const { merchants } = this.props;
		
	// 	const $scrlTop = window.scrollY;
	// 	const $docHght = document.body.clientHeight;
	// 	const $wndwHght = window.screen.height;
	// 	const offset = merchants.length;

	// 	if ($scrlTop >= $wndwHght) {
	// 		fetchMerchants({ offset });
	// 	}
	// }

	// componentWillUnmount() {
	// 	window.removeEventListener('scroll', this.handleScrollBottom.bind(this));
	// }

	updateMerchants = (offset) => {
		const { fetchMerchants } = this.props;

		fetchMerchants({ offset });
	}

	handleShowMoreButtonClick = () => {
		const { merchants } = this.props;
		
		const offset = merchants.length; 

		this.updateMerchants(offset);
	}

	handlerEdit = item => {
		this.setState({
			currentItem: item,
			edit: true,
			create: false,
			trash: false
		}); 
	};

	handlerCreate = item => {
		this.setState({
			currentItem: item,
			create: true,
			edit: false,
			trash: false
		});
	};

	handlerRemove = item => {
		this.setState({
			currentItem: item,
			edit: false,
			create: false,
			trash: true,
			deleteIdTerminal: item.id ? item.id : '',
			deleteNameRoomMerchant: item.title ? item.title : ''
		});
	};

	handlerCloseAll = () => {
		this.setState({
			currentItem: null,
			edit: false,
			create: false,
			trash: false,
			reset: false,
		});
	};

	handlerReset = (item) => {
		this.setState({
			currentItem: item,
			edit: false,
			create: false,
			trash: false,
			reset: true,
		});
	};
	componentDidUpdate(prevProps, prevState){
		const {roomKeys} = this.props;
			if(prevState.currentItem !== this.props.roomKeys){
				if(prevState.currentItem?.nodeType === 'room' && roomKeys.nodeType === 'room'){
				this.setState({
					...this.state,
					currentItem: roomKeys
				})		
			}
		} 

	}

	answerModalReset = answer => {
		const { currentItem } = this.state;
		const { fetchResetTerminal, setSelectedNode, user } = this.props;

		if (answer) {
			if (currentItem.nodeType === 'terminal') {
				setSelectedNode(currentItem.room_id, 'room', user.resources);
				fetchResetTerminal(currentItem.id);
			}

			this.handlerCloseAll();
		}
		this.handlerCloseAll();
	};

	answerModalDeleteRoom = answer => {
		const { currentItem } = this.state;

		const { fetchDeleteRoom, setSelectedNode, user } = this.props;
		if (answer) {
			if(currentItem.nodeType === 'room') {	
				setSelectedNode(currentItem.room_id, 'room', user.resources)
				fetchDeleteRoom(currentItem.id)
			}	
			this.handlerCloseAll();	
		}
		this.handlerCloseAll();
	}

	answerModalDeleteMerchant = answer => {
		const { currentItem } = this.state;
		const { fetchDeleteMerchant, setSelectedNode, user } = this.props;
		if (answer) {
			if(currentItem.nodeType === 'merchant') {	
				setSelectedNode(currentItem.merchant_id, 'merchant', user.resources)
				fetchDeleteMerchant(currentItem.id)
			}	
			this.handlerCloseAll();	
		}
		this.handlerCloseAll();
	}

	answerModalDeleteTerminal = answer => {
		const { currentItem } = this.state;
		const { fetchDeleteTerminal, setSelectedNode, user } = this.props;

		if (answer) {
			if (currentItem.nodeType === 'terminal') {
				setSelectedNode(currentItem.room_id, 'room', user.resources);
				fetchDeleteTerminal(currentItem.id);
			}

			this.handlerCloseAll();
		}
		this.handlerCloseAll();
	};

	handlerCreateMerchant = values => {
		const { fetchAddMerchant } = this.props;

		return fetchAddMerchant(
			{
				title: _.trimStart(values.title),
				callback_url: values.callback_url,
				buyers_url: values.buyers_url
			},
			this.handlerCloseAll
		).catch(error => {
			throw error;
		});
	};

	handlerEditMerchant = values => {
		const { fetchEditMerchant } = this.props;
		const { currentItem } = this.state;

		return fetchEditMerchant(
			currentItem.id,
			{
				title: _.trimStart(values.title),
				callback_url: values.callback_url,
				buyers_url: values.buyers_url
			},
			this.handlerCloseAll
		).catch(error => {
			throw error;
		});
	};

	handlerCreateRoom = values => {
		const { fetchAddRoom } = this.props;
		const { currentItem } = this.state;

		return fetchAddRoom(
			{
				title: _.trimStart(values.title),
				merchant_id: currentItem.id,
				club_name: values.club_name,
				timezone: values.timezone
			},
			this.handlerCloseAll
		).catch(error => {
			throw error;
		});
	};

	handlerEditRoom = values => {
		const { fetchEditRoom } = this.props;
		const { currentItem } = this.state;

		return fetchEditRoom(
			currentItem.id,
			{
				title: _.trimStart(values.title),
				merchant_id: values.merchant_id,
				private_key: values.private_key,
				public_key: values.public_key,
				club_name: values.club_name,
				timezone: values.timezone
			},
			this.handlerCloseAll
		).catch(error => {
			throw error;
		});
	};

	handlerCreateTerminal = values => {
		const { fetchAddTerminal } = this.props;
		const { currentItem } = this.state;
		const data = {
			terminal_id: values.terminal_id,
			terminal_password: values.terminal_password,
			validator: !!values.validator,
			printer: !!values.printer,
			dispenser: !!values.dispenser,
			room_id: currentItem.id,
			currency: values.currency,
			one_to_all: !!values.one_to_all
		};
		if (!values.one_to_all) data['buyer_id'] = values.buyer_id;
		return fetchAddTerminal(data, this.handlerCloseAll).catch(error => {
			throw error;
		});
	};

	RefreshKeys = () => {
		const { currentItem } = this.state;
		const { fetchRefreshKeys } = this.props;
		fetchRefreshKeys(currentItem.id, this.handlerCloseAll);
	};

	getUserAccesses = (user) => ({
		merchants: {
			allow_view: rRender(user.resources, 'merchants', 'allow_view'),
			allow_create: rRender(user.resources, 'merchants', 'allow_create'),
			allow_update: rRender(user.resources, 'merchants', 'allow_update'),
			allow_delete: rRender(user.resources, 'merchants', 'allow_delete'),
		},
		rooms: {
			allow_view: rRender(user.resources, 'rooms', 'allow_view'),
			allow_create: rRender(user.resources, 'rooms', 'allow_create'),
			allow_update: rRender(user.resources, 'rooms', 'allow_update'),
			allow_delete: rRender(user.resources, 'rooms', 'allow_delete'),
		},
		terminals: {
			allow_view: rRender(user.resources, 'terminals', 'allow_view'),
			allow_create: rRender(user.resources, 'terminals', 'allow_create'),
			allow_update: rRender(user.resources, 'terminals', 'allow_update'),
			allow_delete: rRender(user.resources, 'terminals', 'allow_delete'),
		}
	})

	handleNodeFilters = (e) => {
		const value = e.target.value;
    this.setState(
			{
				...this.state,
				nodeFilters: value
			});	
  	};

	handleSearchChange = (e) => {
		// const value = e.target.value;
		const regex = /[~,`,!,@,#,$,%,^,&,*,(,),=,+,:,;,,?,<,>,{}]/g,
			  value = e.target.value.replace(regex, '')
		this.setState({
				filterSearchValue: value
			}, () => {
				sessionStorage.setItem('nodeManagemntSaveValue', value)
		});		
	}	

	handleSearchClick = value => {
		const { resetFilteredMerchants } = this.props;

		if (value === '') {
			resetFilteredMerchants();
		}

		this.setState({
			filterSearchValue: value
		}, () => this.updateFilteredMerchants());
	}

	handleKeyPress = (value) => {
		const { resetFilteredMerchants } = this.props;

			if (value === '') {
				resetFilteredMerchants();
			}
			
			this.setState({
				filterSearchValue: value
			}, () => {
				this.updateFilteredMerchants();
			});
	}

	clearAll = () => {
		const { resetFilteredMerchants } = this.props;
		this.setState(
			{
				nodeFilters: 'Merchants',
				filterSearchValue: ''
			}, () => { 
				sessionStorage.removeItem('nodeManagemntSaveValue', '')
				resetFilteredMerchants();
				this.updateFilteredMerchants();
			});
	};
	
	updateFilteredMerchants = async () => {
		const { fetchMerchants } = this.props;
		const {nodeFilters, filterSearchValue} =	this.state;

		const data = {};

		// if(nodeFilters !== 'All' && (nodeFilters === 'Merchants' || nodeFilters === 'Rooms'))	data['filter_title'] = nodeFilters;
		// if(nodeFilters === 'Terminals')	data['filter_id'] = nodeFilters;
	
		if(nodeFilters === 'Merchants') {
			if(Boolean(filterSearchValue) === true ){
				data['filter_title'] = filterSearchValue;
				// data['filter_title'] = 'test';
			}
			sessionStorage.setItem('fetchMercahntStateParams', JSON.stringify(data));
			
			fetchMerchants(data);
		}

	// 	if(nodeFilters === 'Rooms') {
	// 		data['filter_title'] = filterSearchValue;	
	// 		fetchRooms(data);
	//  }
		// if(nodeFilters === 'Terminals') {
		// 	data['filter_id'] = filterSearchValue;
		// 	// fetchRoomTerminals(data)
		// }
	};


	render() {
		const {
			isLoading,
			classes, 
			user, 
			filteredMerchants,
			merchantsCount,
			rooms, 
			terminals, 
			merchantIdRequstingRooms,
			selected
		} = this.props;

		let { merchants } = this.props;

		const { 
			edit, 
			create, 
			trash, 
			reset, 
			currentItem, 
			isSideBarOpen, 
			isOpen,
			filterSearchValue,
			nodeFilters,
			deleteNameRoomMerchant,
			deleteIdTerminal
		} = this.state;

		if (!rRender(user.resources, 'merchants', 'allow_view')) {
			return <Redirect to="/"	/>
		}

		const accesses = this.getUserAccesses(user);
		const accessDepth = accesses.merchants.allow_view ? 'merchants'
			: accesses.rooms.allow_view ? 'rooms'
			: 'terminals';

		if (filteredMerchants) {
			merchants = filteredMerchants;
		}	

		const currentMerchant = (!currentItem || !currentItem.merchant_id) ? {} 
		: merchants && merchants.length ? merchants.find(item => item.id === currentItem.merchant_id) : {};

		const searchFieldPlaceholder = nodeFilters === 'Merchants' ? 'Merchant title'
			: nodeFilters === 'Rooms' ? 'Room title'
			: nodeFilters === 'Terminals' ? 'Terminal ID' : 'Search value';

		const selectedItem = selected.nodeType === 'root' ? {} : selected[selected.nodeType];

		return (
			<>
				{ isLoading && <PreloaderOverlay /> }
				 <div className={classes.root} id={'node-map-wrapper'}>
					{reset && (
						<ModalAlert
							answer={this.answerModalReset}
							text={'Terminal machine will be reset to Default state and new Terminal Id will be assigned to it. All Terminal settings will be saved!'}
							titel={'Reset terminal'}  
						/>
					)}
					{trash && (
						<ModalAlert
							answer={this.answerModalDeleteTerminal}
							text={`Terminal ${deleteIdTerminal} will be removed from dashboard without possibility to undo`}
							titel={'Remove terminal'}
						/>
					)}
						{trash && currentItem && currentItem.nodeType === 'merchant' && (
						<ModalAlert
							answer={this.answerModalDeleteMerchant}
							text={`Merchant ${deleteNameRoomMerchant} will be removed from dashboard without possibility to undo`}
							titel={'Remove Merchant'}
						/>
					)}
					{edit && currentItem && currentItem.nodeType === 'merchant' && (
						<MerchantEdit
							formData={currentItem}
							handlerClose={this.handlerCloseAll}
							onSubmit={this.handlerEditMerchant}
						/>
					)}
					{create && (
						<MerchantCreate
							handlerClose={this.handlerCloseAll}
							onSubmit={this.handlerCreateMerchant}
						/>
					)}
					{trash && currentItem && currentItem.nodeType === 'room' && (
						<ModalAlert
							maxWidth='md'
							answer={this.answerModalDeleteRoom}
							text={`Room ${deleteNameRoomMerchant} will be removed from dashboard without possibility to undo`}
							titel={'Remove Room'}
						/>
					)}
					{edit && currentItem && currentItem.nodeType === 'room' && (
						<RoomEdit
							RefreshKeys={this.RefreshKeys}
							formData={currentItem}
							handlerClose={this.handlerCloseAll}
							onSubmit={this.handlerEditRoom}
						/>
					)}
					{create && currentItem && currentItem.nodeType === 'merchant' && (
						<RoomCreate
							onSubmit={this.handlerCreateRoom}
							formData={{ merchant_id: currentItem.id }}
							handlerClose={this.handlerCloseAll}
						/>
					)}
					{create && currentItem && currentItem.nodeType === 'room' && (
						<TerminalCreate
							roomData={currentItem}
							merchantData={currentMerchant}
							handlerClose={this.handlerCloseAll}
							onSubmit={this.handlerCreateTerminal}
						/>
					)}
					{user.role_code === 'super_admin' && (
						<div stickyHeader className={classes.controlsWrapper}>
							<Controls 
								customId="add-merchant-button"
								handlerCreate={this.handlerCreate}
								handlerEdit={this.handlerEdit}
								item={selectedItem}
								config={{
									create: rRender(user.resources, accessDepth, 'allow_create'),
									current: false,
									trash: false
								}}
							/>
							<Tooltip  title="Default sort" aria-label="Default">
								<Button color='secondary'
												onClick={this.clearAll}> 
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
									value={nodeFilters}
									onChange={this.handleNodeFilters}
									>
										{_.map(filtersHalls, item =>(
											<MenuItem key={item} disabled={item === 'Rooms'|| item === 'Terminals'} value={item}>{item}</MenuItem>
										))}
								</Select>
							</FormControl>
								<div className={classes.wrapSearchNodeManagement}>
									<TextField
										color="secondary"
										className={classes.searchInput}
										label='Search'
										variant='outlined'
										onChange={this.handleSearchChange}
										inputRef={this.searchInputRef}
										value={!filterSearchValue ? '' : filterSearchValue}
										placeholder={searchFieldPlaceholder}
										// error={ filteredMerchants === null || filteredMerchants.length ? false : true}
										// helperText={ filteredMerchants === null || filteredMerchants.length  ? "" : "Merchant does not exist."}
										// helperText={ filteredMerchants === null || filteredMerchants.length  ? "" : "Latin letters and numbers only."}
										onKeyPress={(e) => {
											if (e.key === "Enter") {
													this.handleKeyPress(filterSearchValue)
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
					)}

					<div className={classNames(classes.tree, { 
						[classes.treeOpenSideBar]: isSideBarOpen,
						[classes.treePaddingTop]: user.role_code !== 'super_admin'
					})}>
						{/* <div className={classNames(classes.merchantsRow, {[classes.merchantsRowOpenSideBar]: isSideBarOpen })}> */}


						{ accessDepth === 'merchants' && 							
							
							merchants.length === 0 
								?  <div className={classes.doesNotExist} >Merchant does not exist.</div>	
								: _.map(merchants, merchant => {
									const merchantRooms = rooms.filter(room => room.merchant_id === merchant.id);
									return <Merchant 
										id={merchant.id}
										key={`merchant_node_${merchant.id}`}
										rooms={merchantRooms}
										terminals={terminals}
										merchant={merchant}
										handlerEdit={this.handlerEdit}
										handlerCreate={this.handlerCreate}
										handlerRemove={this.handlerRemove}
										handlerReset={this.handlerReset}
										fetchRoomTerminals={fetchRoomTerminals}
										merchantIdRequstingRooms={merchantIdRequstingRooms}
										accesses={accesses}
										config={{
											edit: accesses.merchants.allow_update,
											create: accesses.rooms.allow_create,
											current: true,
											trash: accesses.merchants.allow_delete
										}}
									/>								
								})
							
						}


						{(
							accessDepth === 'rooms' /*|| (accessDepth === 'merchants'&& merchants.length === 0)*/) && _.map(rooms, room => {
								const roomTerminals = terminals.filter(terminal => room.id === terminal.room_id);

								return <Room 
									id={room.id}
									key={`room_node_${room.id}`}
									isRoot={true}
									terminals={roomTerminals}
									room={room}
									accesses={accesses}
									handlerEdit={this.handlerEdit}
									handlerCreate={this.handlerCreate}
									handlerRemove={this.handlerRemove}
									handlerReset={this.handlerReset}
									fetchRoomTerminals={fetchRoomTerminals}
									config={{
										edit: accesses.rooms.allow_update,
										create: accesses.terminals.allow_create,
										current: true,
										// trash: rRender(user.resources, 'rooms', 'allow_delete')
										trash: accesses.rooms.allow_delete
									}}
								/>
						})}
						{(
							accessDepth === 'terminals' 
							|| (accessDepth !== 'terminals' && merchants.length === 0 && rooms.length === 0)
						) && _.map(terminals, terminal => {
							return <Terminal
								id={terminal.id}
								key={`terminal_node_${terminal.id}`}
								isRoot={true}
								accesses={accesses}
								handlerRemove={this.handlerRemove}
								handlerReset={this.handlerReset}
								config={{
									edit: false,
									create: false,
									current: true,
									trash: accesses.terminals.allow_delete,
									reset: accesses.terminals.allow_view && accesses.terminals.allow_update,
								}}
								terminal={terminal}
							/>
						})}
						{/* </div> */}
					</div>
					{
						(merchantsCount && merchantsCount > merchants.length) ?
							<Button id={'defaultSort'} onClick={this.handleShowMoreButtonClick} size="small" className={classes.moreButton}>
								Show more...
							</Button> : ''
					}
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	isLoading: state.merchants.isLoading,
	user: state.authorization.userData.user,
	rooms: state.merchants.rooms,
	selected: state.selected,
	terminals: state.merchants.terminals,
	merchants: state.merchants.merchants,
	filteredMerchants: state.merchants.filteredMerchants,
	merchantsCount: state.merchants.merchantsCount,
	merchantIdRequstingRooms: state.merchants.merchantIdRequstingRooms,
	roomIdRequestingTerminals: state.merchants.roomIdRequestingTerminals,
	roomKeys: state.merchants.roomKeys
});

const mapDispatchToProps = {
	fetchAddMerchant,
	fetchAddRoom,
	fetchAddTerminal,
	fetchEditMerchant,
	fetchEditRoom,
	fetchRefreshKeys,
	fetchDeleteTerminal,
	fetchDeleteMerchant,
	setSelectedNode,
	fetchResetTerminal, 
	fetchMerchantRooms,
	fetchRoomTerminals,
	fetchMerchants,
	fetchRooms,
	fetchDeleteRoom,
	resetFilteredMerchants
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles),
)(Tree);
