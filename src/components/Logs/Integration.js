import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogs } from '../../ducks/logs';
import CreatorTableHeader from '../CreatorTableHeader';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import tm from 'moment-timezone';
import TableControls from '../TableControls';
import Zoom from '@material-ui/core/Zoom';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import ReactJson from 'react-json-view';
import { compose } from 'redux';

let SHADE = 50;
const styles = theme => {
	if (theme.palette.type === 'dark') {
		SHADE = 'A200';
	} else {
		SHADE = 50;
	}

	return {
		root: {
			// width: '100%',
			marginTop: theme.spacing.unit * 3
			// overflowX: 'auto'
		},
		table: {
			//minWidth: '700px'
			width: '100%',
			overflowX: 'auto'
		},
		maxWidth: {
			maxWidth: '1000px',
			overflow: 'auto'
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
			minWidth: '150px'
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		rowCorrect: {
			backgroundColor: green[SHADE]
		},
		rowUnCorrect: { backgroundColor: red[SHADE] }
	};
};

class ServerLogs extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
				.endOf('month')
				.format('YYYY-MM-DD HH:mm:ss'),

			level: 'All',
			types: 'All'
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
					.endOf('month')
					.format('YYYY-MM-DD HH:mm:ss'),

				level: 'All',
				types: 'All'
			},
			this.updateData
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

	handleDateStartChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);

		this.setState(
			{
				startDate: tm(testZone)
					.tz(selectedTimeZone)
					.format()
			},
			this.updateData
		);
	};
	handleDateEndChange = date => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(date).format('YYYY-MM-DD HH:mm:ss')).format(
			'YYYY-MM-DD HH:mm:ss'
		);
		this.setState(
			{
				endDate: tm(testZone)
					.tz(selectedTimeZone)
					.format()
			},
			this.updateData
		);
	};
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
		this.setState(
			{
				...this.state,
				types: event.target.value
			},
			this.updateData
		);
	};
	handleChangeTypeLevel = event => {
		this.setState(
			{
				...this.state,
				level: event.target.value
			},
			this.updateData
		);
	};
	handleChangePage = (e, page) => {
		this.setState({ page: page }, this.updateData);
	};
	componentDidMount() {
		this.updateData();
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
			types
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
		if (types !== 'All') data['filter_log_type'] = types;
		if (level !== 'All') data['filter_level'] = level;
		fetchLogs(data, 'integration');
	};
	render() {
		const {
			logs,
			classes,
			count,
			loading,
			selectedTimeZone,
			logsTypes,
			levels
		} = this.props;
		const { types, level } = this.state;
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
						{loading ? <LinearProgress /> : null}
					</div>
					<TableControls
						settings={['update', 'defaultSort', 'date', 'paginate']}
						clearAll={this.clearAll}
						updateData={this.updateData}
						page={this.state.page}
						handleChangePage={this.handleChangePage}
						handleDateStartChange={this.handleDateStartChange}
						startDate={this.state.startDate}
						handleDateEndChange={this.handleDateEndChange}
						endDate={this.state.endDate}
						count={count}>
						<TextField
							id="outlined-select-type"
							select
							label="Type logs"
							className={classes.typeLogs}
							value={types}
							onChange={this.handleChangeType}>
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
							label="Level"
							className={classes.typeLogs}
							value={level}
							onChange={this.handleChangeTypeLevel}>
							{_.map(levels, option => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
					</TableControls>

					<div className={classes.table}>
						<Table className={classes.table}>
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
					<TableControls
						settings={['paginate']}
						updateData={this.updateData}
						page={this.state.page}
						handleChangePage={this.handleChangePage}
						count={count}
					/>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	logsTypes: state.logs.logsTypes.integration,
	levels: state.logs.levels.integration,
	logs: state.logs.logs,
	count: state.logs.countPage,
	loading: state.logs.loading,
	selectedTimeZone: state.timezone.currentTimeZone
});
const mapDispatchToProps = {
	fetchLogs
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(ServerLogs);
