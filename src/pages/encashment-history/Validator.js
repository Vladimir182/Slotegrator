import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchEncashmentEvent } from '../../ducks/validator';
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
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import LinearProgress from '@material-ui/core/LinearProgress';
import tm from 'moment-timezone';
import TableControls from '../../components/TableControls';
import CreatorTableHeader from '../../components/CreatorTableHeader';
import classNames from 'classnames';
import Zoom from '@material-ui/core/Zoom';
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
			marginTop: theme.spacing.unit * 3,
			'& .MuiTableCell-stickyHeader': {
				top: '170px!important',
				zIndex: '10'
			},
			[theme.breakpoints.between('xs','sm')]:{
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
		table: {
			width: '100%'
		},
		wrapTableControl:{
			display: 'flex',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
			padding: theme.spacing(2, 2),
			backgroundColor: theme.palette.tableControlPanelBG,
			position: 'sticky',
			top: '88px!important',
			zIndex: '5',

			[theme.breakpoints.down('1200')]:{
				top: '0px!important',
				position: 'static'
			}
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
		cellValue: {
			fontWeight: '900',
		},
		rowCorrect: {
			backgroundColor: green[SHADE],
			"&:hover": {
				backgroundColor: "#9ad29c !important"
			}
		},
		rowUnCorrect: { backgroundColor: red[SHADE],
			"&:hover": {
				backgroundColor: "#ea8f8f !important"
			}
		}
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
		disableSort: true
	},
	{
		id: 'Terminal encashment',
		numeric: false,
		disablePadding: false,
		label: 'Terminal encashment',
		disableSort: true
	},
	{
		id: 'Collector encashment',
		numeric: false,
		disablePadding: false,
		disableSort: true,
		label: 'Collector encashment'
	},
	{ 
		id: 'created_at',
		numeric: false,
		disablePadding: false, 
		label: 'Time'
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'Type encashment'
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

class EncashmentHistoryValidator extends Component {
	constructor(props) {
		super(props);
		const savedStartDate = sessionStorage.getItem('DateStart');
		const savedEndDate = sessionStorage.getItem('DateEnd');
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
				// sessionStorage.removeItem('DateStart')
				// sessionStorage.removeItem('DateEnd')

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
	createTableHeader = () => {
		return _.map(rows, row => (
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
				{row.disableSort ? (
					row.label
				) : (
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
					)}
			</TableCell>
		));
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
		const { endDate } = this.state;
		const testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss');

		const isDataRangeValid = this.checkDatesRageIsValid(tm(testZone).tz(selectedTimeZone).format(), endDate);

		if (moment(date).isValid() && isDataRangeValid) {
			sessionStorage.setItem('DateStart', date);

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
		const { startDate } = this.state;
		const testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss');

		const isDataRangeValid = this.checkDatesRageIsValid(startDate, tm(testZone).tz(selectedTimeZone).format());

		if (moment(date).isValid() && isDataRangeValid) {
			sessionStorage.setItem('DateEnd', date);

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
		if( !sessionStorage.getItem('DateStart') ){
			sessionStorage.setItem('DateStart', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('DateEnd') ){
			sessionStorage.setItem('DateEnd', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
		}	

		this.updateData();
	}



	updateData = () => {
		const { selected, fetchEncashmentEvent, selectedTimeZone } = this.props;
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

		fetchEncashmentEvent(data);
	}


	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('DateStart'),
			endDate: sessionStorage.getItem('DateEnd')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('DateStart')))
			this.handleDateEndChange(moment(sessionStorage.getItem('DateEnd')))

			this.updateData()
		})
	}	

	
	render() {
		const {
			validator,
			classes,
			count,
			loading,
			selectedTimeZone
		} = this.props;

		const itemsBody = _.map(validator, item => {
			const collector = item.collector;
			const stacked = item.stacked;
			const stated = item.stated;
			const currency = item.currency;

			return (
				<TableRow
					hover={true}
					key={item.id}
					className={classNames({
						[classes.rowCorrect]: item.is_correct,
						[classes.rowUnCorrect]: !item.is_correct
					})}>
					<TableCell>{item.id}</TableCell>
					<TableCell>
						<span className={classes.cellTitle}>Login: </span><span className={classes.cellValue}>{collector.username}</span>
						<br />
						<span className={classes.cellTitle}>First name: </span><span className={classes.cellValue}>{collector.first_name}</span>
						<br />
						<span className={classes.cellTitle}>Last name: </span><span className={classes.cellValue}>{collector.last_name}</span>
					</TableCell>
					<TableCell>
						{_.map(stacked, bill => (
							<p key={_.uniqueId('stacked_bill')}>
								{`N:${bill.nominal} A:${bill.number} ${currency}`}
							</p>
						))}
					</TableCell>
					<TableCell>
						{_.map(stated, bill => (
							<p key={_.uniqueId('stated_bill')}>
								{`N:${bill.nominal} A:${bill.number} ${currency}`}
							</p>
						))}
					</TableCell>
					<TableCell> 
						{tm(item.created_at)
							.tz(selectedTimeZone)
							.format('DD/MM/YYYY H:mm:ss')}
					</TableCell>
					<TableCell>
						{item.type === 'X' ? 'X (Immediate)' : 'Z (Daily)'}
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
	validator: state.validator.data,
	count: state.validator.countPage,
	loading: state.validator.loading,
	selected: state.selected,
	selectedTimeZone: state.timezone.currentTimeZone
});

const mapDispatchToProps = { fetchEncashmentEvent };


export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(EncashmentHistoryValidator);