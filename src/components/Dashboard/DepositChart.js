import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchChartDeposit } from '../../ducks/deposit';
import tm from 'moment-timezone';
import _ from 'lodash';
import Zoom from '@material-ui/core/Zoom';
import purple from '@material-ui/core/colors/purple';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import DatePicker from '../forms/default-fields/DatePicker';
import { ceil10 } from '../../utils/helper';
import Loading from '../preloaders/Preloader';
import withWidth from '@material-ui/core/withWidth';
import {Field, reduxForm} from 'redux-form';
import {compose} from "redux";
import { red } from '@material-ui/core/colors';

const color = purple;

const styles = theme => ({
	chartWrapper: {
		display: 'flex',
		flexDirection: 'column'
	},
	chart: {
		transform: 'scale(1)!important',
		transition: 'transform 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		[theme.breakpoints.up('xs')]: {
			width: '100%'
		}
	},
	chartTitle: {
		textAlign: 'center'
	},
	chartToolsWrapper: {  
		display: 'flex',
		width: '100%',
		justifyContent: 'space-between',
		marginTop: '20px',
		alignItem: 'center',
		// [theme.breakpoints.down('xs')]: {
		// 	flexDirection: 'column',
		// 	justifyContent: 'center',
		// 	alignItems: 'center'
		// }	
		
		[theme.breakpoints.down('1200')]: {
			flexWrap: 'wrap',
		},	

		[theme.breakpoints.down('700')]: {
			flexWrap: 'wrap',
			width: '100%',
		}
	},
	pickersWrapper: {
		display: 'flex',

		[theme.breakpoints.down('700')]: {
			flexWrap: 'wrap',
			width: '100%'
		}		
	},
	buttonsWrapper: {
		display: 'flex',
		alignItems: 'center',
		paddingTop: '7px',
		'& .MuiIconButton-root': {
			padding: '6px',
			margin: '6px',
			border: theme.palette.button.borderColor
		},
		'& .MuiIconButton-root:hover':{
			backgroundColor: theme.palette.table.hoverSelectedTerminalTableRow,
		},
		'& .MuiIconButton-root.Mui-disabled': {
			color: 'rgba(118, 114, 251, 0.3)',
			border: '2px solid rgba(118, 114, 251, 0.2)'
		},
		[theme.breakpoints.down('700')]: {
			paddingTop: '0px',
		},
		[theme.breakpoints.down('1200')]: {
			// width: '100%'
		}
	},
	datetimeBlock: {
		marginRight: '10px',

		[theme.breakpoints.down('700')]: {
			width: '100%',
			marginBottom: theme.spacing(2)
		}
	},
	chartPagination: {
		fontSize: '12px',
		color: theme.typography.color,
		lineHeight: '3.5',
		whiteSpace: 'nowrap'
	},
	loadingWrapper: { 
		padding: '25% 0' 
	}
});

const validate = (values) => {
	const errors = {};
	errors.startDate = tm(values.startDate).isAfter(values.endDate, 'YYYY-MM-DD')
		? 'Value can\'t be later then to value'
		: undefined;
	errors.endDate = tm(values.endDate).isBefore(values.startDate, 'YYYY-MM-DD')
		? 'Value can\'t be earlier then from value'
		: undefined;
	return errors
};

class DepositChart extends Component {
	constructor(props) {
		super(props);

		const savedStartDate = sessionStorage.getItem('deposit-startDate');
		const savedEndDate = sessionStorage.getItem('deposit-endDate');

		this.state = {
			page: 0,
			startChartDate: null,
			endChartDate: null,
			depositPagesCount: null,
			depositsData: [],
			forcePage: 1,
			sortBy: 'id',
			asc: true,
			startDate: savedStartDate ? savedStartDate : tm().startOf('month'),
			endDate: savedEndDate ? savedEndDate : tm().endOf('month'),

		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.loading !== nextProps.loading
			|| this.state.depositsData.length === 0 && nextState.depositsData.length > 0
			|| !_.isEqual(this.props.selected, nextProps.selected)
			|| this.state.page !== nextState.page
		) {
			return true;
		}

		return false;
	}

	static getDerivedStateFromProps = (props, state) => {
		let depositPagesCount = props.depositRangeElems && props.depositRangeElems !== state.depositPagesCount
		? props.depositRangeElems
		: state.depositPagesCount;
		
		depositPagesCount = depositPagesCount === null ? 1 : depositPagesCount;

		let depositData = !_.isEqual(props.deposit, state.depositsData) ? props.deposit : state.depositsData;
		depositData = depositData.filter(depositItem => depositItem.is_verified === true && depositItem.is_stacked === 'success');

		return {
			depositPagesCount: depositPagesCount,
			depositData
		}
	};

