import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
	fetchTerminalsState,
	fetchTerminalON,
	fetchTerminalOFF,
} from '../../../ducks/widgets';
import { setSelectedNode } from '../../../ducks/selected'; 
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import TableControls from '../../TableControls/TableControlSlickyHeader';
import CreatorTableHeader from '../../CreatorTableHeader';
import StatusLabel from '../../../core/StatusLabel';
import { statusTerminal } from '../../../utils/helper';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	LinearProgress,
	Zoom
} from '@material-ui/core';

import ModalAlert from '../../modals/ModalAlert';
import CurrentIcon from '@material-ui/icons/TouchApp';
import Tooltip from '@material-ui/core/Tooltip';
import TerminalDetailsModal from './TerminalDetailsModal';
import classNames from 'classnames';
import { compose } from 'redux';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import PreloaderOverlay from '../../preloaders/PreloaderOverlay';
import Preloader from '../../preloaders/Preloader';

const styles = theme => ({
	root: {
		marginTop: theme.spacing(3),
		[theme.breakpoints.between('xs','sm')]: {
			marginTop: theme.spacing(1),
		},
		width: '100%',
		'& .MuiTableCell-stickyHeader': {
			top: '168px!important',
			height: '56px',
			fontWeight: 700,
			[theme.breakpoints.down('sm')]:{
				top: '0px!important',
			}
		},
		'& .MuiButton-root':{
			color: theme.palette.button.color,
			minWidth: '52px',
			padding: theme.spacing(3),
			border: theme.palette.button.borderColor,
			borderRadius: '50%',
			"&:hover": {
				backgroundColor: theme.palette.button.hover + '!important',
			}
		},
		'& .MuiTableRow-root':{
			height: '56px'
		},
		'& .MuiTableCell-root': {
			padding: theme.spacing(0, 1, 0, 1),
		}
	},
	table: {
		width: '100%',
		[theme.breakpoints.down('sm')]:{
			overflow: 'auto'
		}
		// position: 'relative',
	},
	controls: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	loading: {
		height: '4px',
		width: '100%'
	},
	ok: {
		background: '#c8e6c9',
		cursor: 'pointer'
	},
	warning: {
		background: '#ffecb3',
		cursor: 'pointer'
	},
	error: {
		background: '#ffcdd2',
		cursor: 'pointer'
	},
	activeTerminal: {
		backgroundColor: theme.palette.table.selectedTerminalTableRow,
		zIndex: 0,
		"&:hover": {
			backgroundColor: theme.palette.table.hoverSelectedTerminalTableRow + '!important',
		}
	},
	wrapperTableControl: {
		[theme.breakpoints.down('700')]: {
		},
	}
});

const TerminalConfig = {
	title: `Terminal`,
	allowDescription: true,
	listConfig: [
		{
			prop: 'id',
			label: 'Terminal ID',
		},
		{
			prop: 'is_on',
			label: 'Terminal ON/OFF',
			isButton: true,		
			isIcon: true,
			stage: 1
		},
		{
			prop: 'is_connected',
			label: 'Connected',
			isIcon: true,
			stage: 3
		},
		{
			prop: 'printer',
			section: 'Printer',
			isObj: true,
			objProp: 'is_exist',
			label: 'is exist',
			value: null,
			isIcon: true,
			stage: 2
		},
		{
			prop: 'printer',
			section: 'Printer',
			isObj: true,
			objProp: 'is_on',
			label: 'is on',
			value: null,
			isIcon: true,
			stage: 2
		},
		{
			prop: 'validator',
			section: 'Validator',
			isObj: true,
			objProp: 'is_exist',
			label: 'is exist',
			value: null,
			isIcon: true,
			stage: 2
		},
		{
			prop: 'enabled_by_platform',
			label: 'Platform enabled',
			isIcon: true,
			stage: 2
		},
		{
			prop: 'validator',
			section: 'Validator',
		 	isObj: true,
		 	objProp: 'is_on',
		 	label: 'is on',
		 	value: null,
			isIcon: true,
			stage: 2
		},
		{
			prop: 'validator',
			section: 'Validator',
		 	isObj: true,
		 	objProp: 'space_left',
		 	label: 'space left',
			value: null,
		},
		{
			prop: 'dispenser',
			section: 'Dispenser',
		 	isObj: true,
		 	objProp: 'is_exist',
		 	label: 'is exist',
			value: null,
			isIcon: true,
			stage: 2
		},
		{
			prop: 'dispenser',
			section: 'Dispenser',
		 	isObj: true,
		 	objProp: 'is_on',
		 	label: 'is on',
			value: null,
			isIcon: true,
			stage: 2
		},
		{
			prop: 'one_to_all',
			label: 'ATM mode',
			isIcon: true,
			stage: 2
		}
	]
};

