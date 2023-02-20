import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { Button, TextField } from '@material-ui/core';
import FieldText from '../forms/default-fields/FieldText'
import Update from '@material-ui/icons/RestorePage';
import Back from '@material-ui/icons/ArrowBackIos';
import DefaultSort from '@material-ui/icons/Sort';
import Tooltip from '@material-ui/core/Tooltip';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import DateTimePicker from '../forms/default-fields/DateTimePicker';
import tm from 'moment-timezone';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { maxValue, minValue, regExpTest, validationRegs } from '../forms/formValidation';


const styles = theme => ({
	controls: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		padding: '5pt 10pt',
		[theme.breakpoints.up('md')]: {
			position: 'sticky',
			top: '136px',
			background: theme.palette.tableControl.tableControlColor,
			zIndex: '20',
		},		
		'&.stopStickyStyle':{
			[theme.breakpoints.down('1400')]:{
				position: 'static',
				top: '0 !important'
			}
		}
	},
	customBlockControls: {
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			flexWrap: 'wrap',
			padding: '10px'
		}
	},
	datetimeBlock: {
		marginLeft: theme.spacing(2),
		marginTop: theme.spacing(2),
		display: 'block',
		maxWidth: '160px'
	},
	children: {
		marginLeft: theme.spacing(2),
		display: 'inline-block'
	},
	paginate: {
		[theme.breakpoints.only('lg')]: {
			height: '100%'
		},
		[theme.breakpoints.only('xs')]: {
			width: '100%'
		},
		'& .MuiTablePagination-actions' : {
			flexShrink: '0',
			marginLeft: '0px!important'
		},
		'& .MuiTablePagination-toolbar': {
			minHeight: '48px',
		},
		'& .MuiTablePagination-actions' : {
			flexShrink: '0',
			marginLeft: theme.spacing(1)
		},
		'& .MuiIconButton-colorInherit': {
			color: theme.palette.activeLinkColor,
		},
		'& .MuiIconButton-root:hover':{
			backgroundColor: theme.palette.table.hoverSelectedTerminalTableRow,
		},
		'& .MuiIconButton-root.Mui-disabled': {
			color: 'rgba(118, 114, 251, 0.3)'
		},
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
			
	},
	pagination: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '8px',
		[theme.breakpoints.only('xs')]: {	
		}
	},
	rightBlock: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		marginTop: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			marginTop: '0',
			marginLeft: theme.spacing(2),
		},
		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column',
			marginLeft: theme.spacing(2),
			
		}
	},
	input: {
		width: '105px',
	},
	searchInput: {
		marginTop: theme.spacing(2),
		marginLeft: theme.spacing(2),
		[theme.breakpoints.only('xs')]: {
			marginTop: theme.spacing(2),
			margin: '0 10px'
		}
	},
	formStyle:{
		display: 'flex',
		flexDirection: 'row'
	}
});

const validate = (values) => {
	const errors = {};
	errors.from = tm(values.from).isAfter(values.to, 'YYYY-MM-DD')
		? 'Value can\'t be later then to value'
		: undefined;
	errors.to = tm(values.to).isBefore(values.from, 'YYYY-MM-DD')
		? 'Value can\'t be earlier then from value' 
		: undefined;
	return errors
};

const numbersOnly = regExpTest(validationRegs.numbersOnly);
const minOne = minValue(1);

class TableControls extends Component {
	constructor(props) {
		super(props);

		this.searchInputRef = React.createRef();

		const pageLimmit = Number.parseInt(process.env.REACT_APP_API_LIMIT) || 50;
		const maxPageNumber = this.props.count / pageLimmit;
		const maxPaginateValue = maxValue(Math.ceil(maxPageNumber));	

		this.state = {
			startDate: null,
			endDate: null,
			count: null,
			maxPaginateValue
		}
	}

	static getDerivedStateFromProps(props, state) {
		const newState = {};
		

		if (props.startDate && props.endDate) {
			newState['startDate'] = props.startDate;
			newState['endDate'] = props.endDate;
			newState['count'] = props.count;
		}
		// if (props.startDate !== state.startDate && props.page !== 0) {
		// 	props.handleChangePage(null, 0);
		// }
		// if (props.endDate !== state.endDate && props.page !== 0 ) {
		// 	props.handleChangePage(null, 0);
		// }
		if (props.count !== state.count) {
			const pageLimmit = Number.parseInt(process.env.REACT_APP_API_LIMIT) || 50;
			const maxPageNumber = props.count / pageLimmit;
			const maxPaginateValue = maxValue(Math.ceil(maxPageNumber));	

			newState['count'] = props.count;
			newState['maxPaginateValue'] = maxPaginateValue;
		}
		if (Object.keys(newState).length) {
			return newState;
		}

		return null;
	}
	
