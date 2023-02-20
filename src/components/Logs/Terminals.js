import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogs, fetchLogsTypes } from '../../ducks/logs';
import CreatorTableHeader from '../CreatorTableHeader';
import moment from 'moment';
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
import CustomControl from './CustomTerminalIdPicker';
import Zoom from '@material-ui/core/Zoom';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import ReactJson from 'react-json-view';
import widgets from "../../ducks/widgets";
import {fetchTerminalsState} from '../../ducks/widgets';
import { compose } from 'redux';
import PreloaderOverlay from '../preloaders/PreloaderOverlay';
import Autocomplete from '@material-ui/lab/Autocomplete';

let SHADE = 50;
const styles = theme => {
	if (theme.palette.type === 'dark') {
		SHADE = 'A200';
	} else {
		SHADE = 50;
	}

	return {
		root: {
			width: '100%',
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
				flexWrap: 'wrap'
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
				[theme.breakpoints.down('920')]:{
					width: '100%',
					marginBottom: '0px',
				},
				
				'& + div > div': {

					justifyContent: 'flex-start',
					flexWrap: 'wrap',

					'& > div': {
						[theme.breakpoints.down('920')]:{
							marginTop: theme.spacing(4),
						},
					}
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
		AutocompleteStyle: {
			'& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
				padding: '7px',
			},
			marginTop: theme.spacing(2)
			},
		table: {
			width: '100%',
		},
		maxWidth: {
			maxWidth: '1000px',
			overflow: 'auto'
		},
		reload: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		body: {
			maxWidth: '400px'
		},
		typeLogs: {
			minWidth: '120px',
			margin: '0 10px 0 0',
			marginTop: theme.spacing(2)
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		rowCorrect: {
			backgroundColor: green[SHADE]
		},
		customStylesInput: {
			'&>div': {
				marginTop: '7px',
				color: theme.palette.type === 'dark' ? theme.palette.primary.contrastText : theme.palette.dark,
				fontWeight: '500',
				width: '30px',
				marginBottom: '0px'
			}
		},
		rowUnCorrect: { backgroundColor: red[SHADE] },
		groupStyle:{
			display: 'flex',
			justifyContent: 'space-between',
			[theme.breakpoints.down('xs')]: {
			flexWrap: 'wrap'
			}
		},
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

class Terminals extends Component {
	constructor(props) {
		super(props);

		this.debouncedUpdateData = _.debounce(this.updateData, 1000);

		const savedStartDate = sessionStorage.getItem('StartDateTerminals');
		const savedEndDate = sessionStorage.getItem('EndDateTerminals');
		const savedTypeLogs = sessionStorage.getItem('TypeLogsTerminals');
		const savedLevel = sessionStorage.getItem('LevelTerminals');
		const savedTerminalID = sessionStorage.getItem('TerminalIdTerminals');
		const savedTextFilterValue = sessionStorage.getItem('LogsTerminalsBodyTextFilterValue');

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
			terminalId: savedTerminalID ? savedTerminalID : 'All',
			terminalIds: [],
			bodyTextFilterValue: savedTextFilterValue ?? ''
		};
	}


	componentDidMount() {
		if( !sessionStorage.getItem('StartDateTerminals') ){
			sessionStorage.setItem('StartDateTerminals', moment(tm().utc().startOf('month').format('YYYY-MM-DD HH:mm:ss')))			
		}	
		if( !sessionStorage.getItem('EndDateTerminals') ){
			sessionStorage.setItem('EndDateTerminals', moment(tm().utc().endOf('day').format('YYYY-MM-DD HH:mm:ss')))
		}	

		const { fetchLogsTypes, fetchTerminalsState } = this.props;
		fetchLogsTypes();
		this.updateData();
		fetchTerminalsState({
			offset: 0,
			id: 'asc'
		});
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
				terminalId: 'All',
				bodyTextFilterValue: ''
			},
			() => {
				sessionStorage.removeItem('StartDateTerminals');
				sessionStorage.removeItem('EndDateTerminals');
				sessionStorage.removeItem('TypeLogsTerminals');
				sessionStorage.removeItem('LevelTerminals');
				sessionStorage.removeItem('TerminalIdTerminals');
				sessionStorage.removeItem('LogsTerminalsBodyTextFilterValue');

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
			tm(endDate).isBefore(startDate, 'YYYY-MM-DD')
			|| tm(startDate).isAfter(endDate, 'YYYY-MM-DD')
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

			sessionStorage.setItem('StartDateTerminals', date);

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

			sessionStorage.setItem('EndDateTerminals', date);

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
	static getDerivedStateFromProps(nextProps, prevState){
		let terminalIds = [];

		terminalIds = nextProps.terminals.map(item => String(item.id));
		terminalIds.unshift('All');

		return {
			terminalIds : terminalIds
		};
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
		sessionStorage.setItem('TypeLogsTerminals', event.target.value);
		this.setState(
			{
				...this.state,
				types: event.target.value
			},
			this.updateData
		);
	}
	handlerTerminalIdChange = (event, value) => {
		sessionStorage.setItem('TerminalIdTerminals', value);
		this.setState(
			{
				...this.state,
				terminalId: value
			},
			this.updateData
		);
	}
	handleChangeTypeLevel = event => {
		sessionStorage.setItem('LevelTerminals', event.target.value);
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
				sessionStorage.setItem('LogsTerminalsBodyTextFilterValue', value);
				// this.debouncedUpdateData();
			}
		);
	}	

	handleSearchClick = (e) => {
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
			terminalId,
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
			[sortBy]: asc ? 'asc' : 'desc'
		};

		if (bodyTextFilterValue) data['filter_data'] = bodyTextFilterValue;
		if (types !== 'All') data['filter_log_type'] = types;
		if (level !== 'All') data['filter_level'] = level;
		if (terminalId !== 'All') data['filter_terminal_id'] = terminalId;

		fetchLogs(data, 'terminals');
	}

	handleUpdateData = (date) => {
		this.setState({
			startDate: sessionStorage.getItem('StartDateTerminals'),
			endDate: sessionStorage.getItem('EndDateTerminals')
		}, () => {
			this.handleDateStartChange(moment(sessionStorage.getItem('StartDateTerminals')))
			this.handleDateEndChange(moment(sessionStorage.getItem('EndDateTerminals')))

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

		const { types, level, terminalId, bodyTextFilterValue } = this.state;
		let { terminalIds } = this.state;

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
						<div className={classes.groupStyle}>
							<TextField
								id="outlined-select-type"
								select
								color="secondary"
								label="Type logs"
								variant="outlined"
								className={classes.typeLogs}
								value={types}
								onChange={this.handleChangeType}
								SelectProps={{
									MenuProps:{classes: {paper: classes.popoverList}}
								}}>
								{/* {_.map(logsTypes, option => (
									<MenuItem
										key={option.filter_log_type}
										value={option.filter_log_type}>
										${option.name}
									</MenuItem>
								))} */}
								{_.map( _.uniqBy(logsTypes, 'filter_log_type'), option => (
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
								variant="outlined"
								className={classes.typeLogs}
								value={level}
								onChange={this.handleChangeTypeLevel}
								SelectProps={{
									MenuProps:{classes: {paper: classes.popoverList}}
								}}
							>
								{_.map(levels, option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</TextField>
							<Autocomplete
								autoComplete={true}
								autoHighlight={true}
								disableClearable={true}
								className={classes.AutocompleteStyle}
								id="search-id"
								options={terminalIds}
								value={terminalId}
								variant="outlined"
								onChange={this.handlerTerminalIdChange}
								renderInput={(params) => {
								return (
									<TextField 
									 	style={{width: 100}}
										variant="outlined"
										{...params} 	
										label="Terminal ID" 
										placeholder='Select currency'
										fullWidth={true} />
								)}
							}
							/>
						</div>
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
					{	logs.length ?
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
	logsTypes: state.logs.logsTypes.terminals,
	levels: state.logs.levels.terminals,
	logs: state.logs.logs,
	count: state.logs.countPage,
	loading: state.logs.loading,
	selectedTimeZone: state.timezone.currentTimeZone,
	terminals: state.widgets.terminals.data,
});

const mapDispatchToProps = {
	fetchLogs,
	fetchLogsTypes,
	fetchTerminalsState
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withTheme,
	withStyles(styles)
)(Terminals);
