import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchReports } from '../ducks/reports';
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
import {
	rowsMerchant,
	rowsRoom,
	rowsRoot,
	rowsTerminal
} from '../components/Reports/rows';
import styles from '../components/Reports/styles';
import { compose } from 'redux';

import moment from 'moment';

class Reports extends Component {
	constructor(props) {
		super(props);
		const savedReportsStartDate = sessionStorage.getItem('ReportsStartDate');
		const savedReportsEndDate = sessionStorage.getItem('ReportsEndDate');
		this.state = {
			page: 0,
			forcePage: 1,
			sortBy: 'id',
			asc: false,
			startDate: savedReportsStartDate ? savedReportsStartDate : tm()
				.utc()
				.startOf('month')
				.format('YYYY-MM-DD HH:mm:ss'),
			endDate: savedReportsEndDate ? savedReportsEndDate : tm()
				.utc()	
				.endOf('day')
				.format('YYYY-MM-DD HH:mm:ss'),
		};
	}
	clearAll = () => {
		this.setState(
			{
				page: 0,
				forcePage: 1,
				sortBy: 'id',
				asc: false,
				startDate: tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
				endDate: tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
			}, () => {
				// sessionStorage.removeItem('ReportsStartDate');
				// sessionStorage.removeItem('ReportsEndDate');			
				
				sessionStorage.setItem('ReportsStartDate', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')) );
				sessionStorage.setItem('ReportsEndDate', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')) );
				
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
	};
	checkDatesRageIsValid = (startDate, endDate) => {
		if ( tm(endDate).isBefore(startDate, 'YYYY-MM-DD HH:mm:ss') || tm(startDate).isAfter(endDate, 'YYYY-MM-DD HH:mm:ss')) {
			return false;
		}
		return true;
	};
	createTableHeader = () => {
		return _.map(rowsRoot, row => (
			<TableCell
				key={row.id}
				align={row.numeric ? 'right' : 'left'}
				padding={row.disablePadding ? 'none' : 'default'}
				sortDirection={
					this.state.sortBy === row.id
						? this.state.asc
							? 'asc'
							: 'desc'
						: false
				}>
				<Tooltip
					title="Sort"
					placement={row.numeric ? 'bottom-end' : 'bottom-start'}
					enterDelay={300}>
					<TableSortLabel
						active={this.state.sortBy === row.id}
						direction={this.state.asc ? 'asc' : 'desc'}
						onClick={() => this.createSortHandler(row.id)}>
						{row.label}
					</TableSortLabel>
				</Tooltip>
			</TableCell>
		));
	};
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
	};
	handleDateStartChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		const isDataRangeValid = this.checkDatesRageIsValid(tm(testZone).tz(selectedTimeZone).format(), this.state.endDate);

		if(moment(date).isValid() && isDataRangeValid){
			sessionStorage.setItem('ReportsStartDate', date);

			this.setState(
				{
					startDate: date
				},
				this.updateData
			);
		}
	};
	handleDateEndChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		const isDataRangeValid = this.checkDatesRageIsValid(this.state.startDate, tm(testZone).tz(selectedTimeZone).format());

		if (moment(date).isValid() &&  isDataRangeValid) {
			sessionStorage.setItem('ReportsEndDate', date);

			this.setState(
				{
					endDate: date
				},
				this.updateData
			);
		}		
	};







	componentDidMount() {
		if( !sessionStorage.getItem('ReportsStartDate') ){
			sessionStorage.setItem('ReportsStartDate', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('ReportsEndDate') ){
			sessionStorage.setItem('ReportsEndDate', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
		}	

		this.updateData();
	}






	componentDidUpdate(prevProps, prevState) {
		// only update chart if the data has changed
		if (prevProps.selected !== this.props.selected) {
			this.updateData();
		}
	}
	updateData = () => {
		const { selected, user, fetchReports, selectedTimeZone } = this.props;
		const { startDate, endDate } = this.state;

		if (selected.nodeType === 'root' && user.role_code === 'super_admin') {
			fetchReports({
				start_date: tm(startDate)
					.tz(selectedTimeZone)
					.format(),
				end_date: tm(endDate)
					.tz(selectedTimeZone)
					.format()
			});
		} else {
			fetchReports(
				{
					start_date: tm(startDate)
						.tz(selectedTimeZone)
						.format(),
					end_date: tm(endDate)
						.tz(selectedTimeZone)
						.format()
				},
				`${selected.nodeType}s`,
				selected[selected.nodeType]?.id 
			);
		}
	};
	rootItems = () => {
		const { reports, rooms, merchants, classes } = this.props;
		let TableRoWs = [];

		_.map(reports.merchants, (merchant, merchantID) => {
			let merchantRowSpan = _.map(merchant.rooms, room => {
				return (
					_.sum(
						_.map(room.terminals, terminal =>
							_.size(terminal.reports)
						)
					) + _.size(room.reports)
				);
			});
			merchantRowSpan = _.sum(merchantRowSpan) + _.size(merchant.reports);
			let firstForMerchant = 0;
			const findedMerchants = _.find(
				merchants,
				merchantFind => merchantFind.index == merchantID
			);
			_.map(merchant.rooms, (room, roomID) => {
				let roomRowSpan =
					_.sum(
						_.map(room.terminals, terminal =>
							_.size(terminal.reports)
						)
					) + _.size(room.reports);
				let firstForRoom = 0;
				const findedRoom = _.find(
					rooms,
					roomFind => roomFind.index == roomID
				);

				_.map(room.terminals, (terminal, terminalID) => {
					let terminalRowSpan = _.size(terminal.reports);
					const rowItem = (
						<TableRow key={_.uniqueId('terminal_reports_')}>
							{firstForMerchant === 0 ? (
								<TableCell
									component="th"
									scope="row"
									rowSpan={merchantRowSpan}
									className={classes.merchantCaption}>
									{findedMerchants && findedMerchants.title
										? findedMerchants.title
										: ''}
								</TableCell>
							) : (
								''
							)}
							{firstForRoom === 0 ? (
								<TableCell
									className={classes.roomRow}
									align="right"
									rowSpan={roomRowSpan}>
									{findedRoom && findedRoom.title
										? findedRoom.title
										: ''}
								</TableCell>
							) : (
								''
							)}
							<TableCell align="right" rowSpan={terminalRowSpan}>
								{'Terminal ' + terminalID}
							</TableCell>

							<TableCell align="right">
								{_.map(
									terminal.reports,
									report => report.deposit
								)}
							</TableCell>
							<TableCell align="right">
								{_.map(
									terminal.reports,
									report => report.withdraw
								)}
							</TableCell>
							<TableCell align="right">
								{_.map(
									terminal.reports,
									(report, currency) => currency
								)}
							</TableCell>
						</TableRow>
					);
					firstForMerchant++;
					firstForRoom++;

					TableRoWs.push(rowItem);
				});
				_.map(room.reports, (report, currency) => {
					const roomStatsItem = (
						<TableRow
							className={classes.roomRow}
							key={_.uniqueId('room_reports_')}>
							<TableCell align="right" colSpan={2}>
								{report.deposit}
							</TableCell>
							<TableCell align="right">
								{report.withdraw}
							</TableCell>
							<TableCell align="right">{currency}</TableCell>
						</TableRow>
					);
					TableRoWs.push(roomStatsItem);
				});
			});
			_.map(merchant.reports, (report, currency) => {
				const merhantStatsItem = (
					<TableRow key={_.uniqueId('merchant_reports_')}>
						<TableCell align="right" colSpan={3}>
							{report.deposit}
						</TableCell>
						<TableCell align="right">{report.withdraw}</TableCell>
						<TableCell align="right">{currency}</TableCell>
					</TableRow>
				);
				TableRoWs.push(merhantStatsItem);
			});
		});
		TableRoWs.push(
			<TableRow key={_.uniqueId('root_reports_')}>
				{ (reports?.reports && !Object.keys(reports.reports).length) 
					? <TableCell align="center" className={classes.styleNoData} colSpan={12}> No data</TableCell>
					: <TableCell
						rowSpan={_.size(reports.reports) + 1}
						className={classes.merchantCaption}>
							Total
					</TableCell>
				}
			</TableRow>
		);

		_.map(reports.reports, (report, currency) => {
			const rootStatsItem = (
				<TableRow key={_.uniqueId('root_reports_')}>
					<TableCell align="right" colSpan={3}>
						{report.deposit}
					</TableCell>
					<TableCell align="right">{report.withdraw}</TableCell>
					<TableCell align="right">{currency}</TableCell>
				</TableRow>
			);
			TableRoWs.push(rootStatsItem);
		});

		return TableRoWs;
	};
	merchantsItems = () => {
		const { reports: merchant, selected, rooms, classes } = this.props;
		let TableRoWs = [];
		let merchantRowSpan = _.map(merchant.rooms, room => {
			return (
				_.sum(
					_.map(room.terminals, terminal => _.size(terminal.reports))
				) + _.size(room.reports)
			);
		});
		merchantRowSpan = _.sum(merchantRowSpan) + _.size(merchant.reports);
		let firstForMerchant = 0;

		_.map(merchant.rooms, (room, roomID) => {
			let roomRowSpan =
				_.sum(
					_.map(room.terminals, terminal => _.size(terminal.reports))
				) + _.size(room.reports);
			let firstForRoom = 0;
			const findedRoom = _.find(
				rooms,
				roomFind => roomFind.index == roomID
			);

			_.map(room.terminals, (terminal, terminalID) => {
				let terminalRowSpan = _.size(terminal.reports);
				const rowItem = (
					<TableRow key={_.uniqueId('terminal_reports_')}>
						{firstForMerchant === 0 ? (
							<TableCell
								component="th"
								scope="row"
								rowSpan={merchantRowSpan}>
								{selected.title}
							</TableCell>
						) : (
							''
						)}
						{firstForRoom === 0 ? (
							<TableCell
								className={classes.roomRow}
								align="right"
								rowSpan={roomRowSpan}>
								{findedRoom && findedRoom.title
									? findedRoom.title
									: ''}
							</TableCell>
						) : (
							''
						)}
						<TableCell align="right" rowSpan={terminalRowSpan}>
							{'Terminal ' + terminalID}
						</TableCell>

						<TableCell align="right">
							{_.map(terminal.reports, report => report.deposit)}
						</TableCell>
						<TableCell align="right">
							{_.map(terminal.reports, report => report.withdraw)}
						</TableCell>
						<TableCell align="right">
							{_.map(
								terminal.reports,
								(report, currency) => currency
							)}
						</TableCell>
					</TableRow>
				);
				firstForMerchant++;
				firstForRoom++;

				TableRoWs.push(rowItem);
			});
			_.map(room.reports, (report, currency) => {
				const roomStatsItem = (
					<TableRow
						className={classes.roomRow}
						key={_.uniqueId('room_reports_')}>
						<TableCell align="right" colSpan={2}>
							{report.deposit}
						</TableCell>
						<TableCell align="right">{report.withdraw}</TableCell>
						<TableCell align="right">{currency}</TableCell>
					</TableRow>
				);
				TableRoWs.push(roomStatsItem);
			});
		});
		_.map(merchant.reports, (report, currency) => {
			const merhantStatsItem = (
				<TableRow key={_.uniqueId('merchant_reports_')}>
					<TableCell align="right" colSpan={3}>
						{report.deposit}
					</TableCell>
					<TableCell align="right">{report.withdraw}</TableCell>
					<TableCell align="right">{currency}</TableCell>
				</TableRow>
			);
			TableRoWs.push(merhantStatsItem);
		});
		return TableRoWs;
	};
	roomsItems = () => {
		const { reports: room, selected, classes } = this.props;
		let TableRoWs = [];
		let firstForRoom = 0;
		let roomRowSpan =
			_.sum(_.map(room.terminals, terminal => _.size(terminal.reports))) +
			_.size(room.reports);
		_.map(room.terminals, (terminal, terminalID) => {
			let terminalRowSpan = _.size(terminal.reports);
			const rowItem = (
				<TableRow key={_.uniqueId('terminal_reports_')}>
					{firstForRoom === 0 ? (
						<TableCell
							className={classes.roomRow}
							align="right"
							rowSpan={roomRowSpan}>
							{selected.title}
						</TableCell>
					) : (
						''
					)}
					<TableCell align="right" rowSpan={terminalRowSpan}>
						{'Terminal ' + terminalID}
					</TableCell>

					<TableCell align="right">
						{_.map(terminal.reports, report => report.deposit)}
					</TableCell>
					<TableCell align="right">
						{_.map(terminal.reports, report => report.withdraw)}
					</TableCell>
					<TableCell align="right">
						{_.map(
							terminal.reports,
							(report, currency) => currency
						)}
					</TableCell>
				</TableRow>
			);
			firstForRoom++;

			TableRoWs.push(rowItem);
		});
		_.map(room.reports, (report, currency) => {
			const roomStatsItem = (
				<TableRow
					className={classes.roomRow}
					key={_.uniqueId('room_reports_')}>
					<TableCell align="right" colSpan={2}>
						{report.deposit}
					</TableCell>
					<TableCell align="right">{report.withdraw}</TableCell>
					<TableCell align="right">{currency}</TableCell>
				</TableRow>
			);
			TableRoWs.push(roomStatsItem);
		});

		return TableRoWs;
	};
	terminalsItems = () => {
		const { reports: terminal, selected, classes } = this.props;
		let TableRoWs = [];
		let terminalRowSpan = _.size(terminal.reports);
		const rowItem = (
			<TableRow key={_.uniqueId('terminal_reports_')}>
				{ terminal?.reports && !Object.keys(terminal.reports).length
				?  <TableCell align="center" className={classes.styleNoData} colSpan={12}> No data</TableCell>
				: <>
						<TableCell rowSpan={terminalRowSpan}>
							{'Terminal ' + selected[selected.nodeType].id}
						</TableCell>
						<TableCell align="center">
							{_.map(terminal.reports, report => report.deposit)}
						</TableCell>
						<TableCell align="center">
							{_.map(terminal.reports, report => report.withdraw)}
						</TableCell>
						<TableCell align="center">
							{_.map(terminal.reports, (report, currency) => currency)}
						</TableCell>
					</> 
				}
			</TableRow>
		);
		TableRoWs.push(rowItem);

		return TableRoWs;
	};




	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('ReportsStartDate'),
			endDate: sessionStorage.getItem('ReportsEndDate')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('ReportsStartDate')))
			this.handleDateEndChange(moment(sessionStorage.getItem('ReportsEndDate')))

			this.updateData()
		})
	}




	render() {
		const {
			classes,
			count,
			loading,
			selected,
			user,
			accessPoint,
			reports
		} = this.props;
		let rows = rowsRoot;

		const table = selected.nodeType;

		let items = [];
		let tableConfig = {
			terminal: { rows: rowsTerminal, items: this.terminalsItems },
			room: { rows: rowsRoom, items: this.roomsItems },
			merchant: { rows: rowsMerchant, items: this.merchantsItems },
			root: { rows: rowsRoot, items: this.rootItems }
		};

		switch (table) {
			case 'terminals':
				rows = tableConfig[table].rows;
				items = tableConfig[table].items();
				break;
			case 'rooms':
				rows = tableConfig[table].rows;
				items = tableConfig[table].items();
				break;
			case 'merchants':
				rows = tableConfig[table].rows;
				items = tableConfig[table].items();
				break;
			default:
				if (user.role_code === 'super_admin') {
					rows = tableConfig['root'].rows;
					items = tableConfig['root'].items();
				} else {
					rows = tableConfig[accessPoint.table]?.rows;
					items = tableConfig[accessPoint.table]?.items();
				}
				break;
		}

		return (
			<div>
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>
					<div className={classes.tableFilterReportsPage}>
						<TableControls
							form={'top'}
							settings={['update', 'date', 'defaultSort']}
							clearAll={this.clearAll}
							updateData={this.handleUpdateData}
							page={this.state.page}
							handleChangePage={this.handleChangePage}
							handleDateStartChange={this.handleDateStartChange}
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							handleDateEndChange={this.handleDateEndChange}
							count={count}
							addClassPageReports={true}
						/>
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
								<TableBody>{items}</TableBody>
							</Zoom>
						</Table>
					</div>
					{/* <TableControls
						form={'bottom'}
						updateData={this.updateData}
						settings={['paginate']}
						page={this.state.page}
						handleChangePage={this.handleChangePage}
						count={count}
					/> */}
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
	rooms: state.merchants.rooms,
	merchants: state.merchants.merchants,
	user: state.authorization.userData.user,
	loading: state.reports.loading,
	reports: state.reports.data,
	countPage: state.reports.countPage,
	selectedTimeZone: state.timezone.currentTimeZone,
	accessPoint: state.authorization.accessPoint
});
const mapDispatchToProps = {
	fetchReports
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Reports);
