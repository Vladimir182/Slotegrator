import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import FormGroup from '@material-ui/core/FormGroup';
import FieldText from '../default-fields/FieldText';
import FieldSelect from '../default-fields/FieldSelect';
import { connect } from 'react-redux';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Save from '@material-ui/icons/Save';
import Update from '@material-ui/icons/RestorePage';
import Tooltip from '@material-ui/core/Tooltip';
import { compose } from 'redux';

const Protocolls = [
	{
		text: 'CCNET',
		value: 'CCNET'
	},
	{
		text: 'SSP_V6',
		value: 'SSP_V6'
	},
	{
		text: 'ICT004',
		value: 'ICT004'
	}
];
const PrinterFonts = [
	{
		text: 'Normal (11)',
		value: 'normal_11'
	},
	{
		text: 'Middle (15)',
		value: 'middle_15'
	},
	{
		text: 'Low (20)',
		value: 'low_20'
	}
];

const DispenserModels = [
	{
		text:'Puloon_LCDM_1000',
		value:'Puloon_LCDM_1000'
	},
	{
		text: 'Puloon_LCDM_2000',
		value: 'Puloon_LCDM_2000'
	}
];
const styles = theme => {
	return {
		container: {
			display: 'flex',
			flexWrap: 'wrap',
			padding: '0px 20px',
			justifyContent: 'space-between',
			'& .MuiOutlinedInput-root': {
				marginBottom: '10px !important'
			}
		},
		formGroup: {
			// marginLeft: '10px',
			width: 'calc(20% - 20px)',
			// minWidth: '400px',
			// maxWidth: '600px',

			[theme.breakpoints.down('2000')]: {
				width: 'calc(25% - 15px)',
			},
			[theme.breakpoints.down('1550')]: {
				width: 'calc(33.33% - 15px)',
			},
			[theme.breakpoints.down('1200')]: {
				width: 'calc(50% - 12px)',
			},
			[theme.breakpoints.down('900')]: {
				width: '100%',
			},
		},
		label: {
			textAlign: 'center',
			marginBottom: '20px'
		},
		toolBar: {
			display: 'flex',
			borderBottom: '1px solid rgba(0,0,0,0.1)!important',
			borderTop: '1px solid rgba(0,0,0,0.1)!important',
			padding: '10pt 5pt 10pt 5pt',
			marginBottom: '2vh',
		},
	};
};

