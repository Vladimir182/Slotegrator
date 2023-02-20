import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import { 
  Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	LinearProgress, 
	Zoom,
  Tooltip,
	TextField,
	MenuItem
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import CurrentIcon from '@material-ui/icons/TouchApp';
import StatusLabel from '../core/StatusLabel';
import CreatorTableHeader from '../components/CreatorTableHeader';
import TableControls from '../components/TableControls/TableControlSlickyHeader';

import { 
	terminalsStateAll,
	fetchTerminalON,	
	fetchTerminalOFF
} from '../ducks/terminals';
import { setSelectedNode } from '../ducks/selected';
import { statusTerminal } from '../utils/helper';
import ModalAlert from '../components/modals/ModalAlert';
import { rRender } from '../utils/helper';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

const pageLimmit = Number.parseInt(process.env.REACT_APP_API_LIMIT) || 50;

const styles = theme => ({
	root: {
		marginTop: theme.spacing(1),
		width: '100%',
		'& .MuiTableCell-stickyHeader': {
			top: '168px!important',
			height: '56px',
			fontWeight: 700,
			[theme.breakpoints.down('sm')]:{
				top: '0px!important',
			}
		},
		'& .MuiButton-root':{
			color: theme.palette.button.color,
			minWidth: '48px',
			padding: theme.spacing(3),
			border: theme.palette.button.borderColor,
			borderRadius: '50%',
				'&:hover':{
					backgroundColor: theme.palette.button.hover + '!important',
				}
		},
		'& .MuiTableRow-root':{
			height: '56px'
		},
		'& .MuiTableCell-root': {
			padding: theme.spacing(0, 1, 0, 1),
		},
		'& #outlined-select-is_attached-filter-label':{
			padding: '0px 0px',
			background: theme.overrides.MuiFormLabel.root.backgroundColor,
			left: '-5px',
			right: '-5px',
			paddingLeft: '5px',
		}
	},
	table: {
		width: '100%',
		[theme.breakpoints.down('sm')]:{
			overflow: 'auto'
		}
		// position: 'relative',
	},
	controls: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	loading: {
		height: '4px',
		width: '100%'
	},
	ok: {
		background: '#c8e6c9',
		cursor: 'pointer'
	},
	warning: {
		background: '#ffecb3',
		cursor: 'pointer'
	},
	error: {
		background: '#ffcdd2',
		cursor: 'pointer'
	},
	activeTerminal: {
		backgroundColor: theme.palette.table.selectedTerminalTableRow,
		zIndex: 0,
		"&:hover": {
			backgroundColor: theme.palette.table.hoverSelectedTerminalTableRow + '!important',
		}
	},
	filterSelect: {
		minWidth: '130px'
	}
});

const rows = [
	{
		id: 'setCurrent',
		numeric: false,
		disablePadding: false,
		label: '',
		disableSort: true
	},
	{
		id: 'id',
		numeric: false,
		center: true,
		disablePadding: false,
		label: 'ID',
		disableSort: true
	},
	{
		id: 'terminal_on',
		center: true,
		disablePadding: false,
		label: 'ON/OFF',
		disableSort: true
	},
	{
		id: 'is_connected',
		center: true,
		disablePadding: false,
		label: 'Connect',
		disableSort: true
	},
	{
		id: 'is_attached',
		center: true,
		disablePadding: false,
		label: 'Attached',
		disableSort: true
	},
	{
		id: 'printer_on',
		center: true,
		disablePadding: false,
		label: 'Printer',
		disableSort: true
	},
	{
		id: 'validator_on',
		center: true,
		disablePadding: false,
		label: 'Validator',
		disableSort: true
	},
	{
		id: 'dispenser_on',
		center: true,
		disablePadding: false,
		label: 'Dispenser',
		disableSort: true
	},
	{
		id: 'enabled_by_platform',
		center: true,
		disablePadding: false,
		label: 'Platform enabled',
		disableSort: true
	},
	{
		id: 'space_left',
		center: true,
		disablePadding: false,
		label: 'Space left',
		disableSort: true
	},
	{
		id: 'one_to_all',
		center: true,
		disablePadding: false,
		label: 'ATM mode',
		disableSort: true
	}
];

class Terminals extends React.Component {
	constructor(props) {
		super(props);

		const filterIsAttached = sessionStorage.getItem('FilterIsAttachedTerminals');
		const saveTerminalIdSearchValue = sessionStorage.getItem('TerminalIdSearchValue')

		this.state = {
			page: 0,
			focusItem: null,
			filterById: saveTerminalIdSearchValue ?? '',
			filterIsAttached: filterIsAttached ?? 'All',
			modalOnOffTerminal: false
		}

		// this.debouncedUpdateData = _.debounce(this.updateData, 1000);
	}

	componentDidMount() {
		this.updateData();
	}

	handleUpdate() {
		this.updateData();
		sessionStorage.removeItem('TerminalIdSearchValue');
	}

	updateData = () => {
			const { terminalsStateAll } = this.props;
			const { page, filterById, filterIsAttached } = this.state;

			const offset = page * pageLimmit;
			
			const params = {
				offset
			};

			if (filterById) {
				params.filter_id = filterById;	
			}
			if (filterIsAttached !== 'All') {
				params.filter_is_attached = filterIsAttached === 'Attached' ? true : false;
			} 

		terminalsStateAll(params);
	}

	handleChangePage = (e, page) => {
		this.setState({page: page}, this.updateData);
	};

	handleFilterById = e => {
		const value = e.target.value;
	
		this.setState({
			filterById: value
		}, () => {
			sessionStorage.setItem('TerminalIdSearchValue', value);
		});
	}

	handleSearchClick = (value) => {
		this.setState({
			filterById: value,
			page: 0
		},()=> this.updateData());
	}

	handleSelectTerminal = (e, item) => {
		const { setSelectedNode, user } = this.props;

		e.stopPropagation();

		setSelectedNode(item.id, 'terminal', user.resources);
	}

	handleChangeIsAttachedFilter = event => {
		sessionStorage.setItem('FilterIsAttachedTerminals', event.target.value);
		this.setState({
				...this.state,
				filterIsAttached: event.target.value
			}, this.updateData);
	};

	handleToggleStateTerminal = item => {
		this.setState({focusItem: item, modalOnOffTerminal: true});
	};

	handleSubmitToggleStateTerminal = answer => {
		const {fetchTerminalON, fetchTerminalOFF} = this.props;
		const {focusItem} = this.state;

		if (answer) {
			if (focusItem.is_on) fetchTerminalOFF(focusItem.id);
			else fetchTerminalON(focusItem.id);
		}

		this.setState({modalOnOffTerminal: false});
	};

  render() {
		const { terminals, classes, loading, count, selected, user } = this.props;

		const {
		// 	modalTerminalInfo,
		// 	terminalInfo,
			focusItem,
			modalOnOffTerminal,
			page,
			filterById,
			filterIsAttached
		} = this.state;

		const isAttachedFilters = ['All', 'Attached', 'Unattached'];

		const itemsBody = _.map(terminals, item => {
			const isActiveTerminal = selected.terminal?.id === item.id;

			const {dispenser, printer, validator} = item;

			return (
				<TableRow
					className={classNames(classes.tableRow, {
						[classes.activeTerminal]: isActiveTerminal
					})}
					hover
					key={item.id}
					// onClick={() => this.handleOpenTerminalInfo(item)}
				>
					<TableCell component="th" scope="row">
						<Tooltip title="Select" aria-label="Select">
							<Button 
								color='secondary'
								style={{'marginLeft': '8px'}}
								onClick={(e) => this.handleSelectTerminal(e, item)}>
								<CurrentIcon />
							</Button>
						</Tooltip>
					</TableCell>
					<TableCell align="left" component="th" scope="row">
						<div style={{'display':'flex', 'justifyContent': 'center', 'alignItems': 'center', "minWidth": '120px'}}>
							<TableCell style={{'width': '24px', 'height':'24px', 'padding': '2px', 'borderBottom': 'none'}}>
								{ !(dispenser.is_no_error && printer.is_no_error && validator.is_no_error) &&
										<ReportProblemOutlinedIcon style={{'color':'#f44336', 'textAlign': 'center' }} fontSize='small'/> 
								}
							</TableCell>
							<TableCell style={{'borderBottom': 'none'}}>
								Terminal {item.id}
							</TableCell>
						</div>
					</TableCell>
					<TableCell align="center">
						<Button color='primary' onClick={e => this.handleToggleStateTerminal(item) }>
							<StatusLabel status={statusTerminal({stageData: item.is_on}, 1)}/>
						</Button>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.is_connected}, 3 )}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.is_attached}, 3 )}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.printer }, 4)}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.validator }, 4)}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.dispenser }, 4)}/>
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.enabled_by_platform}, 2 )}/>
					</TableCell>
					<TableCell align="center">
						{item.validator && item.validator.space_left}
					</TableCell>
					<TableCell align="center">
						<StatusLabel status={statusTerminal({stageData: item.one_to_all}, 2)} />
					</TableCell>
				</TableRow>
			);
		});

		return (
			<div className={classes.root}>
				{modalOnOffTerminal && (
					<ModalAlert
						answer={this.handleSubmitToggleStateTerminal}
						text={
							focusItem.is_on
								? 'Do you really want to turn off the terminal?'
								: 'Do you really want to turn on the terminal?'
						}
						titel={'Title'}
					/>
				)}
				{/* {modalTerminalInfo && (
					<TerminalDetailsModal
						handleClose={this.handleCloseTerminalInfo}
						handlePowerTerminal={this.handleToggleStateTerminal}
						data={terminalInfo}
						config={TerminalConfig}
					/>
				)} */}
				<Paper>
					<div className={classes.loading}>
						{loading ? <LinearProgress/> : null}
					</div>
					<TableControls
						form={'bottom'}
						settings={['update', 'paginate', 'filter-id']}
						updateData={this.handleUpdate.bind(this)}
						textFilterValueId={filterById}
						handleChangePage={this.handleChangePage.bind(this)}
						handleFilterById={this.handleFilterById}
						handleSearchClick={this.handleSearchClick}
						textFilterpPlaceholder="Terminal ID"
						page={page}
						count={count}
					>
						{
							rRender(user.resources, 'unattached_terminals', 'allow_view') &&
							<TextField
								id="outlined-select-is_attached-filter"
								select
								variant='outlined'
								color="secondary"
								label="Filter is_attached"
								className={classes.filterSelect}
								value={filterIsAttached}
								onChange={this.handleChangeIsAttachedFilter}
								SelectProps={{
									MenuProps: {classes: { paper: classes.popoverList }}
								}}
							>
								{_.map(isAttachedFilters, option => (
									<MenuItem
										key={option}
										value={option}
									>
										{option}
									</MenuItem>
								))}
							</TextField>
						}
					</TableControls>
					<div className={classes.table}>
						<Table stickyHeader size="medium" aria-label="sticky table">
							<TableHead>
								<TableRow>
									<CreatorTableHeader
										{...this.state}
										rows={rows}
										handleSort={this.handleSort}
									/>
								</TableRow>
							</TableHead>
							<TableBody>{itemsBody}</TableBody>
						</Table>
					</div>
				</Paper>
			</div>
		);
  }
}

const mapStateToProps = (state) => ({
  loading: state.terminals.loading,
  terminals: state.terminals.terminals,
  count: state.terminals.count,
  user: state.authorization.userData.user,
  selected: state.selected
});

const mapDispatchToProps = {
  terminalsStateAll,
  setSelectedNode,
  fetchTerminalON,
  fetchTerminalOFF
};

export default compose(
	connect(mapStateToProps,mapDispatchToProps),
	withStyles(styles)
)(Terminals);
