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
import SearchId from '../forms/default-fields/SearchId';


const styles = theme => ({
	controls: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		padding: theme.spacing(3, 2, 4),
		[theme.breakpoints.down(1200)]:{
			paddingBottom: theme.spacing(2)
		},		
		[theme.breakpoints.up('md')]:{
			position: 'sticky',
			top: '88px',
			background: theme.palette.tableControl.tableControlColor,
			zIndex: '20',
		}
	},
	customBlockControls: {
		display: 'flex',
		alignItems: 'center',
		width: 'auto',
		[theme.breakpoints.down(1200)]:{
			// width: '100%',
			width: 'auto',
			marginBottom: theme.spacing(2)
		},
		[theme.breakpoints.down('xs')]: {
			flexWrap: 'nowrap'
		}
	},
	datetimeBlock: {
		margin: '0 10px',
		display: 'block',
		maxWidth: '160px'
	},
	children: {
		margin: '0 10px',
		display: 'inline-block'
	},
	paginate: {
		[theme.breakpoints.only('lg')]: {
			height: '100%'
		},
		[theme.breakpoints.only('xs')]: {
			width: '100%'
		},
		color: theme.typography.color,
		// color: theme.palette.type === 'dark' ? theme.palette.text.secondary: theme.palette.text.secondary,
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
		}
	},
	pagination: {
		display: 'flex',
		alignItems: 'center',
	},
	rightBlock: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		[theme.breakpoints.down(700)]:{
			// marginLeft: theme.spacing(12),
			// marginTop: theme.spacing(1)
		},
		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column'
		}
	},
	input: {
		width: '105px',
	},
	searchInput: {
		marginRight: '5pt',
		[theme.breakpoints.only('xs')]: {
			margin: '0 10px'
		}
	},
	formStyle:{
		display: 'flex',		
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

	handlePasteFileld(e){
		e.preventDefault()
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
			handleFilterById,
			textFilterValueId,
			addDashboardFalseCopipast
		} = this.props;
		const { maxPaginateValue } = this.state; 

		const paginationValidate = [numbersOnly, minOne, maxPaginateValue];
		const searchValidate = [numbersOnly];

		return (
			<div className={classes.controls}>				
				<div className={classes.customBlockControls}>
					{_.includes(settings, 'back') && (
						<Tooltip title="Back" aria-label="Back">
							<Button onClick={handleBack}>
								<Back />
							</Button>
						</Tooltip>
					)}
					{_.includes(settings, 'update') && (
						<Tooltip title="Update" aria-label="Update">
							<Button onClick={updateData} color='primary'>
								<Update />
							</Button>
						</Tooltip>
					)}
					{_.includes(settings, 'defaultSort') && (
						<Tooltip title="Default sort" aria-label="Default">
							<Button onClick={clearAll}>
								<DefaultSort />
							</Button>
						</Tooltip>
					)}
					{_.includes(settings, 'date') && (
						<React.Fragment>
							<div className={classes.formStyle}>
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
						<TextField
							className={`${classes.searchInput}`}
							label={textFilterLabel}
							color='secondary'
							onChange={handleTextFilterChange}
							placeholder={textFilterpPlaceholder}
							value={textFilterValue}
							InputLabelProps={{
								shrink: true,
							}}
							InputProps={{
								endAdornment: (
								<InputAdornment>
									{/* <IconButton  onClick={() => {
											const value = this.searchInputRef.current.value;

											if (!value) {
												return;
											}

											handleSearchClick(this.searchInputRef.current.value);
										}}>
										<SearchIcon/>
									</IconButton> */}
									<SearchIcon/>
								</InputAdornment>
								)
							}}
						/>
					)}
					{_.includes(settings, 'filter-id') && (
							<Field							
								onPaste={
									addDashboardFalseCopipast ? this.handlePasteFileld : null
								}
								name="filterId"
								className={`${classes.searchInput}`}
								label={textFilterLabel}
								type='number'
								component={SearchId}
								color='secondary'
								defaultValue={searchValue}
								handleSearchClick={handleSearchClick}
								onChange={handleFilterById ?? (() => {})}
								placeholder={textFilterpPlaceholder}
								value={textFilterValueId}
								validate={searchValidate}
								onKeyPress={(event) => {
									if (event.charCode !== 13)
										return;

									const value = event.target.value;

									handleSearchClick(value);
								}}
								InputLabelProps={{
									shrink: true,
								}}
							/>
					)}
					
						{children instanceof Array ? (
							_.map(children, item => (
								<div className={classes.children}>{item}</div>
							))
						) : (
							<div className={classes.children}>{children}</div>
						)}
				</div>
				<div className={classes.rightBlock}>
					{_.includes(settings, 'search') && (
						<TextField
							color="secondary"
							className={classes.searchInput}
							label={searchLabel}
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

										handleSearchClick(value);
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
								variant='outlined'
								color="secondary" 
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
	tableControl: state.form['bottom'],
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
		destroyOnUnmount: false,
		touchOnChange: true,
	}),
	withStyles(styles)
)(TableControls)