import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import { withRouter } from 'react-router';
import TerminalDriversForm from '../components/forms/TerminalDriversForm';
import {
	fetchAddDrivers,
	fetchEditDrivers,
	fetchDrivers,
	clearError
} from '../ducks/drivers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { rRender } from '../utils/helper';
import tm from 'moment-timezone';
import cm from 'classnames';
import CreatorTableHeader from '../components/CreatorTableHeader';
import { Redirect } from 'react-router-dom';

import _ from 'lodash';
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
			marginTop: theme.spacing.unit * 3,
				'& .MuiTableCell-stickyHeader': {
					top: '150px!important',
				// [theme.breakpoints.between('xs','sm')]:{
				// 	position: 'slicky',
				// 	top: '0!important'
				// },
			},
			[theme.breakpoints.between('xs','sm')]:{
				// overflowX: 'auto'
			},
			'& .MuiButton-textSecondary': {
				minWidth: '48px',
				height: '48px',
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
						top: '0 !important'
					}				
				},
			},
		},
		table: {
			//minWidth: '700px'
			width: '100%'
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
		loading: {
			height: '5px',
			width: '100%'
		},
		rowCorrect: {
			backgroundColor: green[SHADE]
		},
		rowUnCorrect: { backgroundColor: red[SHADE] },
		applySettingsNotify: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '200px'
		},
		unActive: {
			opacity: '.5',
			cursor: 'not-allowed',
			pointerEvents: 'none'
		},
		controls:{
			padding: '5pt 10pt',

			paddingTop: '8px',
			paddingBottom: '8px',
			backgroundColor: theme.palette.tableControlPanelBG,	 
			position: 'sticky',
			top: '88px',
			zIndex: '1000',
	
			[theme.breakpoints.down('1200')]: {
				position: 'static',
				top: '0px!important',
			},
		},

		wrapTableForScroll: {	
			[theme.breakpoints.down('1200')]:{
				overflowX: 'auto',
			},
		},
	};
};

const rows = [
	{
		id: 'id',
		numeric: false,
		disablePadding: false,
		label: 'ID',
		disableSort: true
	},
	{
		id: 'app_version',
		numeric: false,
		disablePadding: false,
		label: 'App version',
		disableSort: true
	},
	{
		id: 'description',
		numeric: false,
		disablePadding: false,
		label: 'Description',
		disableSort: true
	},
	{
		id: 'link',
		numeric: false,
		disablePadding: false,
		label: 'Link',
		disableSort: true
	},
	{
		id: 'update_type',
		numeric: false,
		disablePadding: false,
		label: 'Update type',
		disableSort: true
	},
	{
		id: 'created_at',
		numeric: true,
		disablePadding: false,
		label: 'Created',
		disableSort: true
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'Action',
		disableSort: true
	}
];

class Drivers extends Component {
	state = {
		create: false,
		edit: false,
		formData: null,
		trash: false
	};
	handleAddSubmit = values => {
		const { fetchAddDrivers } = this.props;

		return fetchAddDrivers(values, this.handleResetAll).catch(error => {
			throw error;
		});
	};
	handleEditSubmit = values => {
		const { fetchEditDrivers } = this.props;
		const { formData } = this.state;
		return fetchEditDrivers(formData.id, values, this.handleResetAll).catch(
			error => {
				throw error;
			}
		);
	};
	componentDidMount() {
		this.updateData();
	}
	updateData = () => {
		const { fetchDrivers } = this.props;
		fetchDrivers();
	};
	openModalAddDriver = () => {
		this.setState({ create: true });
	};
	handleModalEditDriver = data => {
		this.setState({ edit: true, formData: data });
	};
	handleResetAll = () => {
		this.setState({
			create: false,
			edit: false,
			formData: null,
			trash: false
		});
	};
	render() {
		const {
			classes,
			loading,
			drivers,
			user,
			history,
			resources,
			selectedTimeZone
		} = this.props;
		const { edit, create, formData } = this.state;

		if (!rRender(user.resources, 'driver_versions', 'allow_view')) {
			return <Redirect to="/"	/>
		}

		const itemsBody = _.map(drivers, item => (
			<TableRow
				key={item.id}
				className={cm({
					[classes.unActive]: !item.is_active
				})}>
				<TableCell>{item.id}</TableCell>
				<TableCell>{item.app_version}</TableCell>
				<TableCell>{item.description}</TableCell>
				<TableCell>{item.link}</TableCell>
				<TableCell>{item.update_type}</TableCell>
				<TableCell align="right">
					{tm(item.created_at)
						.tz(selectedTimeZone)
						.format('DD/MM/YYYY H:mm:ss')}
				</TableCell>
				<TableCell>
					{rRender(resources, 'driver_versions', 'allow_create') && (
						<Tooltip title="Edit driver" aria-label="Edit driver">
							<Button
								disabled={!rRender(resources, 'driver_versions', 'allow_update')}
								onClick={() =>
									this.handleModalEditDriver(item)
								}>
								<EditIcon />
							</Button>
						</Tooltip>
					)}
				</TableCell>
			</TableRow>
		));
		return (
			<div>
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>

					{rRender(resources, 'driver_versions', 'allow_create') && (
						<div className={classes.controls}>
							<Tooltip title="Add driver" aria-label="Add driver">
								<Button 
								color='secondary'
								onClick={this.openModalAddDriver}
								disabled={!rRender(resources, 'driver_versions', 'allow_update')}>
									<AddIcon />
								</Button>
							</Tooltip>
						</div>
					)}
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
					{/* {applySettings && !error.isError && (
						<div className={classes.applySettingsNotify}>
							<Typography variant="h4" component="p">
								Apply new settings. Please wait!
							</Typography>
						</div>
					)} */}
					{edit && (
						<TerminalDriversForm
							onSubmit={this.handleEditSubmit}
							initialValues={formData}
							textSubmit="Save"
							title="Edit driver"
							handleClose={this.handleResetAll}
							//superadmin={user.role_code === 'super_admin'}
							subTitleText="Please fill in and send the application form below to edit the driver data."
						/>
					)}
					{create && (
						<TerminalDriversForm
							textSubmit="Add"
							title="Add new driver"
							onSubmit={this.handleAddSubmit}
							handleClose={this.handleResetAll}
							subTitleText="Please fill in and send the application form below to create a new driver."
						/>
					)}
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	drivers: state.drivers.data,
	loading: state.drivers.loading,
	error: state.drivers.error,
	user: state.authorization.userData.user,
	resources: state.authorization.userData.user.resources,
	selectedTimeZone: state.timezone.currentTimeZone
});
const mapDispatchToProps = {
	fetchDrivers,
	fetchAddDrivers,
	fetchEditDrivers,
	clearError
};

export default compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Drivers);