	render() {
		let {
			settings = ['update', 'defaultSort', 'date', 'paginate'],
			updateData,
			clearAll,
			page = 0,
			handleDateStartChange,
			handleDateEndChange,
			handleChangePage,
			handleBack,
			datesValidationError,
			datesValidationErrorText,
			classes,
			count = 0,
			startDate,
			endDate,
			selectedTimeZone,
			children,
			searchLabel,
			handleSearchClick,
			handleSearchChange,
			searchValue,
			textFilterValue,
			handleTextFilterChange,
			textFilterLabel,
			textFilterpPlaceholder,
			tableControl,
			addClassPaginateElementLogsPage,
			addClassForMediaClearFixedStyle,
			handleKeyPressEnter,
		} = this.props;
		const { maxPaginateValue } = this.state; 

		const paginationValidate = [numbersOnly, minOne, maxPaginateValue];

		return (
			<div className={`${classes.controls} ${addClassForMediaClearFixedStyle ? 'stopStickyStyle' : ''}`}>
				<div className={`${classes.customBlockControls} ${ addClassPaginateElementLogsPage ? 'wrapControlsPanelLogs' : '' }`}>
					{_.includes(settings, 'back') && (
						<Tooltip title="Back" aria-label="Back">
							<Button color="secondary" onClick={handleBack}>
								<Back />
							</Button>
						</Tooltip>
					)}
					{_.includes(settings, 'update') && (
						<Tooltip title="Update" aria-label="Update">
							<Button color="secondary" onClick={updateData}>
								<Update />
							</Button>
						</Tooltip>
					)}
					{_.includes(settings, 'defaultSort') && (
						<Tooltip title="Default sort" aria-label="Default">
							<Button color="secondary" onClick={clearAll}>
								<DefaultSort />
							</Button>
						</Tooltip>
					)}
					{_.includes(settings, 'date') && (
						<React.Fragment>
							<div className={`${classes.formStyle} ${addClassPaginateElementLogsPage ? 'wrapDateLogsPage' : ''}`}>
								<div className={classes.datetimeBlock}>
									<Field
										component={DateTimePicker}
										autoOk
										color='primary'
										name="from"
										ampm={false}
										onChange={handleDateStartChange}
										label="From"
									/>
								</div>
								<div className={classes.datetimeBlock}>
									<Field
										component={DateTimePicker}
										autoOk
										color='primary'
										name="to"
										ampm={false}
										onChange={handleDateEndChange}
										label={"To"}
									/>
								</div>
							</div>
						</React.Fragment>
					)}
					{_.includes(settings, 'text-filter') && (
						<div className={`${addClassPaginateElementLogsPage ? 'wrapFilterLogsPage' : ''}`}>
							<TextField
								className={classes.searchInput}
								label={textFilterLabel}
								color='secondary'
								variant="outlined"
								onChange={handleTextFilterChange}
								// onChange={handleSearchChange}
								placeholder={textFilterpPlaceholder}
								value={textFilterValue}
								InputLabelProps={{
									shrink: true,
								}}
								InputProps={{
									endAdornment: (
									<InputAdornment>
										<IconButton  onClick={() => {
												// const value = this.searchInputRef.current.value;

												// if (!value) {
												// 	return;
												// }

												handleSearchClick(textFilterValue);
											}}>
											<SearchIcon/>
										</IconButton>
										{/* <SearchIcon/> */}
									</InputAdornment>
									)
								}}
								onKeyPress={handleKeyPressEnter}
							/>
						</div>
					)}
					{children instanceof Array ? (
						_.map(children, item => (
							<div className={classes.children}>{item}</div>
						))
					) : (
						<div className={classes.children}>{children}</div>
					)}
				</div>
				<div className={`${classes.rightBlock} ${ addClassPaginateElementLogsPage ? 'paginationLogsPage' : ''}`}>
					{_.includes(settings, 'search') && (
						<TextField
							color="secondary"
							className={classes.searchInput}
							label={searchLabel}
							variant="outlined"
							onChange={handleSearchChange}
							inputRef={this.searchInputRef}
							defaultValue={searchValue}
							InputProps={{
								endAdornment: (
								<InputAdornment>
									<IconButton  onClick={() => {
										const value = this.searchInputRef.current.value;

										if (!value) {
											return;
										}

										handleSearchClick(this.searchInputRef.current.value);
									}}>
									<SearchIcon/>
									</IconButton>
								</InputAdornment>
								)
							}}
						/>
					)}
					{_.includes(settings, 'paginate') && (
						<div className={classes.pagination}>
							<Field 
								name="paginate"
								component={FieldText}
								type='number'
								color="secondary" 
								variant="outlined"
								className={classes.input}
								placeholder="Force page"
								validate={paginationValidate}
								onKeyPress={(e) => {
								if (e.key === "Enter") {
									let valuePage = Number.parseInt(e.target.value);
									const isNotValid = 'paginate' in tableControl?.syncErrors;

									if (valuePage && !isNotValid)
										handleChangePage(e, valuePage - 1)
									}
								}} 
							/>
							<TablePagination
								component="div"
								className={classes.paginate}
								rowsPerPageOptions={[
									process.env.REACT_APP_API_LIMIT || 50
								]}
								count={count}
								rowsPerPage={
									Number.parseInt(process.env.REACT_APP_API_LIMIT) ||
									50
								}
								page={page}
								backIconButtonProps={{
									'aria-label': 'Previous Page'
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page'
								}}
								onChangePage={(...params) => {
									window.scrollTo(0, 0);
									handleChangePage(...params);
								}}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

TableControls.defaultProps = {
	handleSearchClick: () => {},
	handleSearchChange: () => {}
};

const mapStateToProps = (state, ownProps) => ({
	tableControl: state.form['top'],
	initialValues: {
		from: ownProps.startDate,
		to: ownProps.endDate
	}
});

export default compose(
	connect(mapStateToProps),
	reduxForm({
		validate: validate,
		// form: `table-control`,
		// form: _.uniqueId(`table-control`),
		enableReinitialize: true,
		// keepDirtyOnReinitialize: true,
		touchOnChange: true
	}),
	withStyles(styles)
)(TableControls)