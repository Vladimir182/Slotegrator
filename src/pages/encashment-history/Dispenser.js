import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';
import tm from 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import LinearProgress from '@material-ui/core/LinearProgress';
import Zoom from '@material-ui/core/Zoom';
import TableControls from '../../components/TableControls';
import CreatorTableHeader from '../../components/encashment-history/Dispenser/CreatorTableHeader';
import { fetchEncashmentDispenserHistoryData } from '../../ducks/dispenser';
import { compose } from 'redux';
import moment from 'moment'

let SHADE = 50;
const styles = theme => {
	if (theme.palette.type === 'dark') {
		SHADE = 200;
	} else {
		SHADE = 200;
	}
	return {
		root: {
			'& .MuiTableCell-stickyHeader': {
				top: '88px!important',
				padding: '0 10px',
				top: '170px!important',
				zIndex: '10'
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
			'& .MuiTableHead-root ': {			
				[theme.breakpoints.down('1200')]:{
					'& > tr > th': {
						top: '0px !important'
					}
				},
			},
			'& .wrapPageDispenser': {				
				[theme.breakpoints.down('900')]:{
					width: '100%',
					marginTop: theme.spacing(3)
				},	
				[theme.breakpoints.down('700')]:{
					display: 'block',
					marginTop: theme.spacing(1),

					'& .MuiTextField-root': {
						marginTop: theme.spacing(3)
					}
				},
			}
		},
		wrapTableForScroll: {			
			[theme.breakpoints.down('1200')]:{
				overflowX: 'auto'
			},
		},
		rightBlocHeaderkPagination: {			
			[theme.breakpoints.down('1200')]:{
				width: '100%',
				'& > div > div': {
					marginTop: '0px',
				}
			},
			[theme.breakpoints.down('600')]:{
				paddingLeft: theme.spacing(2)
			},
		},
		footerPaginate: {
			padding: `0px 0px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
			[theme.breakpoints.down('600')]:{
				padding: `0px 0px ${theme.spacing(1)}px ${theme.spacing(4)}px`,
			},
		},
		wrapTableControl:{
			display: 'flex',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
			padding: theme.spacing(2, 2, 1, 2),
			backgroundColor: theme.palette.tableControlPanelBG,
			position: 'sticky',
			top: '88px!important',
			zIndex: '5',

			[theme.breakpoints.down('1200')]:{
				top: '0px!important',
				position: 'static'
			}
		},
		table: {
			width: '100%',
		},
		controls: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		rowCorrect: {
			backgroundColor: green[SHADE],
			"&:hover": {
				backgroundColor: "#9ad29c !important"
			}
		},
		according: {
			color: 'green'
		},
		notAccording: {
			color: 'red'
		},
		rowUnCorrect: { backgroundColor: red[SHADE],
			"&:hover": {
				backgroundColor: "#ea8f8f!important"
			}},
		nonUnderline: {
			borderBottom: 0,
		},
		billData: {
		},
		cellTitle: {
			fontSize: '0.75rem'
		},
		cellValue: {
			fontWeight: '900',
		},
	};
};

const rows = [
	{
		id: 'id',
		numeric: false,
		disablePadding: false,
		label: 'ID'
	},
	{
		id: 'collector',
		numeric: false,
		disablePadding: false,
		label: 'Collector',
		disableSort: true,
	},
	{
		id: 'Taken bills',
		numeric: false,
		disablePadding: false,
		label: 'Takeb bills',
		disableSort: true,
		double: true
	},
	{
		id: 'Rejected tray bills',
		numeric: false,
		disablePadding: false,
		label: 'Rejected tray bills',
		disableSort: true,
		double: true
	},
	{
		id: 'Left bills',
		numeric: false,
		disablePadding: false,
		label: 'Left bills',
		disableSort: true,
	},
	{
		id: 'created_at',
		numeric: false,
		disablePadding: false,
		label: 'Time'
	},
	{
		id: 'terminal_id',
		numeric: false,
		disablePadding: true,
		label: 'Terminal ID'
	},
	{
		id: 'room_id',
		numeric: false,
		disablePadding: true,
		label: 'Room ID'
	}
];

class EncashmentHistoryDispenser extends Component {
	constructor(props) {
		super(props);
		const savedStartDate = sessionStorage.getItem('DateStartDispenser');
		const savedEndDate = sessionStorage.getItem('DateEndDispenser');

		this.state = {
			page: 0,
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
				.format('YYYY-MM-DD HH:mm:ss')
		};
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
					.format('YYYY-MM-DD HH:mm:ss')
			}, () => {
				// sessionStorage.removeItem('DateStartDispenser')
				// sessionStorage.removeItem('DateEndDispenser')

				this.handleDateStartChange(moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))
				this.handleDateEndChange(moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))

				this.updateData()
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
	checkDatesRageIsValid = (startDate, endDate) => {
		if (
			tm(endDate).isBefore(startDate, 'YYYY-MM-DD HH:mm:ss')
			|| tm(startDate).isAfter(endDate, 'YYYY-MM-DD HH:mm:ss')
		) {
			return false;
		}
		return true;
	}
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
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
	handleDateStartChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		const isDataRangeValid = this.checkDatesRageIsValid(tm(testZone).tz(selectedTimeZone).format(), this.state.endDate);

		if (moment(date).isValid() && isDataRangeValid) {
			sessionStorage.setItem('DateStartDispenser', date);

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
			sessionStorage.setItem('DateEndDispenser', date);

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
		if( !sessionStorage.getItem('DateStartDispenser') ){
			sessionStorage.setItem('DateStartDispenser', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('DateEndDispenser') ){
			sessionStorage.setItem('DateEndDispenser', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
		}	

		this.updateData();
	}



	updateData = () => {
		const { selected, selectedTimeZone, fetchEncashmentDispenserHistoryData } = this.props;
		const { page, sortBy, asc, startDate, endDate } = this.state;

		const data = {
			filter_created_at_start: tm(startDate)
				.tz(selectedTimeZone)
				.format(),
			filter_created_at_end: tm(endDate)
				.tz(selectedTimeZone)
				.format(),
			offset: page * process.env.REACT_APP_API_LIMIT,
			[sortBy]: asc ? 'asc' : 'desc'
		};
		if (selected.nodeType === 'terminal') {
			data['filter_terminal_id'] = selected.terminal.id;
		}
		if (selected.nodeType === 'room') {
			data['filter_room_id'] = selected.room.id;
		}
		if (selected.nodeType === 'merchant') {
			data['filter_merchant_id'] = selected.merchant.id;
		}

		fetchEncashmentDispenserHistoryData(data)
	}

	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('DateStartDispenser'),
			endDate: sessionStorage.getItem('DateEndDispenser')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('DateStartDispenser')))
			this.handleDateEndChange(moment(sessionStorage.getItem('DateEndDispenser')))

			this.updateData()
		})
	}	

	isTakenBillsAccording = (takenBills, expectedBills) => {
		if (!takenBills || !expectedBills) return false;
		if (
			Number(takenBills.amount) !== Number(expectedBills.amount)
			|| Number(takenBills.denomination) !== Number(expectedBills.denomination)
			|| takenBills.currency !== expectedBills.currency
		) return false;
		return true;
	};

	isRejectedTrayAccording = (rejectedTrayBills, expectedBills) => {
		if (!rejectedTrayBills || !expectedBills) return false;
		if (Number(rejectedTrayBills.amount) !== Number(expectedBills.total_rejected)) return false;
		return true;
	};

	render() {
		const {
			encashmentHistory,
			classes,
			count,
			loading,
			selectedTimeZone
		} = this.props;
		let itemsBody = _.map(encashmentHistory, item => {
			const collector = item.collector;
			const stated = item.stated;
			return (
				<TableRow
					hover
					key={item.id}
					className={classNames(classes.tableRow,{
						[classes.rowCorrect]: item.is_correct,
						[classes.rowUnCorrect]: !item.is_correct
					})}>
					<TableCell>
						{item.id}
					</TableCell>
					<TableCell>
						<span className={classes.cellTitle}>Login: </span><span className={classes.cellValue}>{collector.username}</span>
						<br />
						<span className={classes.cellTitle}>First name: </span><span className={classes.cellValue}>{collector.first_name}</span>
						<br />
						<span className={classes.cellTitle}>Last name: </span><span className={classes.cellValue}>{collector.last_name}</span>
					</TableCell>
					<TableCell>
						<TableRow>
							<TableCell className={classes.nonUnderline}>
								{_.map(stated.taken_bills, bill => (
									<p key={_.uniqueId('stacked_bill')} className={classNames(classes.billData, {
										[classes.according]: this.isTakenBillsAccording(bill, item.cassettes_info.find(cassetteInfo => cassetteInfo.casset_id === bill.casset_id)),
										[classes.notAccording]: !this.isTakenBillsAccording(bill, item.cassettes_info.find(cassetteInfo => cassetteInfo.casset_id === bill.casset_id)),
									})}>
										{`N:${bill.denomination} A:${bill.amount} (${bill.currency})`}
									</p>
								))}
							</TableCell>
							<TableCell className={classes.nonUnderline}>
								{_.map(item.cassettes_info, bill => (
									<p key={_.uniqueId('stacked_bill')} className={classNames(classes.billData, {
										[classes.according]: this.isTakenBillsAccording(bill, stated.taken_bills.find(cassetteInfo => cassetteInfo.casset_id === bill.casset_id)),
										[classes.notAccording]: !this.isTakenBillsAccording(bill, stated.taken_bills.find(cassetteInfo => cassetteInfo.casset_id === bill.casset_id)),
									})}>
										{`N:${bill.denomination} A:${bill.amount} (${bill.currency})`}
									</p>
								))}
							</TableCell>
						</TableRow>
					</TableCell>
					<TableCell>
						<TableRow>
							<TableCell className={classes.nonUnderline}>
								{_.map(stated.rejected_tray, bill => (
									<p className={classNames(classes.billData, {
										[classes.according]: this.isRejectedTrayAccording(bill, item.cassettes_info.find(cassetteInfo => cassetteInfo.currency === bill.currency && Number(cassetteInfo.denomination) === Number(bill.denomination))),
										[classes.notAccording]: !this.isRejectedTrayAccording(bill, item.cassettes_info.find(cassetteInfo => cassetteInfo.currency === bill.currency && Number(cassetteInfo.denomination) === Number(bill.denomination))),
									})} key={_.uniqueId('stacked_bill')}>
										{`N:${bill.denomination} A:${bill.amount} (${bill.currency})`}
									</p>
								))}
							</TableCell>
							<TableCell className={classes.nonUnderline}>
								{_.map(item.cassettes_info, bill => (
									<p className={classNames(classes.billData, {
										[classes.according]: this.isRejectedTrayAccording(stated.rejected_tray.find(cassetteInfo => cassetteInfo.currency === bill.currency && Number(cassetteInfo.denomination) === Number(bill.denomination)), bill),
										[classes.notAccording]: !this.isRejectedTrayAccording(stated.rejected_tray.find(cassetteInfo => cassetteInfo.currency === bill.currency && Number(cassetteInfo.denomination) === Number(bill.denomination)), bill)
									})} key={_.uniqueId('stacked_bill')}>
										{`N:${bill.denomination} A:${bill.total_rejected} (${bill.currency})`}
									</p>
								))}
							</TableCell>
						</TableRow>
					</TableCell>
					<TableCell>
						<TableRow>
							<TableCell className={classes.nonUnderline}>
								{_.map(stated.left_bills, bill => (
									<p className={classes.billData} key={_.uniqueId('stacked_bill')}>
										{`N:${bill.denomination} A:${bill.amount} (${bill.currency})`}
									</p>
								))}
							</TableCell>
						</TableRow>
					</TableCell>
					<TableCell>
						{tm(item.created_at)
							.tz(selectedTimeZone)
							.format('DD/MM/YYYY H:mm:ss')}
					</TableCell>
					<TableCell>{item.terminal_id}</TableCell>
					<TableCell>{item.room_id}</TableCell>
				</TableRow>
			);
		});

		return (
			<div>
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>
					<div className={classes.wrapTableControl}>
						<TableControls
							form={'top'}
							settings={['update', 'defaultSort', 'date']}
							clearAll={this.clearAll}
							updateData={this.handleUpdateData}
							page={this.state.page}
							handleChangePage={this.handleChangePage}
							handleDateStartChange={this.handleDateStartChange}
							startDate={this.state.startDate}
							handleDateEndChange={this.handleDateEndChange}
							endDate={this.state.endDate}
							count={count}
							addClassDataPickerDispanser={true}
						/>
						<div className={classes.rightBlocHeaderkPagination}>
							<TableControls
								form={'bottom'}	
								settings={['paginate']}
								updateData={this.updateData}
								page={this.state.page}
								handleChangePage={this.handleChangePage}
								count={count}
							/>
						</div>
					</div>
					<div className={`${classes.table} ${classes.wrapTableForScroll}`}>
						<Table stickyHeader >
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
					<div className={classes.footerPaginate}>
						<TableControls
							form={'bottom'}	
							settings={['paginate']}
							updateData={this.updateData}
							page={this.state.page}
							handleChangePage={this.handleChangePage}
							count={count}
						/>
					</div>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	encashmentHistory: state.dispenser.historyData,
	count: state.dispenser.countPage,
	loading: state.dispenser.loading,
	selected: state.selected,
	selectedTimeZone: state.timezone.currentTimeZone
});

const mapDispatchToProps = {
	fetchEncashmentDispenserHistoryData
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(EncashmentHistoryDispenser);
