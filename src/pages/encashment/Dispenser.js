import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { 
	TakenBills,
	LeftBills, 
	RejectedTray 
} from '../../components/encashment/Dispenser';
import {
	fetchCreateEncashmentDispenser,
	fetchStakedData
} from '../../ducks/dispenser';
import {fetchSettings} from '../../ducks/settings';
import { withRouter } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Preloader from '../../components/preloaders/PreloaderOverlay';
import ErrorTerminal from '../../components/Terminal/ErrorTerminal';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
	},
	styleTabs: {
		color: theme.palette.type === 'dark' ? theme.palette.text.secondary: theme.palette.text.primary
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
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
});

class EncashmentDispenser extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			currentTab: 0,
			filledForms: 0,
			takenBillsValid: false,
			first_name: '',
			last_name: '',
			terminalData: [],
			takenBillsData: null,
			rejectedTrayData: null,
			leftBillsData: null,
		};
	}

	componentDidMount() {
		const { selected } = this.props;
		
		if (selected?.terminal?.is_connected === false)
			return;

		this.updateData();
	}

	updateData = () => {
		const {fetchStakedData, fetchSettings, selected } = this.props;
		const terminalId = selected.terminal.id;

		fetchSettings(terminalId);
		fetchStakedData(terminalId)
	};

	static getDerivedStateFromProps(props, state) {

		const { loadingDispenser, dispenser, settings, selected } = props;
		let stacked_bills;

		(settings.dispenserModel === "Puloon_LCDM_2000") 
		? stacked_bills = dispenser.stacked_bills 
		: stacked_bills = dispenser.single_stacked_bills
					
		if(loadingDispenser && stacked_bills){
			return {
				takenBillsData: null
			}
		}

		if (!state.takenBillsData && stacked_bills) {

			let takenBillsData = stacked_bills.map(item => ({
				casset_id: item.casset_id,
				currency: item.currency,
				denomination: item.denomination,
			})); 

			let rejectedTrayData = stacked_bills.map(item => ({
				currency: item.currency,
				denomination: item.denomination,
			})); 


			let leftBillsData = stacked_bills.map(item => ({
				casset_id: item.casset_id,
				currency: '',
				denomination: '',
			}));

			return {
				terminalData: stacked_bills,
				takenBillsData: takenBillsData,
				rejectedTrayData: rejectedTrayData,
				leftBillsData: leftBillsData,
			}
		}

		return null;
	}

	handleChangeTab = (event, newValue) => {
		this.setState({ currentTab: newValue });
	};

	takenBillsHandleSubmit = (formValues) => {
		this.setState((prevState) => ({
			...prevState,
			...formValues,
			takenBillsData: formValues.stated,
			currentTab: 1,
			filledForms: prevState.filledForms < 1 ? 1 : prevState.filledForms
		}));
	};

	setTakenBillsFormValid = (valid) => {
		this.setState({
			takenBillsValid: valid
		})
	};

	rejectedTrayHandleSubmit = (formValues) => {
		this.setState({
			rejectedTrayData: formValues.stated,
			currentTab: 2,
			filledForms: 2,
		});
	};

	resetFormData = (formName) => {
		this.setState((prevState) => ({
			first_name: formName === 'takenBills' ? '' : prevState.first_name,
			last_name: formName === 'takenBills' ? '' : prevState.last_name,
			filledForms: formName === 'takenBills' ? 0 : formName === 'rejectedTray' ? 1 : 2,
			[`${formName}Data`]: formName === 'takenBills' || formName === 'rejectedTray' 
				? this.getTakenBillsDefaultData(prevState.terminalData) 
				: this.getLeftBillsDefaultData(prevState.terminalData),
		}));
	};

	getTakenBillsDefaultData = (terminalData) => {
		let leftBillsData = terminalData.map(item => ({
			casset_id: item.casset_id,
			currency: item.currency,
			denomination: item.denomination,
		}));

		return leftBillsData;
	}

	getLeftBillsDefaultData = (terminalData) => {
		let leftBillsData = terminalData.map(item => ({
			casset_id: item.casset_id,
			currency: '',
			denomination: '',
		}));

		return leftBillsData;
	}

	getRejectedTrayDefaultData = (terminalData) => {
		let rejectedTrayData = terminalData.map(item => ({
			currency: item.currency,
			denomination: item.denomination,
		}));

		return rejectedTrayData;
	}

	resetLeftBillsNominalField = (index) => {
		let newleftBillsData = [...this.state.leftBillsData];
		newleftBillsData[index] = {
			...newleftBillsData[index],
			denomination: '',
		}
		this.setState({ leftBillsData: newleftBillsData });
	};

	updateFormInitValues = ([e, item, index, formName]) => {
		let value = e.target.value;
		this.setState((prevState) =>{
			let newData = prevState[`${formName}Data`];
			newData[index][item] = value;
			return {
				[`${formName}Data`]: newData,
			}
		});
	};

	leftBillsHandleSubmit = () => {
		const { 
			first_name, 
			last_name, 
			takenBillsData, 
			rejectedTrayData, 
			leftBillsData 
		} = this.state;
		
		const { 
			selected, 
			fetchCreateEncashmentDispenser,
		} = this.props;

		const data = {
			collector: { first_name: first_name, last_name: last_name },
			merchant_id: selected.merchant.id,
			room_id: selected.room.id,
			terminal_id: selected.terminal.id,
			stated: {
				taken_bills: takenBillsData,
				rejected_tray: rejectedTrayData,
				left_bills: leftBillsData
			}
		}
		
		fetchCreateEncashmentDispenser(data);

		this.resetFormData('takenBills');
		this.resetFormData('rejectedTray');
		this.resetFormData('leftBills');
		
		this.setState({
			currentTab: 0,
		})
	};

	getInitValues = (billsData, userData) => ({
		first_name: userData.firstName,
		last_name: userData.lastName,
		stated: billsData
	});	
	
	render() {
		let { 
			error,
			classes, 
			selected, 
			loading,
			loadingTerminals,
			loadingDispenser,
			errorTerminals,
			isEncashmentDispenserDone
		} = this.props;

		let { 
			filledForms,
			first_name,
			last_name,
			takenBillsValid,
			takenBillsData,
			rejectedTrayData,
			leftBillsData,
			terminalData,
		}  = this.state;

		loading = loading || loadingTerminals || loadingDispenser;
		
		error = (error && error.isError) ? error 
			: errorTerminals.isError ? errorTerminals
			: (selected.terminal && !selected.terminal.is_connected) ? { message: 'Terminal is not connected' }
			: null;

		let { currentTab } = this.state;
		let userData = { 
			firstName: first_name,
			lastName: last_name 
		}

		let takenBillsInitValues = this.getInitValues(takenBillsData, userData);
		let rejectedTrayInitValues = this.getInitValues(rejectedTrayData, userData);
		let leftBillsInitValues = this.getInitValues(leftBillsData, userData);

		currentTab = !terminalData.length ? 0 : currentTab;
		return (
		<>
			<div>
				{ (selected.nodeType !== 'terminal' || isEncashmentDispenserDone) 
					? <Redirect to="/" /> 
					: <Paper className={classes.root}>
						{ error 
							? <ErrorTerminal message={error.message} />
						  : (
							<>
								<Tabs
									className={classes.styleTabs}
									indicatorColor="secondary"
									value={currentTab} 
									onChange={this.handleChangeTab}>
									<Tab
										label="Step 1"
									/>
									<Tab
										label="Step 2"
										disabled={filledForms < 1 || !takenBillsValid}
									/>
									<Tab
										label="Step 3"
										disabled={filledForms < 2 || !takenBillsValid}
									/>
								</Tabs>
								<div className={classes.table}>
								{ loading && <Preloader /> }
									{currentTab === 0 && <TakenBills
															data={takenBillsData ?? []}
															handleSubmit={this.takenBillsHandleSubmit}
															handleResetForm={this.resetFormData}
															setTakenBillsFormValid={this.setTakenBillsFormValid}
															updateInitValues={this.updateFormInitValues}
															initValues={takenBillsInitValues}
														/>}
									{currentTab === 1 && <RejectedTray 
															handleSubmit={this.rejectedTrayHandleSubmit}
															updateInitValues={this.updateFormInitValues}
															handleResetForm={this.resetFormData}
															initValues={rejectedTrayInitValues}
														/>}
									{currentTab === 2 && <LeftBills 
															handleSubmit={this.leftBillsHandleSubmit}
															handleChange={this.updateFormInitValues}
															handleResetForm={this.resetFormData}
															resetNominalField={this.resetLeftBillsNominalField}
															initValues={leftBillsInitValues}
															userData={userData}
															isTerminalConnected={selected.terminal.is_connected}
														/>}
								</div>
							</>
							)
						}
					</Paper>
				}
			</div>
		</>
		);
	}
}

const mapStateToProps = state => ({
		selected: state.selected,
		dispenser: state.dispenser,
		settings: state.settings.settings,
		loadingDispenser: state.dispenser.loading,
		loadingTerminals: state.widgets.terminals.loading,
		errorTerminals: state.widgets.terminals.error,
		error: state.dispenser.error,
		isEncashmentDispenserDone: state.dispenser.isEncashmentDispenserDone
});

const mapDispatchToProps = {
	fetchCreateEncashmentDispenser,
	fetchStakedData,
	fetchSettings
};

export default compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles),
)(EncashmentDispenser);