	componentDidMount() {
		this.updateData();
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(this.props.selected, prevProps.selected)) {
		  this.updateData();
		}
	}

	checkDatesRageIsValid = (startDate, endDate) => {
		if (
			tm(endDate).isBefore(startDate, 'YYYY-MM-DD')
			|| tm(startDate).isAfter(endDate, 'YYYY-MM-DD')
		) {
			return false;
		}
		return true;
	};

	handleChangeDate = (timeObj, fieldName) => {
		const { selectedTimeZone } = this.props;
		let testZone = tm(tm(timeObj).format('YYYY-MM-DD')
		);
		const isDataRangeValidStart = this.checkDatesRageIsValid(tm(testZone).tz(selectedTimeZone).format(), this.state.endDate);
		const isDataRangeValidEnd = this.checkDatesRageIsValid(this.state.startDate, tm(testZone).tz(selectedTimeZone).format());
		
		this.setState({
			[fieldName]: timeObj,
			page: 0,
			startChartDate: null,
			endChartDate: null,
			depositData: [],
		}, this.updateData);

		switch (fieldName) {
			case 'startDate':
				if (isDataRangeValidStart) {
					sessionStorage.setItem('deposit-' + fieldName, timeObj);
				}
				this.setState({
				startDate: tm(testZone)
					.tz(selectedTimeZone)
					.format()
			});
				break;
			case 'endDate':
				if (isDataRangeValidEnd) {
					sessionStorage.setItem('deposit-' + fieldName, timeObj);
				}
				this.setState({
					endDate: tm(testZone)
						.tz(selectedTimeZone)
						.format()
				});
				break;
		}
	};

	handleChangePage = ({target, newStartChartDate, newEndChartDate}) => {
		this.setState(prevState => {
			const newPageValue = target === 'next' ? prevState.page + 1 : prevState.page - 1; 
			return {
				lastPage: prevState.page,
				page: newPageValue,
				startChartDate: newStartChartDate,
				endChartDate: newEndChartDate,
				depositData: []
			}
		}, this.updateData);
	};

	updateData = () => {
		const { selected, fetchChartDeposit, selectedTimeZone } = this.props;
		const { page, sortBy, asc, startDate, endDate } = this.state;
		
		const datesRangeData = {
			filter_created_at_start: tm(startDate)
				.tz(selectedTimeZone)
				.format(),
			filter_created_at_end: tm(endDate)
				.endOf('day')
				.tz(selectedTimeZone)
				.format()
		}

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

		fetchChartDeposit({
			offset: page * (process.env.REACT_APP_API_LIMIT || 50),
			[sortBy]: asc ? 'asc' : 'desc',
			is_stacked: 'success',
			is_verified: true,
			[selectedTable]: selectedId,
			...datesRangeData
		}, selectedTimeZone);
	};

	getDepositsDataRange = ({startDate, endDate, deposit, page, depositPagesCount}) => {
		let { lastPage, startChartDate, endChartDate } = this.state;
		const { selectedTimeZone } = this.props;
		const data = [];
		const labels = [];
		let max = 0;
		let cond = true;

		if (!deposit.length) {
			startChartDate = startDate;
			endChartDate = endDate;
		} else {
			if (page === 0) {
				startChartDate = startDate;
				endChartDate = deposit[deposit.length - 1].created_at;
			} else if (page !== 0 && page === depositPagesCount - 1) {
				startChartDate = endChartDate;
				endChartDate = endDate;
			} else {
				startChartDate = page > lastPage 
					? endChartDate
					: deposit[0].created_at;
				endChartDate = page !== lastPage 
					? tm(deposit[deposit.length - 1].created_at).add(1, 'days') 
					: deposit[deposit.length - 1].created_at;
			}
		}

		let currentDate = tm(startChartDate).clone();

		do {
			const todayDataArr = deposit.filter(item => tm(item.created_at).startOf('day').tz(selectedTimeZone).isSame(currentDate, 'day')); 
			if (todayDataArr.length) {
				let daySum = _.reduce(todayDataArr, (sum, item) => sum + item.amount, 0);
				max = max > daySum ? max : daySum;
				data.push({y: daySum, created_at: tm(currentDate).tz(selectedTimeZone).format()})
				labels.push(tm(currentDate).format('YYYY MMM DD'));
			} else {
				if (
					tm(startChartDate).isSame(currentDate, 'day') 
					|| tm(endChartDate).isSame(currentDate, 'day') 
					|| tm(startChartDate).isSame(endChartDate, 'day')
				) {
					data.push({y: 0, created_at: tm(currentDate).tz(selectedTimeZone).format()});
					labels.push(tm(currentDate).format('YYYY MMM DD'));
				} 
			}

			currentDate = tm(currentDate).add(1, 'days');
			cond = tm(endChartDate).isAfter(currentDate, 'day') === false && labels.length < 2 
				? tm(endChartDate).clone().add(1, 'days').isAfter(tm(currentDate)) 
				: tm(endChartDate).isAfter(tm(currentDate));
		} while(cond);

		max = !max ? 5 : max;

		return { data, labels, max, newStartChartDate: startChartDate, newEndChartDate: endChartDate };
	};

	render() {
		const { classes, theme, width, loading, selected } = this.props;
		const { startDate, endDate, page, depositData, depositPagesCount } = this.state;

		const { data, labels, max, newStartChartDate, newEndChartDate } = this.getDepositsDataRange({
			startDate, 
			endDate, 
			deposit: depositData, 
			page, 
			depositPagesCount, 
		});

		const isLoading = loading || selected.isLoading;

		const dataChart = (canvas) => {
			
			const ctx = canvas.getContext("2d")
			const gradient = ctx.createLinearGradient(0,0,0,200);
			gradient.addColorStop(0.1, '#6662D9');
			gradient.addColorStop(0.2, 'rgba(102,98,217,0.4)');
			gradient.addColorStop(1, 'rgba(102,98,217,0.1)');

		return {
			labels: labels,
			datasets: [
				{
					label: 'Deposit',
					fill: true,
					lineTension: 0.1,
					backgroundColor: gradient,
					borderColor: '#6662D9',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					borderWidth: 2,
					pointBorderColor: '#6D68E8',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 4,
					pointHoverRadius: 4,
					pointHoverBackgroundColor: '#6D68E8',
					pointHoverBorderColor: '#6D68E8',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: data
				}
			],
		};
	}
		const xMaxTicksLimit = width === 'xl' ? 5 : 4;

		return (
			<>
			{ !isLoading ?
				<div className={classes.chartWrapper}>
					<Zoom in="true" timeout={0}>
					{/* in={!loading && depositData.length} elevation={4000} */}
						<div className={classes.chart}>
							<Line
								data={dataChart}
								options={{
									tooltips: {
										callbacks: {
											label: (tooltipItem, _data) => `Deposit sum: ${tooltipItem.yLabel} ${tooltipItem.currency || ''}` 
										}
									},
									legend: {
										labels: {
											fontColor: theme.palette.text.primary
										}
									},
									responsive: true,
									scales: {
										xAxes: [
											{
												ticks: {
													fontColor: theme.palette.text.primary,
													maxTicksLimit: xMaxTicksLimit,
													minRotation: 0,
													maxRotation: 0,
													source: 'labels'
												},
												gridLines: {
													color: theme.palette.divider
												}
											}
										],
										yAxes: [
											{
												ticks: {
													fontColor: theme.palette.text.primary,
													min: 0,
													suggestedMax: ceil10(max),
													maxTicksLimit: 5,
												},
												gridLines: {
													color: theme.palette.divider
												}
											}
										]
									}
								}}
							/>
						</div>
					</Zoom>
					<div className={classes.chartToolsWrapper}>
						<div className={classes.pickersWrapper}>
							<div className={classes.datetimeBlock}>
								<Field
									color="primary"
									component={DatePicker}
									name="startDate"
									autoOk
									onChange={e => this.handleChangeDate(e, 'startDate')}
									label="From"
								/>
							</div>
							<div className={classes.datetimeBlock}>
								<Field
									color="primary"
									component={DatePicker}
									name="endDate"
									autoOk
									onChange={e => this.handleChangeDate(e, 'endDate')}
									label="To"
								/>
							</div>
						</div>
						<div className={classes.buttonsWrapper}>
							<IconButton 
								color="secondary" 
								aria-label="previous period" 
								disabled={page === 0}  
								onClick={e => this.handleChangePage({target:'prev', newStartChartDate, newEndChartDate})}
							>
								<NavigateBeforeIcon />
							</IconButton>
							<IconButton 
								color="secondary" 
								aria-label="next period" 
								disabled={page + 1 === depositPagesCount}
								onClick={e => this.handleChangePage({target:'next', newStartChartDate, newEndChartDate})}
							>
								<NavigateNextIcon />
							</IconButton>
							<span className={classes.chartPagination}>page {page + 1} of {depositPagesCount}</span>
						</div>
					</div>
				</div>
				: <div className={classes.loadingWrapper}><Loading /></div>
			}
			</> 
		);
	}
}
const mapStateToProps = state => {
	const startDate = sessionStorage.getItem('deposit-startDate') ? sessionStorage.getItem('deposit-startDate') : tm().startOf('month');
	const endDate = sessionStorage.getItem('deposit-endDate') ? sessionStorage.getItem('deposit-endDate') : tm().endOf('month');
	
	return {
		selected: state.selected,
		deposit: state.deposit.data,
		depositRangeElems: state.deposit.chartPagesCount,
		loading: state.deposit.loading,
		selectedTimeZone: state.timezone.currentTimeZone,
		initialValues: {
			startDate: startDate,
			endDate: endDate
		}
	}
};

const mapDispatchToProps = {
	fetchChartDeposit
};

export default  compose(
	connect(mapStateToProps, mapDispatchToProps),
	reduxForm({
		validate,
		form: 'deposit',
		enableReinitialize: true,
		destroyOnUnmount: false
		// keepDirtyOnReinitialize: true
	}),
	withStyles(styles),
	withWidth(),
	withTheme, 
)(DepositChart);