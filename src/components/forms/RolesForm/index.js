import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { fetchPermissions, fetchGetResourcesList } from '../../../ducks/roles';
import FieldText from '../default-fields/FieldText';
import FieldCheckBox from '../default-fields/FieldCheckBox';
import CreatorTableHeader from '../../CreatorTableHeader';
import { compose } from 'redux';
import { maxLength, minLength } from "../formValidation";

const styles = theme => ({
	dialog: {
		maxWidth: 'unset',
		// maxHeight: 'max-content'
		overflowY: 'auto'
	},
	inputWidth100: {
		width: '100%'
	},
	subDescriptionText: {
		marginTop: '20px'
	}
});

const validate = values => {
	const errors = {};
	if (!values.username) {
		errors.username = 'Is required!';
	} else if (values.username.length < 5) {
		errors.username = 'MORE 5';
	}

	return errors;
};

const minNameLength = minLength(2);
const maxNameLength = maxLength(100);
const minDescrLength = minLength(2) 
const maxDescrLength = maxLength(255);



const show = [
	{
		name: 'allow_update',
		title: 'Edit',
		show: 'updatable'
	},
	{
		name: 'allow_delete',
		title: 'Remove',
		show: 'deletable'
	},
	{
		name: 'allow_create',
		title: 'Create',
		show: 'creatable'
	},
	{
		name: 'allow_view',
		title: 'View',
		show: 'viewable'
	}
];

const rows = [
	{
		id: 'Resources',
		numeric: false,
		disablePadding: false,
		label: 'Resources',
		disableSort: true
	},
	{
		id: 'Update',
		numeric: false,
		disablePadding: false,
		label: 'Update',
		disableSort: true
	},
	{
		id: 'Delete',
		numeric: false,
		disablePadding: false,
		label: 'Delete',
		disableSort: true
	},
	{
		id: 'Create',
		numeric: false,
		disablePadding: false,
		label: 'Create',
		disableSort: true
	},

	{
		id: 'View',
		numeric: false,
		disablePadding: false,
		label: 'View',
		disableSort: true
	},
	{
		id: 'Any',
		numeric: false,
		disablePadding: false,
		label: 'Any',
		disableSort: true
	}
];

class RolesForm extends Component {
	componentDidMount() {
		const { roleId, fetchPermissions, fetchGetResourcesList } = this.props;
		if (roleId) {
			fetchPermissions(roleId);
		} else fetchGetResourcesList();
	}

	render() {
		const {
			currentRole,
			handleSubmit,
			ifError,
			textSubmit,
			title,
			handleClose,
			classes,
			user,
			subTitleText,
			hideTitleTableCreateRole,
			subDescriptionText
		} = this.props;

		return (
			<Fragment>
				<form className={`RolesForm`}>
					<Dialog
						classes={{ paper: classes.dialog }}
						open={true}
						onClose={handleClose}
						aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
							{title}
						</DialogTitle>
						<DialogContent style={{paddingTop: '0px'}}>
							<DialogContentText>
								{subTitleText}
							</DialogContentText>
							<Field
								name="role_name"
								component={FieldText}
								label="Role name"
								placeholder="Enter role name"
								variant="filled"
								fullWidth
								validate={[minNameLength, maxNameLength]}
							/>
							<Field
								name="description"
								component={FieldText}
								label="Description"
								placeholder="Enter description"
								variant="filled"
								fullWidth
								validate={[minDescrLength, maxDescrLength]}
							/>
							<div>
								<Table stickyHeader size="medium" aria-label="sticky table">

									{ hideTitleTableCreateRole && 
										<TableHead>
											<TableRow>
												<CreatorTableHeader rows={rows} />
											</TableRow>
										</TableHead>
									}

									<TableBody>
										{_.map(currentRole.resources, item => (
											<TableRow key={item.resource_code}>
												<TableCell
													component="th"
													scope="row">
													{item.resource_name}
												</TableCell>
												{_.map(show, showItem =>
													item[showItem.show] ? (
														<TableCell
															key={showItem.title}
															padding="default"
															component="th"
															scope="row">

															{/* <Tooltip
																title={ showItem.title }
															> */}

																{ user.role_code === 'super_admin' 
																
																? <Field
																	name={`resources.${
																		item.resource_code
																	}.${
																		showItem.name
																	}`}
																	component={
																		FieldCheckBox
																	}
																/> 
																
																: <Field
																	disabled = {
																		item.resource_code === 'driver_versions'
																	}
																	name={`resources.${
																		item.resource_code
																	}.${
																		showItem.name
																	}`}
																	component={
																		FieldCheckBox
																	}
																/>
															}

															{/* </Tooltip> */}
															
														</TableCell>
													) : (
														<TableCell key={showItem.title} />
													)
												)}
												{user.role_code ===
												'super_admin' ? (
													<TableCell
														padding="default"
														component="th"
														scope="row">
														<Field
														disabled = {
															item.resource_code === 'admin_documentation'
														|| item.resource_code === 'api_documentation'
														}
															name={`resources.${
																item.resource_code
															}.any`}
															component={
																FieldCheckBox
															}
														/>
													</TableCell>
												) : (
													<TableCell />
												)}
											</TableRow>
										))}
									</TableBody>
								</Table>

								{ !hideTitleTableCreateRole &&
									<DialogContentText 
										className={classes.subDescriptionText}>
										{subDescriptionText}
									</DialogContentText>
								}
							</div>

						</DialogContent>
						{ifError && (
							<Typography
								variant="body1"
								gutterBottom
								align="center"
								color="error">
								{ifError}
							</Typography>
						)}
						<DialogActions>
							<Button onClick={handleClose} color="primary">
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								type="submit"
								variant="contained"
								color="primary"
								size="medium">
								{textSubmit}
							</Button>
						</DialogActions>
					</Dialog>
				</form>
			</Fragment>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let resources = {};
	if (state.roles.currentRole) {
		_.map(state.roles.currentRole.resources, item => {
			resources[item.resource_code] = item;
		});
	}
	let data = { resources };
	if (!ownProps.formData) {
		return {
			errorHandler: state.roles.error,
			currentRole: state.roles.currentRole,
			initialValues: Object.assign(state.roles.currentRole, data),
			user: state.authorization.userData.user
		};
	} else
		return {
			errorHandler: state.roles.error,
			currentRole: state.roles.currentRole,
			initialValues: Object.assign(ownProps.formData, data),
			user: state.authorization.userData.user
		};
};

export default compose(
	connect(
		mapStateToProps,
		{ fetchPermissions, fetchGetResourcesList }
	),
	withStyles(styles),
	reduxForm({
		form: 'RolesForm', // a unique identifier for this form
		validate,
		enableReinitialize: true,
		touchOnChange: true
	})
)(RolesForm);
