import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogsTerminals } from '../../ducks/logs';
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
			marginTop: theme.spacing.unit * 3
		},
		table: {
			width: '100%',
			overflowX: 'auto'
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
		rowCorrect: {
			backgroundColor: green[SHADE]
		},
		rowUnCorrect: { backgroundColor: red[SHADE] }
	};
};
const logsTermianlTypeOptions = [
	{
		key: 'validator',
		text: 'Validator',
		value: 'validator'
	},
	{
		key: 'printer',
		text: 'Printer',
		value: 'printer'
	},
	{
		key: 'database',
		text: 'Database',
		value: 'database'
	},
	{
		key: 'settings',
		text: 'Settings',
		value: 'settings'
	}
];
const rows = [
	{
		id: 'id',
		numeric: false,
		disablePadding: false,
		label: 'ID'
	},
	{
		id: 'terminal_id',
		numeric: true,
		disablePadding: false,
		label: 'Terminal ID'
	},
	{
		id: 'message_params',
		numeric: true,
		disablePadding: false,
		label: 'Message'
	},
	{ id: 'created_at', numeric: true, disablePadding: false, label: 'Time' }
];

class TerminalsLogs extends Component {
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
			request: 'validator'
		};
	}
	clearAll = () => {
		this.setState(
			{
				page: 0,
				forcePage: 1,
				sortBy: 'id',
				asc: false
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
	createSortHandler = property => {
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
	handleChangeType = event => {
		this.setState(
			{
				...this.state,
				request: event.target.value
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
	updateData = () => {
		const { selected, fetchLogsTerminals, selectedTimeZone } = this.props;
		const { sortBy, asc, page, endDate, startDate, request } = this.state;
		
		const data = {
			filter_type: request === 'all' ? 'validator' : request,
			filter_created_at_start: tm(startDate)
				.tz(selectedTimeZone)
				.format(),
			filter_created_at_end: tm(endDate)
				.tz(selectedTimeZone)
				.format(),
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
			[sortBy]: asc ? 'asc' : 'desc'
		};
		
		let filter = 'filter_';
		let selectedId = null;
		
		switch (selected.nodeType) {
			case 'terminal':
				filter += 'terminal_id';
				selectedId = selected.terminal.id
				break;
			case 'room':
				filter += 'room_id';
				selectedId = selected.room.id
				break;
			case 'merchant':
				filter += 'merchant_id';
				selectedId = selected.merchant.id
				break;
		}
		data[filter] = selectedId;
		fetchLogsTerminals(data);
	};
	render() {
		const { logs, classes, count, loading, selectedTimeZone } = this.props;
		const itemsBody = _.map(logs, item => {
			return (
				<TableRow
					key={item.id}
					className={
						item.status === 'error'
							? classes.rowUnCorrect
							: classes.rowCorrect
					}>
					<TableCell component="th" scope="row">
						{item.id}
					</TableCell>
					<TableCell align="right">{item.terminal_id}</TableCell>
					<TableCell align="right">{`${item.params} \n ${
						item.message
					}`}</TableCell>
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
							value={this.state.request}
							onChange={this.handleChangeType}>
							{_.map(logsTermianlTypeOptions, option => (
								<MenuItem
									key={option.value}
									value={option.value}>
									{option.text}
								</MenuItem>
							))}
						</TextField>
					</TableControls>

					<div className={classes.table}>
						<Table>
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
	selected: state.selected,
	logs: state.logs.logs,
	count: state.logs.countPage,
	loading: state.logs.loading,
	selectedTimeZone: state.timezone.currentTimeZone
});
const mapDispatchToProps = {
	fetchLogsTerminals
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(TerminalsLogs);