const rows = [
	{
		id: 'setCurrent',
		numeric: false,
		disablePadding: false,
		label: '',
		disableSort: true
	},
	{
		id: 'id',
		numeric: false,
		center: true,
		disablePadding: false,
		label: 'ID',
		disableSort: true
	},
	{
		id: 'terminal_on',
		center: true,
		disablePadding: false,
		label: 'ON/OFF',
		disableSort: true
	},
	{
		id: 'is_connected',
		center: true,
		disablePadding: false,
		label: 'Connect',
		disableSort: true
	},
	{
		id: 'printer_on',
		center: true,
		disablePadding: false,
		label: 'Printer',
		disableSort: true
	},
	{
		id: 'validator_on',
		center: true,
		disablePadding: false,
		label: 'Validator',
		disableSort: true
	},
	{
		id: 'dispenser_on',
		center: true,
		disablePadding: false,
		label: 'Dispenser',
		disableSort: true
	},

	{
		id: 'enabled_by_platform',
		center: true,
		disablePadding: false,
		label: 'Platform enabled',
		disableSort: true
	},
	{
		id: 'space_left',
		center: true,
		disablePadding: false,
		label: 'Space left',
		disableSort: true
	},
	{
		id: 'one_to_all',
		center: true,
		disablePadding: false,
		label: 'ATM mode',
		disableSort: true
	}
];

class TerminalStatus extends Component {
	constructor(props) {
		super(props);

		// this.debouncedUpdateData = _.debounce(this.updateData, 1000);
		const savedTerminalIdSearchValue = sessionStorage.getItem('TerminalIdSearch');

		this.state = {
			page: 0,
			sortBy: 'id',
			asc: false,
			terminalInfo: {},
			modalTerminalInfo: false,
			modalTerminalInfoClosing: false,
			focusItem: null,
			modalOnOffTerminal: false,
			isLoadingTable: false,
			isTableUpdated: false,
			prevTerminals: [],
			filterById: savedTerminalIdSearchValue ?? '',
		};
	}