class SettingTerminalForm extends Component {
	render() {
		const {
			handleSubmit,
			classes,
			superadmin,
			protocol,
			terminalState,
			updateData,
			addClassFormSettingsTertminal
		} = this.props;

		const protocollsItems = _.map(Protocolls, item => (
			<MenuItem key={item.value} value={item.value}>
				{item.text}
			</MenuItem>
		));

		const printerFontsItems = _.map(PrinterFonts, item => (
			<MenuItem key={item.value} value={item.value}>
				{item.text}
			</MenuItem>
		));
		const dispenserModelItems = _.map(DispenserModels, item => (
			<MenuItem key={item.value} value={item.value}>
				{item.text}
			</MenuItem>
		));
		return (
			<div>
				<form>
					<div className={classes.toolBar}>
						<Tooltip title="Update" aria-label="Update" onClick={updateData}>
							<Button >
								<Update />
							</Button>
						</Tooltip>
						<Tooltip title="Save" aria-label="Save" onClick={handleSubmit}>
							<Button>
								<Save />
							</Button>
						</Tooltip>
					</div>
					<div className={classes.container}>
						{superadmin && (
							<FormGroup className={classes.formGroup}>
								<FormLabel
									className={classes.label}
									component="legend">
									Database
								</FormLabel>
								<Field
									name="dbName"
									component={FieldText}
									label="Data Base Name"
									placeholder="Enter dbName"
									variant="outlined"
									fullWidth
								/>

								<Field
									name="dbPassword"
									component={FieldText}
									label="dbPassword"
									placeholder=" Data Base Password"
									variant="outlined"
									fullWidth
								/>

								<Field
									name="dbUserName"
									component={FieldText}
									label="Data Base User Name"
									placeholder="Data Base User Name"
									variant="outlined"
									fullWidth
								/>
							</FormGroup>
						)}
						{superadmin && (
							<FormGroup className={classes.formGroup}>
								<FormLabel
									className={classes.label}
									component="legend">
									Server
								</FormLabel>
								<Field
									name="settingsPort"
									component={FieldText}
									label="Server port"
									placeholder="Enter port"
									variant="outlined"
									fullWidth
								/>

								<Field
									name="balancerIp"
									component={FieldText}
									label="Balancer IP"
									placeholder="Enter IP"
									variant="outlined"
									fullWidth
								/>

								<Field
									name="balancerPort"
									component={FieldText}
									label="Balancer port"
									placeholder="Enter port"
									variant="outlined"
									fullWidth
								/>
								<Field
									name="app_version"
									component={FieldText}
									label="App version"
									placeholder="Version"
									variant="outlined"
									disabled
									fullWidth
								/>
							</FormGroup>
						)}

						{terminalState.dispenser &&
							terminalState.dispenser.is_exist && (
								<FormGroup className={classes.formGroup}>
									<FormLabel
										className={classes.label}
										component="legend">
										Dispenser
									</FormLabel>
									<Field
										name="dispenserModel"
										component={FieldSelect}
										label="Dispenser model"
										placeholder="Enter dispenser model"
										variant="outlined"
										fullWidth>
										{dispenserModelItems}
									</Field>

									<Field
										name="dispenserPath"
										component={FieldText}
										label="Dispenser path"
										placeholder="Enter path"
										variant="outlined"
										fullWidth
									/>
								</FormGroup>
							)}

						{terminalState.printer &&
							terminalState.printer.is_exist && (
								<FormGroup className={classes.formGroup}>
									<FormLabel
										className={classes.label}
										component="legend">
										Printer
									</FormLabel>
									<Field
										name="printerCheckWidth"
										component={FieldText}
										label="Check Width (count of symbols)"
										placeholder="Enter validator bills"
										variant="outlined"
										fullWidth
									/>

									<Field
										name="printerTopIndent"
										component={FieldText}
										label="Top indent on check"
										placeholder="Enter indent"
										variant="outlined"
										fullWidth
									/>
									<Field
										name="printerBottomIndent"
										component={FieldText}
										// label="Printer bottom indent"
										label="Bottom indent on check"
										placeholder="Enter indent"
										variant="outlined"
										fullWidth
									/>
									<Field
										name="printerPath"
										component={FieldText}
										label="Printer path"
										placeholder="Enter path"
										variant="outlined"
										fullWidth
									/>

									<Field
										name="printerFontCPI"
										component={FieldSelect}
										label="Printer font CPI"
										placeholder="Select font CPI"
										variant="outlined"
										fullWidth>
										{printerFontsItems}
									</Field>
								</FormGroup>
							)}

						{terminalState.validator &&
							terminalState.validator.is_exist && (
								<FormGroup className={classes.formGroup}>
									<FormLabel
										className={classes.label}
										component="legend">
										Validator
									</FormLabel>
									<Field
										name="validatorBills"
										component={FieldText}
										label="Validator bills"
										placeholder="Enter validator bills"
										variant="outlined"
										fullWidth
										disabled={protocol !== 'ICT004'}
									/>

									<Field
										name="validatorPath"
										component={FieldText}
										label="Validator path"
										placeholder="Enter path"
										variant="outlined"
										fullWidth
									/>

									<Field
										name="validatorProtocol"
										component={FieldSelect}
										label="Validator protocol"
										placeholder="Enter protocol"
										variant="outlined"
										fullWidth>
										{protocollsItems}
									</Field>

									<Field
										name="currency"
										component={FieldText}
										disabled
										label="Currency"
										placeholder="Enter currency"
										variant="outlined"
										fullWidth
									/>

									<Field
										name="cassetteCapacity"
										component={FieldText}
										label="Cassette capacity"
										placeholder="Enter capacity"
										variant="outlined"
										fullWidth
									/>
								</FormGroup>
							)}
					</div>
				</form>
			</div>
		);
	}
}

SettingTerminalForm = reduxForm({
	form: 'SettingTerminalForm', // a unique identifier for this form
	enableReinitialize: true
})(withStyles(styles)(SettingTerminalForm));
const selector = formValueSelector('SettingTerminalForm');
const mapStateToProps = state => ({
	current: state.merchants.current,
	settings: state.settings.settings,
	loading: state.settings.loading,
	error: state.settings.error,
	user: state.authorization.userData.user,
	protocol: selector(state, 'validatorProtocol')
});

export default compose(
	connect(mapStateToProps)
)(SettingTerminalForm);
