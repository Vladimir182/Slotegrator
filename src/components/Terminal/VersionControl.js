import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import TerminalDriversForm from '../Forms/TerminalDriversForm';
import {
	fetchAddDrivers,
	fetchEditDrivers,
	fetchDrivers,
	clearError
} from '../ducks/drivers';
import ErrorTerminal from './ErrorTerminal';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/PersonAdd';
import { Button } from '@material-ui/core';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import CreatorTableHeader from '../CreatorTableHeader';

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
		}
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
		numeric: true,
		disablePadding: false,
		label: 'App version',
		disableSort: true
	},
	{
		id: 'description',
		numeric: true,
		disablePadding: false,
		label: 'Description',
		disableSort: true
	},
	{
		id: 'link',
		numeric: true,
		disablePadding: false,
		label: 'Link',
		disableSort: true
	},
	{
		id: 'update_type',
		numeric: true,
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
	}
];

class VersionControl extends Component {
	state = {
		create: false,
		edit: false,
		formData: null,
		trash: false
	};
	handleAddSubmit = values => {
		const { fetchAddDrivers, selected } = this.props;
	};

	updateData = () => {
		const { fetchDrivers, selected } = this.props;
		if (selected.nodeType === 'terminal') fetchDrivers();
	};

	render() {
		const { classes, loading, drivers, user, error } = this.props;
		const { edit, create, formData } = this.state;
		const itemsBody = _.map(drivers, item => (
			<TableRow key={item.id}>
				<TableCell>{item.id}</TableCell>
				<TableCell>{item.app_version}</TableCell>
				<TableCell>{item.description}</TableCell>
				<TableCell>{item.link}</TableCell>
				<TableCell>{item.update_type}</TableCell>
				<TableCell>{item.created_at}</TableCell>
			</TableRow>
		));
		return (
			<div>
				<Paper className={classes.root}>
					<div className={classes.loading}>
						{loading ? <LinearProgress /> : null}
					</div>
					<Tooltip title="Add role" aria-label="Add role">
						<Button onClick={this.openModalCreateRole}>
							<AddIcon />
						</Button>
					</Tooltip>
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
					{error.isError && (
						<ErrorTerminal
							//handleBack={this.handleBack}
							message={error.message}
						/>
					)}
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
							//superadmin={user.role_code === 'super_admin'}
							subTitleText="Please fill in and send the application form below to edit the driver data."
						/>
					)}
					{create && (
						<TerminalDriversForm 
							onSubmit={this.handleAddSubmit}
							subTitleText="Please fill in and send the application form below to create a new driver."
						/>
					)}
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
	drivers: state.drivers.settings,
	loading: state.drivers.loading,
	error: state.drivers.error,
	user: state.authorization.userData.user
});
const mapDispatchToProps = {
	fetchDrivers,
	fetchAddDrivers,
	fetchEditDrivers,
	clearError
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(VersionControl);
