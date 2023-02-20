import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWithdraw, fetchCashOutWithraw } from '../ducks/withdraw';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import { Box, Button } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import LinearProgress from '@material-ui/core/LinearProgress';
import tm from 'moment-timezone';
import TableControls from '../components/TableControls';
import Zoom from '@material-ui/core/Zoom';
import CreatorTableHeader from '../components/CreatorTableHeader';
import ModalWithdrawCashOut from '../components/modals/ModalWithdrawCashOut';
import DoneIcon from '@material-ui/icons/Done';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TableDataDetails from '../components/modals/TableDataDetails';
import DispenserImage from '../assets/img/DispenserImage';
import PrintIcon from '@material-ui/icons/Print';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { rRender } from '../utils/helper';
import { compose } from 'redux';
import moment from 'moment';

const styles = theme => ({
	root: {
		marginTop: theme.spacing(1),
		'& .MuiTableCell-stickyHeader': {
			top: '163px!important',
			zIndex: '100'
		},
		[theme.breakpoints.between('xs','sm')]:{
			// overflowX: 'auto'
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
	wrapTableForScroll: {				

		[theme.breakpoints.down('1200')]:{
			overflowX: 'auto',
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
	statusSelect: {
		minWidth: '100pt',
		[theme.breakpoints.down('xs')]: {
			marginTop: theme.spacing(2),
		}
	},
	styleNoData:{
		padding: '10px 0',
		fontSize: '15px',
		lineHeight: '1.43',
		color: theme.palette.tableHeaderColor
	},
	withdrawTableControl: {	
		paddingTop: '4px',
		backgroundColor: theme.palette.tableControlPanelBG,	 
		position: 'sticky',
		top: '88px',
		zIndex: '1000',

		[theme.breakpoints.down('1200')]: {
			position: 'static',
			top: '0px!important',
		},

		'& > div': {
			flexWrap: 'wrap',
		},
		'& .wrapPageWithdraw': {

			[theme.breakpoints.down('900')]: {
				width: '100%',
				padding: `${theme.spacing(2)}px 0`,
				display: 'block'
			},

			[theme.breakpoints.down('600')]: {
				padding: `${theme.spacing(2)}px 0 0 0`,
			},
			
			'& > div': {
				[theme.breakpoints.down('900')]: {
					width: '100%',
					marginTop: `${theme.spacing(2)}px`,
				},
			}
		},
		'& .wrapPageWithdrawRightSearch': {
			[theme.breakpoints.down('1300')]: {
				width: '230px',
			},

			[theme.breakpoints.down('1200')]: {
				width: '100%',
				paddingTop: `${theme.spacing(1)}px`,
			}
		}
	}
});

const rows = [
	{
		id: 'id',
		numeric: false,
		disablePadding: false,
		label: 'ID'
	},
	{ 
		id: 'amount',
		numeric: true,
		disablePadding: false,
		label: 'Amount'
	},
	{ 
		id: 'created_at',
		numeric: true,
		disablePadding: false,
		label: 'Time'
	},
	{
		id: 'terminal_id',
		numeric: true,
		disablePadding: false,
		label: 'Terminal ID'
	},
	{
		id: 'buyer_id',
		numeric: true,
		disablePadding: false,
		label: 'Buyer ID',
		disableSort: true
	},
	{
		id: 'status',
		numeric: true,
		disablePadding: false,
		label: 'Status',
		disableSort: true
	},
	{
		id: 'type',
		numeric: true,
		disablePadding: false,
		label: 'Type',
		disableSort: true
	},
	{
		id: 'is_CashOut',
		numeric: true,
		disablePadding: false,
		label: 'CashOut',
		disableSort: true
	},
	{
		id: 'approve',
		numeric: false,
		alignCenter: true,
		disablePadding: false,
		label: 'Approve',
		disableSort: true
	}
];

const detailsModalConfig = {
	title: `Withdraw details`,
	allowDescription: true,
	listConfig: [
		{
			prop: 'id',
			label: 'Id' 
		},
		{
			prop: 'amount',
			label: 'Denomination'
		},
		{
			prop: 'status',
			label: 'Status',
			value: null
		},
		{
			prop: 'created_at',
			label: 'Created time',
			isDate: true
		},
		{
			prop: 'released_at',
			label: 'Released time',
			isDate: true
		},
		{
			prop: 'verified_at',
			label: 'Verified time',
			isDate: true
		},
		{		
			prop: 'terminal_id',
			label: 'Terminal Id' 
		},
		{		
			prop: 'buyer_id',
			label: 'Buyer Id' 
		},
		{
			prop: 'type',
			label: 'Withdraw type'
		}
	]
};

const withdrawStatusesConfig = {
	all: {
		text: 'All'
	},
	success: {
		is_released: true,
		is_verified: true,
		text: 'Success'
	},
	pendingSuccess: {
		is_released: true,
		is_verified: false,
		text: 'Pending for success'
	},
	cancelled: {
		is_released: false,
		is_verified: true,
		text: 'Cancelled'
	},
	other: {
		text: 'Pending for cancel',
		is_released: false,
		is_verified: false,
	}
}

class Withdraw extends Component {
	constructor(props) {
		super(props);
		this.debouncedHandleSearchClick = _.debounce(this.handleSearchClick, 1000);
	
		const savedStartDate = sessionStorage.getItem('withdrawStartDate');
		const savedEndDate = sessionStorage.getItem('withdrawEndDate');
		const savedStatusFilterValue = sessionStorage.getItem('withdrawStatusFilter');
		const savedBuyerIdSearchValue = sessionStorage.getItem('withdrawBuyerIdSearch');
		
		this.state = {
			page: 0,
			withdrawDateils: {},
			modalWithdrawDetails: false,
			detailsConfig: _.cloneDeep(detailsModalConfig),
			forcePage: 1,
			sortBy: 'id',
			asc: false,
			startDate: savedStartDate ? savedStartDate : tm()
				.utc()
				.startOf('month')
				.format('YYYY-MM-DD HH:mm:ss'),
			endDate: savedEndDate ? savedEndDate : tm()
				.utc()
				.endOf('day')
				.format('YYYY-MM-DD HH:mm:ss'),
			inputCashOut: {
				modal: false,
				id: '',
				value: '',
			},
			statusFilterValue: savedStatusFilterValue ?? 'All',
			buyerIdSearchValue: savedBuyerIdSearchValue ?? '',
		};
	}
	handleOpenWidthdrawDetails = (item, statusValue) => {
		this.prepareWithdrawDetailsConfig(item, statusValue);
		this.setState({
			withdrawDateils: item,
			modalWithdrawDetails: true
		});
	}
	handleCloseWithdrawDetails = () => {
		this.setState({
			withdrawDateils: {},
			modalWithdrawDetails: false,
			detailsConfig: _.cloneDeep(detailsModalConfig)
		})
	}
	prepareWithdrawDetailsConfig = (item, statusValue) => {
		const { listConfig } = this.state.detailsConfig; 
		let statusItem = listConfig.find(listConfigItem => listConfigItem.prop === 'status');
		let amountItem = listConfig.find(listConfigItem => listConfigItem.prop === 'amount');
		
		if (statusItem) {
			statusItem.value = statusValue;
		}
		if(amountItem) {
			amountItem.value = `${item.amount} ${item.currency}`;  
		}
		if(item.cheque_number) {
			listConfig.push({
				prop: 'cheque_number',
				label: 'Cheque number'
			});
		}
	}	
	clearAll = () => {
		this.setState(
			{
				page: 0,
				forcePage: 1,
				sortBy: 'id',
				asc: false,
				startDate: tm()
					.utc()
					.startOf('month')
					.format('YYYY-MM-DD HH:mm:ss'),
				endDate: tm()
					.utc()
					.endOf('day')
					.format('YYYY-MM-DD HH:mm:ss'),
				statusFilterValue: 'All',
				buyerIdSearchValue: '',
			},
			() => {
				sessionStorage.removeItem('withdrawStartDate');
				sessionStorage.removeItem('withdrawEndDate');
				sessionStorage.removeItem('withdrawBuyerIdSearch');
				sessionStorage.removeItem('withdrawStatusFilter');

				this.handleDateStartChange(moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))
				this.handleDateEndChange(moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
				
				this.updateData();
			}
		);
	};
	handleSort = property => {
		this.setState(state => {
			return {
				sortBy: property,
				asc: state.sortBy === property ? !state.asc : true
			};
		}, this.updateData);
	}
	checkDatesRageIsValid = (startDate, endDate) => {
		if (
			tm(endDate).isBefore(startDate, 'YYYY-MM-DD HH:mm:ss')
			|| tm(startDate).isAfter(endDate, 'YYYY-MM-DD HH:mm:ss')
		) {
			return false;
		}
		return true;
	};
	handleDateStartChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		const isDataRangeValid = this.checkDatesRageIsValid(tm(testZone).tz(selectedTimeZone).format(), this.state.endDate);

		if (moment(date).isValid() && isDataRangeValid) {
			sessionStorage.setItem('withdrawStartDate', date);

			this.setState(
				{
					startDate: tm(testZone)
						.tz(selectedTimeZone)
						.format()
				},
				this.updateData
			);
		}
	}
	handleDateEndChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		const isDataRangeValid = this.checkDatesRageIsValid(this.state.startDate, tm(testZone).tz(selectedTimeZone).format());

		if (moment(date).isValid() && isDataRangeValid) {
			sessionStorage.setItem('withdrawEndDate', date);

			this.setState(
				{
					endDate: tm(testZone)
						.tz(selectedTimeZone)
						.format()
				},
				this.updateData
			);
		}
	}
	handleChangeStatusFilter = (e) => {
		const value = e.target.value;

		this.setState({
			statusFilterValue: value
		}, () => {
			sessionStorage.setItem('withdrawStatusFilter', value);
			this.updateData();
		});
	}
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
	}




	componentDidMount() {
		if( !sessionStorage.getItem('withdrawStartDate') ){
			sessionStorage.setItem('withdrawStartDate', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('withdrawEndDate') ){
			sessionStorage.setItem('withdrawEndDate', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
		}	

		this.updateData();
	}




	componentDidUpdate(prevProps) {
		const { selected, selectedTimeZone } = this.props;

		if (!_.isEqual(prevProps.selectedTimeZone, selectedTimeZone)) {
			this.setState(prevState => {
				let testZoneStart = tm(
					tm(prevState.startDate).format('YYYY-MM-DD HH:mm:ss')
				).format('YYYY-MM-DD HH:mm:ss');
				let testZoneEnd = tm(
					tm(prevState.endDate).format('YYYY-MM-DD HH:mm:ss')
				).format('YYYY-MM-DD HH:mm:ss');
				return {
					...prevState,
					startDate: tm(testZoneStart)
						.tz(selectedTimeZone)
						.format(),
					endDate: tm(testZoneEnd)
						.tz(selectedTimeZone)
						.format()
				};
			});
		}
		if (!_.isEqual(prevProps.selected, selected)) {
			this.updateData();
		}
	}
	updateData = () => {
		const { selected, user, fetchWithdraw, selectedTimeZone } = this.props;
		const { page, sortBy, asc, startDate, endDate, statusFilterValue, buyerIdSearchValue } = this.state;

		let selectedTable = 'filter_';
		let selectedId = null;

		switch (selected.nodeType) {
			case 'terminal':
				selectedTable += 'terminal_id';
				selectedId = selected.terminal.id;
				break;
			case 'room':
				selectedTable += 'room_id';
				selectedId = selected.room.id;
				break;
			case 'merchant':
				selectedTable += 'merchant_id';
				selectedId = selected.merchant.id;
				break;
		}

		const data = {
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
			[sortBy]: asc ? 'asc' : 'desc',
			filter_created_at_start: tm(startDate)
				.tz(selectedTimeZone)
				.format(),
			filter_created_at_end: tm(endDate)
				.tz(selectedTimeZone)
				.format()
		};

		if (statusFilterValue !== 'All') {
			const statusData = Object.entries(withdrawStatusesConfig).find(([key, value]) => value.text === statusFilterValue);

			if (statusData) {
				data['filter_is_verified'] = statusData[1].is_verified;
				data['filter_is_released'] = statusData[1].is_released;
			}
		}
		if (!(selected.nodeType === 'root' && user.role_code === 'super_admin')) {
			data[selectedTable] = selectedId;
		}
		if (buyerIdSearchValue) {
			data['filter_buyer_id'] = buyerIdSearchValue.length < 50 
				? buyerIdSearchValue 
				: buyerIdSearchValue.slice(0, 50);
		}
		
		fetchWithdraw(data);
	}
	openModalCashOut = (e, id) => {
		this.setState(prevState => ({
			inputCashOut: { ...prevState.inputCashOut, id, modal: true }
		}));

		e.stopPropagation();
	}
	handleCashOut = () => {
		const { fetchCashOutWithraw } = this.props;
		const { inputCashOut } = this.state;
		fetchCashOutWithraw(inputCashOut.id);
		this.closeModalCashOut();
	}
	handleInputCashOutChange = e => {
		const value = e.target.value;
		this.setState(prevState => ({
			inputCashOut: { ...prevState.inputCashOut, value }
		}));
	}

	handleSearchChange = e => {
		const value = e.target.value;

		// this.debouncedHandleSearchClick(value);

		this.setState({
			buyerIdSearchValue: value
		}, () => {
			sessionStorage.setItem('withdrawBuyerIdSearch', value);
			// this.updateData()
		});
	}

	handleSearchClick = value => {
		this.updateData()
	}

	handleKeyPressEnter = (e) => {		
		if (e.key === "Enter") {
			this.handleSearchClick()
		} 		
	}

	closeModalCashOut = () => {
		this.setState({
			inputCashOut: {
				modal: false,
				id: '',
				value: ''
			}
		});
	}
	handleIngnoreClick = (e) =>{
		e.stopPropagation();
	}


	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('withdrawStartDate'),
			endDate: sessionStorage.getItem('withdrawEndDate')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('withdrawStartDate')))
			this.handleDateEndChange(moment(sessionStorage.getItem('withdrawEndDate')))

			this.updateData()
		})
	}

	render() {
		const {
			withdraw,
			classes,
			count,
			loading,
			selectedTimeZone,
			resources,
			theme
		} = this.props;

		const { 
			inputCashOut,
			withdrawDateils,
			modalWithdrawDetails,
			detailsConfig,
			statusFilterValue,
			buyerIdSearchValue
		} = this.state;

		const { 
			success: successStatus,
			pendingSuccess: pendingSuccessStatus,
			cancelled: cancelledStatus,
			other: otherStatuses
		} = withdrawStatusesConfig;

		const dispenserImageColor = theme.palette.type === 'light' ? '#000' : '#fff';

		const itemsBody = _.map(withdraw, item => {
			const isSuccess = item.is_released === successStatus.is_released && item.is_verified === successStatus.is_verified;
			const isPendingSuccess = item.is_released === pendingSuccessStatus.is_released && item.is_verified === pendingSuccessStatus.is_verified
			|| (
				item.is_released === false
				&& item.is_verified === false
				&& tm().tz(selectedTimeZone).isBefore(tm(item.created_at).tz(selectedTimeZone).add(30, 'seconds'))
			);
			const isCancelled = item.is_released === cancelledStatus.is_released && item.is_verified === cancelledStatus.is_verified;
			const statusTooltipText = isSuccess ? successStatus.text
				: isPendingSuccess ? pendingSuccessStatus.text
				: isCancelled ? cancelledStatus.text
				: otherStatuses.text;

			return (
				<TableRow
					hover={true}
					key={item.id}
					onClick={() => this.handleOpenWidthdrawDetails(item, statusTooltipText)}
				>
					<TableCell component="th" scope="row">
						{item.id}
					</TableCell>
					<TableCell align="right">
						{item.amount + ' ' + item.currency.toUpperCase()}
					</TableCell>
					<TableCell align="right">
						{tm(item.created_at)
							.tz(selectedTimeZone)
							.format('DD/MM/YYYY H:mm:ss')}
					</TableCell>
					<TableCell align="right">{item.terminal_id}</TableCell>
					<TableCell align="right"
							style={{width:'20%', whiteSpace: 'nowrap', maxWidth: '150px'}} 
							onClick={this.handleIngnoreClick}>
						 <Tooltip 
								title={item.buyer_id}
								aria-label="BuyerId"
								placement="top">
								<Box textOverflow="ellipsis" overflow="hidden">{item.buyer_id}</Box>
							</Tooltip>
					</TableCell>
					<TableCell align="right">
						<Tooltip 
							title={statusTooltipText}
							aria-label="statusTooltipText"
							placement="top"
						>
							{
								isSuccess ? <DoneIcon style={{ color: 'green' }}/>
								: isPendingSuccess ? <span style={{ width: '30px' }}><CircularProgress size={25} style={{ color: '#388e3c' }} /></span>
								: isCancelled ? <HighlightOffIcon color="secondary" />
								: <span style={{ width: '30px' }}><CircularProgress size={25} color="secondary" /></span>
							}
						</Tooltip>
					</TableCell>
					<TableCell align="right">
						<Tooltip 
							title={item.type}
							aria-label="statusTooltipText"
							placement="top"
						>
							{item.type === 'printer' ? <PrintIcon /> : <DispenserImage width={17} height={17} color={dispenserImageColor}/> }
						</Tooltip>
					</TableCell>
					<TableCell align="right">
						{item.is_CashOut ? (
							<Done />
						) : (
								<Clear />
							)}
					</TableCell>
					<TableCell align="center">
						{item.cash_out ? (
							<Done />
						) : (
								<Button
									disabled={rRender(resources, 'permissions', 'allow_view') ? true : false}
									onClick={(e) => this.openModalCashOut(e, item.id)}>
									CashOut
							</Button>
							)}</TableCell>

				</TableRow>
			);
		})

		return (
			<div>
				{modalWithdrawDetails && <TableDataDetails
						handleClose={this.handleCloseWithdrawDetails}
						data={withdrawDateils}
						config={detailsConfig}
						selectedTimeZone={selectedTimeZone}
					/>
				}
				<ModalWithdrawCashOut
					id={inputCashOut.id}
					open={inputCashOut.modal}
					value={inputCashOut.value}
					onChange={this.handleInputCashOutChange}
					handlerClose={this.closeModalCashOut}
					handlerDone={this.handleCashOut}
				/>
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>

					<div className={classes.withdrawTableControl}>
						<TableControls
							form={'top'}
							settings={['update', 'defaultSort', 'date', 'search']}
							clearAll={this.clearAll}
							updateData={this.handleUpdateData}
							page={this.state.page}
							handleChangePage={this.handleChangePage}
							handleDateStartChange={this.handleDateStartChange}
							startDate={this.state.startDate}
							handleDateEndChange={this.handleDateEndChange}
							endDate={this.state.endDate}
							handleSearchClick={this.handleSearchClick}
							handleSearchChange={this.handleSearchChange}
							searchValue={buyerIdSearchValue}
							searchLabel="Search by Buyer ID"
							count={count}
							addClassForWithdraw={true}
							handleKeyPressEnter={this.handleKeyPressEnter}
						>
							<TextField
								id="outlined-select-type-status"
								select
								color="secondary"
								label="Status"
								className={classes.statusSelect}
								value={statusFilterValue}
								variant='outlined'
								SelectProps={{
									value: statusFilterValue
								}}
								onChange={this.handleChangeStatusFilter}
							>
								{_.map(Object.keys(withdrawStatusesConfig), (option) => (
									<MenuItem
										key={_.uniqueId(withdrawStatusesConfig[option].text)}
										value={withdrawStatusesConfig[option].text}
									>
										{withdrawStatusesConfig[option].text}
									</MenuItem>
								))}
							</TextField>
						</TableControls>
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
						{ withdraw.length 
							? <TableControls
									form={'bottom'}
									settings={['paginate']}
									updateData={this.updateData}
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
	selected: state.selected,
	user: state.authorization.userData.user,
	withdraw: state.withdraw.data,
	count: state.withdraw.countPage,
	loading: state.withdraw.loading,
	selectedTimeZone: state.timezone.currentTimeZone,
	resources: state.authorization.userData.user.resources
});

const mapDispatchToProps = {
	fetchWithdraw,
	fetchCashOutWithraw
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles, { withTheme: true })
)(Withdraw);
