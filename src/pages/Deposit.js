import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDeposit } from '../ducks/deposit';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import tm from 'moment-timezone';
import TableControls from '../components/TableControls';
import Zoom from '@material-ui/core/Zoom';
import CreatorTableHeader from '../components/CreatorTableHeader';
import ModalWithdrawCashOut from '../components/modals/ModalWithdrawCashOut';
import DoneIcon from '@material-ui/icons/Done';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TableDataDetails from '../components/modals/TableDataDetails';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
import { Box } from '@material-ui/core';
import moment from 'moment';

const styles = theme => ({
	root: {
		marginTop: theme.spacing(1),
		'& .MuiTableCell-stickyHeader': {
			top: '164px!important',
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

			[theme.breakpoints.down('1300')]:{
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
	controls: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
		// padding: theme.spacing(3, 2, 4) + '!important'
	},
	loading: {
		height: '5px',
		width: '100%'
	},
	statusSelect: {
		minWidth: '150pt',
		[theme.breakpoints.down('xs')]:{
			marginTop: theme.spacing(2)
		},
	},
	styleNoData:{
		padding: '10px 0',
		fontSize: '15px',
		lineHeight: '1.43',
		color: theme.palette.tableHeaderColor
	},
	depositTableControl: {	
		paddingTop: '4px',
		backgroundColor: theme.palette.tableControlPanelBG,	 
		position: 'sticky',
		top: '88px',
		zIndex: '1000',

		[theme.breakpoints.down('1300')]: {
			position: 'static',
			top: '0px!important',
		},

		'& > div': {
			flexWrap: 'wrap',
		},

		'& > div > div': {
			flexWrap: 'wrap',
		},

		'& .wrapPageDeposit': {

			[theme.breakpoints.down('1050')]: {
				width: '100%',
				padding: `${theme.spacing(2)}px 0`,
				display: 'block'
			},			

			[theme.breakpoints.down('600')]: {
				padding: `${theme.spacing(2)}px 0 0 0`,
			},
			
			'& > div': {
				[theme.breakpoints.down('1050')]: {
					width: '100%',
					marginTop: `${theme.spacing(2)}px`,
				},
			}
		},
		'& .wrapPageDepositRightSearch': {

			[theme.breakpoints.down('1300')]: {
				width: '100%',
				paddingTop: `${theme.spacing(1)}px`,
			},
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
		label: 'Amount' },
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
	}
];

const detailModalConfig = {
	title: `Deposit details`,
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
			prop: 'stacked_at',
			label: 'Stacked time',
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
		}
	]
};

const depositStatusesConfig = {
	all: {
		text: 'All'
	},
	success: {
		is_stacked: 'success',
		is_verified: true,
		text: 'Success'
	},
	pendingSuccess: {
		is_stacked: 'success',
		is_verified: false,
		text: 'Pending for success'
	},
	cancelled: {
		is_stacked: 'not_stacked',
		is_verified: true,
		text: 'Cancelled'
	},
	warning: {
		is_stacked: ['checksum_warn', 'delay_warn', 'unknown_warn'],
		is_verified: true,
		text: 'Warning'
	},
	other: {
		text: 'Pending for cancel',
		is_stacked: 'not_stacked',
		is_verified: false,
	}
};

class Deposit extends Component {
	constructor(props) {
		super(props);
		this.debouncedHandleSearchClick = _.debounce(this.handleSearchClick, 1000);
		const savedStartDate = sessionStorage.getItem('depositStartDate');
		const savedEndDate = sessionStorage.getItem('depositEndDate');
		const savedStatusFilterValue = sessionStorage.getItem('depositStatusFilter');
		const savedBuyerIdSearchValue = sessionStorage.getItem('depositBuyerIdSearch');

		this.state = {
			page: 0,
			depositDateils: {},
			modalDepositDetails: false,
			detailsConfig: _.cloneDeep(detailModalConfig),	
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
			statusFilterValue: savedStatusFilterValue ?? 'All',
			buyerIdSearchValue: savedBuyerIdSearchValue ?? '',
		};
	}
	handleOpenDepositDetails = (item, statusValue) => {
		this.prepareWithdrawDetailsConfig(item, statusValue);

		this.setState({
			depositDateils: item,
			modalDepositDetails: true
		});
	}
	handleCloseDepositDetails = () => {
		this.setState({
			detailsConfig: _.cloneDeep(detailModalConfig),
			depositDateils: {},
			modalDepositDetails: false
		});
	}
	prepareWithdrawDetailsConfig = (item, statusValue) => {
		const { listConfig } = this.state.detailsConfig; 
		let statusItem = listConfig.find(listConfigItem => listConfigItem.prop === 'status');
		let amountItem = listConfig.find(listConfigItem => listConfigItem.prop === 'amount');
		
		if (statusItem) {
			const returnedStatus = item.is_returned ? 'Note was returned' : 'Note was not returned';
			statusValue = statusValue !== 'Success' ? statusValue += `\n${returnedStatus}` : statusValue;
			statusItem.value = statusValue;
		}
		if(amountItem) {
			amountItem.value = `${item.amount} ${item.currency}`;  
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
				sessionStorage.removeItem('depositStartDate');
				sessionStorage.removeItem('depositEndDate');
				sessionStorage.removeItem('savedBuyerIdSearchValue');
				sessionStorage.removeItem('withdrawStatusFilter');

				this.handleDateStartChange(moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))
				this.handleDateEndChange(moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))

				this.updateData();
			}
		);
	}
	handleSort = property => {
		this.setState(state => {
			return {
				sortBy: property,
				asc: state.sortBy === property ? !state.asc : true
			};
		}, this.updateData);
	}
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
	}
	checkDatesRageIsValid = (startDate, endDate) => {
		if (
			tm(endDate).isBefore(startDate, 'YYYY-MM-DD HH:mm:ss')
			|| tm(startDate).isAfter(endDate, 'YYYY-MM-DD HH:mm:ss')
		) {
			return false;
		}
		return true;
	}
	handleDateStartChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		const isDataRangeValid = this.checkDatesRageIsValid(tm(testZone).tz(selectedTimeZone).format(), this.state.endDate);

		if (moment(date).isValid() && isDataRangeValid) {
			sessionStorage.setItem('depositStartDate', date);

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
			sessionStorage.setItem('depositEndDate', date);

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




	componentDidMount() {
		if( !sessionStorage.getItem('depositStartDate') ){
			sessionStorage.setItem('depositStartDate', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('depositEndDate') ){
			sessionStorage.setItem('depositEndDate', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
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
	handleChangeStatusFilter = (e) => {
		const value = e.target.value;
		
		this.setState({
			statusFilterValue: value
		}, () => {
			sessionStorage.setItem('depositStatusFilter', value);
			this.updateData();
		});
	}
	updateData = () => {
		const { 
			selected,
			user,
			fetchDeposit,
			selectedTimeZone
		} = this.props;
		const { 
			page, 
			sortBy, 
			asc, 
			startDate, 
			endDate,
			statusFilterValue,
			buyerIdSearchValue
		} = this.state;

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
			const statusData = Object.entries(depositStatusesConfig).find(([key, value]) => value.text === statusFilterValue);

			if (statusData) {
				data['filter_is_verified'] = statusData[1].is_verified;
				data['filter_is_stacked'] = Array.isArray(statusData[1].is_stacked) 
					? JSON.stringify(statusData[1].is_stacked) 
					: statusData[1].is_stacked;
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

		fetchDeposit(data);
	}	

	handleSearchClick = value => {
		this.updateData()		
	}

	handleKeyPressEnter = (e) => {		
		if (e.key === "Enter") {
			this.handleSearchClick()
		} 		
	}

	handleSearchChange = e => {
		const value = e.target.value;

		// this.debouncedHandleSearchClick(value);

		this.setState({
			buyerIdSearchValue: value
		}, () => {
			sessionStorage.setItem('depositBuyerIdSearch', value);
			// this.updateData()
		});
	}	
	handleIngnoreClick = (e) =>{
		e.stopPropagation();
	}

	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('depositStartDate'),
			endDate: sessionStorage.getItem('depositEndDate')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('depositStartDate')))
			this.handleDateEndChange(moment(sessionStorage.getItem('depositEndDate')))

			this.updateData()
		})
	}

	render() {
		const {
			deposit,
			classes,
			count,
			loading,
			selectedTimeZone
		} = this.props;

		const {
			depositDateils,
			modalDepositDetails,
			detailsConfig,
			statusFilterValue,
			buyerIdSearchValue
		} = this.state;

		const { 
			success: successStatus,
			pendingSuccess: pendingSuccessStatus,
			cancelled: cancelledStatus,
			warning: warningStatus,
			other: otherStatuses
		} = depositStatusesConfig;

		const itemsBody = _.map(deposit, item => {
			const isSuccess = item.is_stacked === successStatus.is_stacked && item.is_verified === successStatus.is_verified;
			const isPendingSuccess = item.is_stacked === pendingSuccessStatus.is_stacked && item.is_verified === pendingSuccessStatus.is_verified 
				|| (
					item.is_stacked === 'not_stacked' 
					&& item.is_verified === false
					&& item.is_returned === false
					&& tm().tz(selectedTimeZone).isBefore(tm(item.created_at).tz(selectedTimeZone).add(5, 'seconds'))
				);
			const isCancelled = item.is_stacked === cancelledStatus.is_stacked && item.is_verified === cancelledStatus.is_verified;
			const isWarning = item.is_stacked.includes('warn') && item.is_verified === true;
			const statusTooltipText = isSuccess ? successStatus.text 
				: isPendingSuccess ? pendingSuccessStatus.text
				: isCancelled ? cancelledStatus.text
				: isWarning ? `Warning\n(${item.is_stacked})`
				: otherStatuses.text;

			return (
				<TableRow
					hover={true}
					key={item.id}
					onClick={() => this.handleOpenDepositDetails(item, statusTooltipText)}
				>
					<TableCell component="th" scope="row">
						{item.id}
					</TableCell>
					<TableCell align="right">
						{item.amount + ' ' + item.currency}
					</TableCell>
					<TableCell align="right">
						{tm(item.created_at)
							.tz(selectedTimeZone)
							.format('DD/MM/YYYY H:mm:ss')}
					</TableCell>
					<TableCell align="right">{item.terminal_id}</TableCell>
					<TableCell align="right" 	style={{width:'20%', whiteSpace: 'nowrap', maxWidth: '150px'}}
					onClick={this.handleIngnoreClick} >
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
								: isWarning ? <WarningIcon style={{ color: '#fea500' }} />
								: <span style={{ width: '30px' }}><CircularProgress size={25} color="secondary" /></span>
							}
						</Tooltip>
					</TableCell>
				</TableRow>
			);
		});

		return (
			<div>
				{ 
					modalDepositDetails && <TableDataDetails
						handleClose={this.handleCloseDepositDetails}
						data={depositDateils}
						config={detailsConfig}
						selectedTimeZone={selectedTimeZone}
					/>
				}
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>

					<div className={classes.depositTableControl}>
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
							addClassForDeposit={true}
							handleKeyPressEnter={this.handleKeyPressEnter}
						>
							<TextField
								id="outlined-select-type-status"
								select
								variant='outlined'
								color="secondary"
								label="Status"
								className={classes.statusSelect}
								value={statusFilterValue}
								SelectProps={{
									value: statusFilterValue
								}}
								onChange={this.handleChangeStatusFilter}
							>
								{_.map(Object.keys(depositStatusesConfig), (option) => (
									<MenuItem
										key={_.uniqueId(depositStatusesConfig[option].text)}
										value={depositStatusesConfig[option].text}
									>
										{depositStatusesConfig[option].text}
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
					{ deposit.length 
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
	selected: state.selected,
	user: state.authorization.userData.user,
	deposit: state.deposit.data,
	count: state.deposit.countPage,
	loading: state.deposit.loading,
	selectedTimeZone: state.timezone.currentTimeZone
});

const mapDispatchToProps = {
	fetchDeposit
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Deposit);