	componentDidMount() {
		const { terminals, selected } = this.props;

		if (!terminals?.length || selected.nodeType !== 'terminal') {
			this.updateData();
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const isNewTerminals =  _.isEqual(nextProps.terminals, prevState.prevTerminals);
		const toState = {};
		let terminalInfo = null;

		toState['isLoadingTable'] = prevState.isTableUpdated ? true : isNewTerminals;
		toState['isTableUpdated'] = false;

		if (nextProps.terminals?.length && _.isEmpty(prevState.terminalInfo) === false) {
			terminalInfo = nextProps.terminals?.find(terminalItem => terminalItem.id === prevState.terminalInfo.id);
		}
		if (terminalInfo) {
			toState['terminalInfo'] = terminalInfo;
		}
		if (prevState.modalTerminalInfoClosing && nextProps.fixPeripheralLoading === false) {
			toState['terminalInfo'] = {};
			toState['modalTerminalInfo'] = false;
			toState['modalTerminalInfoClosing'] = false;
		}

		return toState;
	}

	handleSort = property => {
		this.setState(state => {
			return {
				sortBy: property,
				asc: state.sortBy === property ? !state.asc : true
			};
		}, this.updateData);
	};
	
	handleSearchClick = (value) => {
		this.setState({
			filterById: value
		}, () => {
		sessionStorage.setItem('TerminalIdSearch', value);
		this.updateData()
		});
	}

	handleSelectTerminal = (e, item) => {
		e.stopPropagation();

		this.setCurrentTerminal(item.id);
	}
	
	updateData = async () => {
		const {fetchTerminalsState} = this.props;
		const {page, filterById} = this.state;
		const data = {
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
			id: 'asc'
		}
			
		if(filterById){
		 data['filter_id'] = filterById
		}

		sessionStorage.setItem('fetchTerminalStateParams', JSON.stringify(data));
		fetchTerminalsState(data);

	};

	handleUpdate = () => {
		this.setState({
			isTableUpdated: true,	
		}, ()=> {
			sessionStorage.removeItem('TerminalIdSearch');
			this.updateData();	
		});
	}

	handleOpenTerminalInfo = item => {
		this.setState({
			terminalInfo: item,
			modalTerminalInfo: true
		});
	};

	handleSort = property => {
		this.setState(state => {
			return {
				sortBy: property,
				asc: state.sortBy === property ? !state.asc : true
			};
		}, this.updateData);
	};

	handleChangePage = (e, page) => {
		this.setState({page: page}, this.updateData);
	};

	handleSubmitToggleStateTerminal = answer => {
		const {fetchTerminalON, fetchTerminalOFF} = this.props;
		const {focusItem} = this.state;

		if (answer) {
			if (focusItem.is_on) fetchTerminalOFF(focusItem.id);
			else fetchTerminalON(focusItem.id);
		}

		this.setState({modalOnOffTerminal: false});
	};

	handleCloseTerminalInfo = () => {
		this.setState({ modalTerminalInfoClosing: true });
		// this.setState({terminalInfo: {}, modalTerminalInfo: false}); //Old implementation of terminal modal info closing 
	};

	handleToggleStateTerminal = item => {
		this.setState({focusItem: item, modalOnOffTerminal: true});
	};

	setCurrentTerminal = (id) => {
		const { 
			setSelectedNode,
			user
		} = this.props;

		setSelectedNode(id, 'terminal', user.resources)
	}

	handleFilterById = e => {
		const value = e.target.value;
		this.setState({
			filterById: value
		});
	}

	render() {
		const { terminals, classes, loading, count, selected, fixPeripheralLoading } = this.props;
		const {
			modalTerminalInfo,
			terminalInfo,
			focusItem,
			modalOnOffTerminal,
			isLoadingTable,
			page,
			filterById
		} = this.state;

		const itemsBody = _.map(terminals, item => {
			
			const isActiveTerminal = selected?.terminal?.id === item.id;

			const {dispenser, printer, validator} = item;
			return (
				<TableRow
					className={classNames(classes.tableRow, {
						[classes.activeTerminal]: isActiveTerminal
					})}
					hover
					key={item.id}	
					onClick={() => this.handleOpenTerminalInfo(item)}
				>
					<TableCell component="th" scope="row">
						<Tooltip title="Select" aria-label="Select">
							<Button 
								color='primary'
								style={{'marginLeft': '8px'}}
								id={`Terminal_${item.id}`} 
								onClick={(e) => this.handleSelectTerminal(e, item)}
								>
								<CurrentIcon color='primary'/>
							</Button>
						</Tooltip>
					</TableCell>
					<TableCell  align="left" component="th" scope="row">
						<div style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', "minWidth": '120px'}}>
							<TableCell style={{'width': '24px', 'height':'24px', 'padding': '2px', 'borderBottom': 'none'}}>
								{	!(dispenser.is_no_error && printer.is_no_error && validator.is_no_error) && 
										<ReportProblemOutlinedIcon style={{'color':'#f44336', 'textAlign': 'center' }} fontSize='small'/> 
								}	
							</TableCell>
							<TableCell style={{'borderBottom': 'none'}}>
								Terminal {item.id}
							</TableCell>
						</div>
					</TableCell>
					<TableCell align="center">
						<Button 
							color='primary'
							onClick={e => {
								e.stopPropagation();
								this.handleToggleStateTerminal(item);
							}}
						>
							<StatusLabel status={statusTerminal({stageData: item.is_on}, 1)}/>
						</Button>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.is_connected}, 3 )}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({ stageData: item.printer }, 4)}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({ stageData: item.validator }, 4)}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({ stageData: item.dispenser }, 4)}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.enabled_by_platform}, 2 )}/>
					</TableCell>
					<TableCell align="center">
						{item.validator && item.validator.space_left}
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.one_to_all}, 2)} />
					</TableCell>
				</TableRow>
			);
		});
		
		return (
			<div className={classes.root}>
				{ fixPeripheralLoading && <PreloaderOverlay /> }
				{modalOnOffTerminal && (
					<ModalAlert
						answer={this.handleSubmitToggleStateTerminal}
						text={
							focusItem.is_on
								? 'Do you really want to turn off the terminal?'
								: 'Do you really want to turn on the terminal?'
						}
						titel={'Title'}
					/>
				)}
				{modalTerminalInfo && (
					<TerminalDetailsModal
						handleClose={this.handleCloseTerminalInfo}
						handlePowerTerminal={this.handleToggleStateTerminal}
						data={terminalInfo}
						config={TerminalConfig}
					/>
				)}
				<Paper>
					<div className={classes.loading}>
						{loading ? <LinearProgress/> : null}
					</div>

					<TableControls
						form={'bottom'}
						settings={['update', 'paginate', 'filter-id']}
						updateData={this.handleUpdate}
						textFilterValueId={filterById}
						handleChangePage={this.handleChangePage}
						handleSearchClick={this.handleSearchClick}
						handleFilterById={this.handleFilterById}
						// textFilterLabel="Find by ID"
						textFilterpPlaceholder="Terminal ID"
						page={page}
						count={count}
						addDashboardFalseCopipast={true}
					/>

					<div className={classes.table}>
						<Table stickyHeader size="medium" aria-label="sticky table">
							<TableHead>
								<TableRow>
									<CreatorTableHeader
										{...this.state}
										rows={rows}
										handleSort={this.handleSort}
									/>
								</TableRow>
							</TableHead>
							{ isLoadingTable 
								? <Zoom in={loading}>
									<TableBody>{itemsBody}</TableBody>
								</Zoom>
								: <TableBody>{itemsBody}</TableBody>
							}
						</Table>
					</div>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	terminals_list: state.merchants.terminals,
	user: state.authorization.userData.user,
	terminals: state.widgets.terminals.data,
	count: state.widgets.terminals.countPage,
	loading: state.widgets.terminals.loading,
	fixPeripheralLoading: state.widgets.fixPeripheralLoading,
	selected: state.selected
});

const mapDispatchToProps = {
	fetchTerminalsState,
	fetchTerminalON,
	fetchTerminalOFF,
	setSelectedNode,
};

export default compose(
	connect(mapStateToProps,mapDispatchToProps),
	withStyles(styles)
)(TerminalStatus);
