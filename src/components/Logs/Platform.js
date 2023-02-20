import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogs, fetchLogsTypes  } from '../../ducks/logs';
import CreatorTableHeader from '../CreatorTableHeader';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import tm from 'moment-timezone';
import TableControls from '../TableControls/LogsTableControlStickyHeader';
import Paginated from '../TableControls/index';
import Zoom from '@material-ui/core/Zoom';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import ReactJson from 'react-json-view';
import { compose } from 'redux';
import PreloaderOverlay from '../preloaders/PreloaderOverlay';
import moment from 'moment'

let SHADE = 50;
const styles = theme => {
	if (theme.palette.type === 'dark') {
		SHADE = 'A200';
	} else {
		SHADE = 50;
	}

	return {
		root: {
			marginTop: theme.spacing.unit * 3,
			'& .MuiTableCell-stickyHeader': {
				top: '205px!important',
				[theme.breakpoints.down('1659')]:{
					top: '275px!important'
				},
				[theme.breakpoints.down('1400')]:{
					top: '0px!important'
				}
			},
			[theme.breakpoints.between('xs','sm')]:{
			},
			'& .MuiButton-textSecondary': {
				minWidth: '52px',
				height: '52px',
				marginTop: theme.spacing(2),
				marginLeft: theme.spacing(2),
				border: theme.palette.button.borderColor,
				borderRadius: theme.palette.button.radius,
				'&:hover':{
					backgroundColor: theme.palette.button.hover,
				}
			},
			'& .wrapControlsPanelLogs': {
				flexWrap: 'wrap',
			},
			'& .wrapDateLogsPage': {

				[theme.breakpoints.down('1400')]:{
					width: '100%',
					marginTop: theme.spacing(2),
					marginBottom: theme.spacing(2),
					flexWrap: 'wrap'
				},		

				[theme.breakpoints.down('750')]:{
					flexWrap: 'wrap',
				},		

				'& > div': {
					maxWidth: '210px',

					[theme.breakpoints.down('900')]:{
						width: '100%',
					},					
				}
			},
			'& .wrapFilterLogsPage': {
				[theme.breakpoints.down('900')]:{
					width: '100%',
					marginBottom: theme.spacing(2),
				}	
			},
			'& .paginationLogsPage': {						
				[theme.breakpoints.down('1659')]:{
					width: '100%',
					marginTop: theme.spacing(3)
				},
				[theme.breakpoints.down('960')]:{
					marginTop: theme.spacing(1)
				}
			},
		},
		table: {
			width: '100%'
		},
		maxWidth: {
			maxWidth: '1000px',
		},
		body: {
			maxWidth: '400px'
		},
		reload: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		typeLogs: {
			minWidth: '120px',
			marginTop: theme.spacing(2)
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		rowCorrect: {
			backgroundColor: green[SHADE]
		},
		rowUnCorrect: { backgroundColor: red[SHADE] },
		popoverList: {transform:'none !important'},
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
	};
};

class ServerLogs extends Component {
	constructor(props) {
		super(props);

		this.debouncedUpdateData = _.debounce(this.updateData, 1000);

		const savedStartDate = sessionStorage.getItem('StartDatePlatform');
		const savedEndDate = sessionStorage.getItem('EndDatePlatform');
		const savedTypeLogs = sessionStorage.getItem('TypeLogsPlatform');
		const savedLevel = sessionStorage.getItem('LevelPlatform');
		const savedTextFilterValue = sessionStorage.getItem('LogsPlatformBodyTextFilterValue');

		const { selectedTimeZone } = props;

		this.state = {
			page: 0,
			forcePage: 1,
			sortBy: 'id',
			asc: false,
			startDate: savedStartDate ? savedStartDate : tm()
				.utc()
				.startOf('month')
				// .subtract(1, 'day')
				// .tz(selectedTimeZone)
				.format('YYYY-MM-DD HH:mm:ss'),
			endDate: savedEndDate ? savedEndDate : tm()
				.utc()
				.endOf('day')
				// .tz(selectedTimeZone)
				.format('YYYY-MM-DD HH:mm:ss'),
			level: savedLevel ? savedLevel: 'All',
			types: savedTypeLogs ? savedTypeLogs : 'All',
			bodyTextFilterValue: savedTextFilterValue ?? ''
		};
	}



	componentDidMount() {
		if( !sessionStorage.getItem('StartDatePlatform') ){
			sessionStorage.setItem('StartDatePlatform', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('EndDatePlatform') ){
			sessionStorage.setItem('EndDatePlatform', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
		}	

		const {fetchLogsTypes} = this.props;
		fetchLogsTypes()
		this.updateData();
	}



	clearAll = () => {
		const { selectedTimeZone } = this.props;

		this.setState(
			{
				page: 0,
				forcePage: 1,
				sortBy: 'id',
				asc: false,
				startDate: tm()
					.utc()
					.startOf('month')
					// .subtract(1, 'day')
					// .tz(selectedTimeZone)
					.format('YYYY-MM-DD HH:mm:ss'),
				endDate: tm()
					.utc()
					.endOf('day')
					// .tz(selectedTimeZone)
					.format('YYYY-MM-DD HH:mm:ss'),
				level: 'All',
				types: 'All',
				bodyTextFilterValue: ''
			}, () => {
				sessionStorage.removeItem('StartDatePlatform');
				sessionStorage.removeItem('EndDatePlatform');
				sessionStorage.removeItem('TypeLogsPlatform');
				sessionStorage.removeItem('LevelPlatform');
				sessionStorage.removeItem('LogsPlatformBodyTextFilterValue');

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
			sessionStorage.setItem('StartDatePlatform', date);

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
			sessionStorage.setItem('EndDatePlatform', date);

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
	componentDidUpdate(prevProps) {
		const { selectedTimeZone } = this.props;
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
	}
	handleChangeType = event => {
		sessionStorage.setItem('TypeLogsPlatform', event.target.value);
		this.setState(
			{
				...this.state,
				types: event.target.value
			},
			this.updateData
		);
	}
	handleChangeTypeLevel = event => {
		sessionStorage.setItem('LevelPlatform', event.target.value);
		this.setState(
			{
				...this.state,
				level: event.target.value
			},
			this.updateData
		);
	}
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
	}
	handleTextFilterChange = e => {
		const value = e.target.value;
		
		this.setState({
				bodyTextFilterValue: value
			}, () => {
				sessionStorage.setItem('LogsPlatformBodyTextFilterValue', value);
				// this.debouncedUpdateData();
			}
		);
	}

	handleSearchClick = () => {
		this.updateData()
	}

	handleKeyPressEnter = (e) => {		
		if (e.key === "Enter") {
			this.handleSearchClick()
		} 		
	}

	updateData = () => {
		const { fetchLogs, selectedTimeZone } = this.props;
		const {
			sortBy,
			asc,
			page,
			endDate,
			startDate,
			level,
			types,
			bodyTextFilterValue
		} = this.state;
		let data = {
			filter_created_at_start: tm(startDate)
				.tz(selectedTimeZone)
				.format(),
			filter_created_at_end: tm(endDate)
				.tz(selectedTimeZone)
				.format(),
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
			[sortBy]: asc ? 'asc' : 'desc',
		};
		
		if (bodyTextFilterValue) data['filter_data'] = bodyTextFilterValue;
		if (types !== 'All') data['filter_log_type'] = types;
		if (level !== 'All') data['filter_level'] = level;

		fetchLogs(data, 'platform');
	}

	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('StartDatePlatform'),
			endDate: sessionStorage.getItem('EndDatePlatform')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('StartDatePlatform')))
			this.handleDateEndChange(moment(sessionStorage.getItem('EndDatePlatform')))

			this.updateData()
		})
	}	

	render() {
		const {
			logs,
			classes,
			count,
			loading,
			selectedTimeZone,
			logsTypes,
			levels,
			theme
		} = this.props;

		const { types, level, bodyTextFilterValue } = this.state;

		let rows = [
			{
				id: 'id',
				numeric: false,
				disablePadding: false,
				label: 'ID',
				disableSort: true
			},
			{
				id: 'body',
				numeric: false,
				disablePadding: false,
				label: 'Body',
				disableSort: true
			},

			{
				id: 'log_type',
				numeric: false,
				disablePadding: false,
				label: 'Log Type',
				disableSort: true
			},
			{
				id: 'level',
				numeric: false,
				disablePadding: false,
				label: 'Level',
				disableSort: true
			},
			{
				id: 'created_at',
				numeric: true,
				disablePadding: false,
				label: 'Time',
				disableSort: true
			}
		];

		const jsonViewTheme = theme.palette.type === 'light' ? 'bright:inverted' : 'eighties';

		let ReactJsonStyle =theme.palette.type === 'dark' ? {backgroundColor: '#242742'} : null;

		const itemsBody = _.map(logs, item => {
			return (
				<TableRow key={item.id} hover={true}>
					<TableCell component="th" scope="row">
						{item.id}
					</TableCell>
					<TableCell
						component="th"
						scope="row"
						className={classes.body}>
						<ReactJson
							style={ReactJsonStyle}
							theme={jsonViewTheme}
							enableClipboard={false}
							displayDataTypes={false}
							src={item.data}
						/>
					</TableCell>
					<TableCell component="th" scope="row">
						{item.log_type}
					</TableCell>{' '}
					<TableCell component="th" scope="row">
						{item.level}
					</TableCell>
					<TableCell align="right">
						{tm(item.created_at)
							.tz(selectedTimeZone)
							.format('DD/MM/YYYY H:mm:ss')}
					</TableCell>
				</TableRow>
			);
		});

		return (
			<div>
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <PreloaderOverlay /> : null}
					</div>
					<TableControls
						form={'top'}
						settings={['update', 'defaultSort', 'date', 'paginate', 'text-filter']}
						clearAll={this.clearAll}
						updateData={this.handleUpdateData}
						page={this.state.page}
						handleChangePage={this.handleChangePage}
						handleDateStartChange={this.handleDateStartChange}
						startDate={this.state.startDate}
						handleDateEndChange={this.handleDateEndChange}
						endDate={this.state.endDate}
						textFilterValue={bodyTextFilterValue}
						handleTextFilterChange={this.handleTextFilterChange}
						textFilterLabel="Filter by body content"
						textFilterpPlaceholder="Filter content"
						count={count}
						addClassPaginateElementLogsPage={true}
						addClassForMediaClearFixedStyle={true}
						handleSearchClick={this.handleSearchClick}
						handleKeyPressEnter={this.handleKeyPressEnter}
					>
						<TextField
							id="outlined-select-type"
							select
							color="secondary"
							label="Type logs"
							className={classes.typeLogs}
							value={types}
							variant="outlined"
							onChange={this.handleChangeType}
							SelectProps={{
								MenuProps: {classes: { paper: classes.popoverList }}
							}}>
							{_.map(logsTypes, option => (
								<MenuItem
									key={option.filter_log_type}
									value={option.filter_log_type}>
									{option.name}
								</MenuItem>
							))}
						</TextField>

						<TextField
							id="outlined-select-type-level"
							select
							color="secondary"
							label="Level"
							className={classes.typeLogs}
							value={level}
							variant="outlined"
							onChange={this.handleChangeTypeLevel}
							SelectProps={{
								MenuProps: {classes: { paper: classes.popoverList }}
							}}>
							{_.map(levels, option => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
					</TableControls>

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
					{ logs.length ?
							<Paginated
							form={'bottom'}
							settings={['paginate']}
							updateData={this.updateData}
							page={this.state.page}
							handleChangePage={this.handleChangePage}
							count={count}
						/> :
						<div align="center" className={classes.styleNoData}>No data</div>
					}
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	logsTypes: state.logs.logsTypes.platform,
	levels: state.logs.levels.platform,
	logs: state.logs.logs,
	count: state.logs.countPage,
	loading: state.logs.loading,
	selectedTimeZone: state.timezone.currentTimeZone
});
const mapDispatchToProps = {
	fetchLogs,
	fetchLogsTypes
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withTheme,
	withStyles(styles)
)(ServerLogs);
