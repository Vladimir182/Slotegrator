import React, {Component} from 'react';
import tm from 'moment-timezone';
import {withStyles} from '@material-ui/core/styles';
import classNames from "classnames";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
	fetchPrinterCheck,
	fetchPrinterStatus,
	fetchValidatorCommand,
	fetchValidatorInfo,
	fetchValidatorStatus,
	fetchAskForDispense,
	fetchDispense,
	fetchPurge,
	fetchDispenserTest,
	fetchDispenserInfo,
	fetchDispenserStatus,
	cleanTerminalTestData
} from '../../ducks/testing';
import {
	fetchForceEncashment,
	ResetForceStatus
} from '../../ducks/validator'
import {connect} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import _ from 'lodash';
import ErrorTerminalMultiple from './ErrorTerminalMultiple';
import ErrorTerminal from './ErrorTerminal';
import LinearProgress from '@material-ui/core/LinearProgress';
import Update from '@material-ui/icons/RestorePage';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import FieldDispenserTestForm from "../forms/terminal-forms/FieldDispenserTestForm";
import currencies from '../../utils/currencies';
import notesNominals from '../../utils/notesNominals';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'redux';

const styles = theme => {
	return {
		root: {
			// paddingTop: '10px',
				'& .MuiButton-textSecondary': {
					minWidth: '48px',
					height: '48px',
					marginLeft: '10px',
					border: theme.palette.button.borderColor,
					borderRadius: theme.palette.button.radius,
					'&:hover':{
						backgroundColor: theme.palette.button.hover,
				}
			}
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		label: {
			textAlign: 'center',
			marginBottom: '20px'
		},
		bold: {
			fontWeight: '700',
			paddingLeft: '10px',
			marginRight: '10px'
		},
		card: {
			marginBottom: '15px',
			display: 'inline-block',
			// minHeight: '300px',
			// minWidth: '362px',
			// margin: '0 3px',

			width: 'calc(25% - 22px)',
			[theme.breakpoints.down('1600')]: {
				width: 'calc(50% - 22px)',
			},
			[theme.breakpoints.down('1100')]: {
				width: 'calc(100% - 22px)',
			}

		},
		caption: {
			display: 'block',
			width: '100%',
			marginLeft: '15px',
			[theme.breakpoints.down('1100')]: {
				width: '90%',
			}
		},
		toolBar: {
			display: 'flex',
			borderBottom: '1px solid rgba(0,0,0,0.1)!important',
			borderTop: '1px solid rgba(0,0,0,0.1)!important',
			padding: '5pt 10pt',
			marginBottom: '2vh',
		},
		btnStyle: {
			flexBasis: '200px',
			padding: '8px',
			fontSize: '16px'
		},
		wrap: {
			display: 'flex',
			flexWrap: 'wrap',
			width: 'auto',
			[theme.breakpoints.down('sm')]: {
				flexDirection: 'column',
				flexBasis: '100%'
			}
		},
		dispenserCards: {
			marginBottom: '20px',
			marginLeft: '15px'
		},
		greenColor: {
			color: 'green'
		},
		redColor: {
			color: 'red'
		},
		whiteColor: {
			color: '#ffffff'
		},
		cardPadding: {
			padding: '8px 17px'
		},
		ul: {
			margin: '0'
		},
		loaderStyle:{
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
		},
		loaderStyle_2:{
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			marginTop: '20px'
		},
		wrapTableForScroll: {	
			[theme.breakpoints.down('1200')]:{
				overflowX: 'auto',
			},
		},
	};
};

const Commands = [
	{
		text: 'Choose here',
		value: 'Choose here'
	},
	{
		text: 'Enable accepting',
		value: 'accepting/enable'
	},
	{
		text: 'Disable accepting',
		value: 'accepting/disable'
	},
	{
		text: 'Stack cash',
		value: 'bill/stack'
	},
	{
		text: 'Return cash',
		value: 'bill/return'
	},
	{
		text: 'Reset validator',
		value: 'validator/reset'
	}
];


class Testing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionValidator: Commands[0].value,
			currency: null,
			amount: null,
			preloaderTestValidation: false,
			preloaderStatusPrinter: false,
			preloaderStatusDispenser: false,
			preloaderDispenserTest: false,
			preloaderPurge: false,
			preloaderAskForDispense: false,
			preloaderDispense: false,

		};
	}

	handleCurrencyChange = (eventObj, value) => {
		this.setState({
			currency: value
		});
	};

	handleAmountChange = (eventObj, value) => {
		this.setState({
			amount: value
		});
	};
	handlePrintCheck = () => {
		const {fetchPrinterCheck, selected} = this.props;
		const ptrintParams = this.testPrinterParams();

		if (selected.nodeType === 'terminal') {
			fetchPrinterCheck(selected.terminal.id, ptrintParams);
		}
	};
	handleButton = (buttonTarget) => {
		const {currency, amount} = this.state;
		const {fetchAskForDispense, fetchDispense, selected} = this.props;
		if (!currency || !amount) {
			this.setState({
				errorStatus: true
			});

			return;
		}

		let params = {
			currency,
			amount
		};

		switch (buttonTarget) {
			case 'ask-dispense':
				fetchAskForDispense(selected.terminal.id, params);

				this.setState({
					preloaderAskForDispense: true
				});
				break;
			case 'dispense':
				fetchDispense(selected.terminal.id, params);

				this.setState({
					preloaderDispense: true
				});
				break;
		}
	};

	handlePurgeButton = () => {
		const {selected, fetchPurge} = this.props;

		fetchPurge(selected.terminal.id);

		this.setState({
			preloaderPurge: true
		})
	};
	handleDispenserTestButton = () => {
		const {selected, fetchDispenserTest} = this.props;

		fetchDispenserTest(selected.terminal.id);
		
		this.setState({
			preloaderDispenserTest: true
		})
	};
	componentDidUpdate(prevProps, prevState) {
		if(prevState.preloaderDispenserTest && prevProps.loadings === true && this.props.loadings === false ||
			prevState.preloaderPurge && prevProps.loadings === true && this.props.loadings === false ||
			prevState.preloaderAskForDispense && prevProps.loadings === true && this.props.loadings === false ||
			prevState.preloaderDispense && prevProps.loadings === true && this.props.loadings === false ||
			prevState.preloaderTestValidation && prevProps.loadings === true && this.props.loadings === false ||
			prevState.preloaderStatusPrinter && prevProps.loadings === true && this.props.loadings === false ||
			prevState.preloaderStatusDispenser && prevProps.loadings === true && this.props.loadings === false
		) {
			setTimeout(() =>{
				this.setState({
					preloaderDispenserTest: false,
					preloaderPurge: false,
					preloaderAskForDispense: false,
					preloaderDispense: false,
					preloaderTestValidation: false,
					preloaderStatusPrinter: false,
					preloaderStatusDispenser: false
				});
			}, 2000);
		}
	}

	componentDidMount() {
		this.updateData();
	}

	componentWillUnmount() {
		const {ResetForceStatus} = this.props;
		ResetForceStatus();
	}

	updateButtonHandle = () => {
		const {cleanTerminalTestData} = this.props;
		cleanTerminalTestData();
		this.updateData()
		this.setState({
			currency: null,
			amount: null,
			preloaderTestValidation: true,
			preloaderStatusPrinter: true,
			preloaderStatusDispenser: true
		})
	};

	updateData() {
		const {
			selected,
			terminals,
			fetchValidatorInfo,
			// fetchValidatorStatus,
			fetchPrinterStatus,
			fetchDispenserInfo,
			fetchDispenserStatus,
			ResetForceStatus
		} = this.props;


		if (selected.nodeType === 'terminal') {
			// fetchValidatorStatus(current.id);
			fetchValidatorInfo(selected.terminal.id);
			fetchPrinterStatus(selected.terminal.id);
			if (selected.terminal?.dispenser?.is_exist) {
				fetchDispenserInfo(selected.terminal.id);
				fetchDispenserStatus(selected.terminal.id);
			}
		}
		ResetForceStatus();
	}

	handleCommandsChange = e => {
		const {
			selected,
			fetchValidatorCommand,
			fetchValidatorInfo
		} = this.props;
		if (e.target.value === Commands[0].value) return;

		if (selected.nodeType === 'terminal') {
			fetchValidatorCommand(selected.terminal.id, e.target.value);
			fetchPrinterStatus(selected.terminal.id);
			fetchValidatorInfo(selected.terminal.id);
		}
	};
	renderCassetteData = (cassetteData, classes) => (
		cassetteData.map((cassette, index) => (
			<>
				<Typography
					variant="h6"
					componnet="p"
					className={classes.bold}>
					&nbsp;Cassette {index + 1}
				</Typography>
				<ul className={classes.ul}>
					{Object.keys(cassette).map((item) => (
						<li>{item}: {cassette[item]}</li>
					))}
				</ul>
			</>
		))
	);
	testPrinterParams() {
		const { timezone } = this.props;
		const testHeader = (
			text = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\n' +
				'абвгдеёжзийклмнопрстуфхцчшщъыьэюя\n' +
				'АБВГҐДЕЄЖЗИШЇЙКЛМНОПРСТУФХЦЧШЬЮЯ\n' +
				'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя\n' +
				'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 -+=@#$%^&*()',
			align = 'center',
			border = '||',
			type = 'string'
		) => ({ align, border, text, type });
		const testLine = (text = '-', type = 'line') => ({ text, type });
		const testDateTime = (
			text = '',
			border = '||',
			align = 'left',
			bold = 'true',
			type = 'string'
		) => ({
			align,
			bold,
			text,
			type
		});

		const currentDate = tm().tz(timezone);

		return [
			testLine(),
			testHeader(),
			testLine(),
			// testDateTime(`Date: ${tm(currentDate).format('DD-MM-YYYY')}`),
			// testDateTime(`Time: ${tm(currentDate).format('HH:mm')}`),
			// testLine()
		];
	}
	handleForceEncashment = () => {
		const {fetchForceEncashment, selected} = this.props;
		fetchForceEncashment(selected.terminal.id);
	}
	render() {
		let {
			error,
			errorValidator,
			errorPrinter,
			errorTestDispenser,
			errorWidgets,
			validatorInfo,
			printerStatus,
			checkData,
			selected,
			classes,
			askForDispenseData,
			dispenseData,
			dispensePurgeData,
			dispenserTestData,
			dispenserInfoData,
			dispenserStatusData,
			loadings,
			loadingTerminals,
			forceEncashmentStatus,
		} = this.props;

		const {
			actionValidator,
			currency,
			amount,
			errorStatus
		} = this.state;

		const isTerminalConnected = selected.terminal.is_connected;

		loadings = loadings || loadingTerminals;

		let currencyError = errorStatus && !currency ? true : false;
		let amountError = errorStatus && !amount ? true : false;

		let cassettesDispenselist = null;
		let cassettesDispenserTestlist = null;
		let cassettesDispenserStatuslist = null;

		if (dispenseData && dispenseData.notes_for_dispense)
			cassettesDispenselist = this.renderCassetteData(dispenseData.notes_for_dispense, classes);
		if (dispenserTestData && dispenserTestData.cassette_info)
			cassettesDispenserTestlist = this.renderCassetteData(dispenserTestData.cassette_info, classes);
		if (dispenserStatusData && dispenserStatusData.cassette_info)
			cassettesDispenserStatuslist = this.renderCassetteData(dispenserStatusData.cassette_info, classes);

		return (
			<div className={classes.root}>
				<div className={classes.loading}>
					{loadings ? <LinearProgress/> : null}
				</div>

				<div className={classes}>
					<div className={classes.toolBar}>
						<Tooltip title="Update" aria-label="Update" onClick={this.updateButtonHandle}>
							<Button color="secondary">
								<Update/>
							</Button>
						</Tooltip>
					</div>
				</div>
				<div className={`${classes.wrap} ${classes.wrapTableForScroll}`}>
					{
						isTerminalConnected === false ? (
							<ErrorTerminal message={'Terminal is not connected'}/>
						) : (
							<>
								<Typography
									className={classes.caption}
									variant="h3"
									component="h2"
									color="textSecondary"
									gutterBottom>
									{`Terminal ${selected.terminal.id}`}
								</Typography>
								<>
									{ selected?.terminal?.validator?.is_exist ?
										<Card className={`${classes.card} ${classes.dispenserCards}`}>
												<CardContent>
													<Typography variant="h4" component="h2">
														Test validator
													</Typography>
													{this.state.preloaderTestValidation ?
														<div
															className={classes.loaderStyle_2}>
															<CircularProgress/>
														</div> :
														<>
															<Typography variant="h6" componnet="p">
																<span className={classes.bold}>Status :</span>
																<span className={classNames(classes.bold, {
																[classes.redColor]: validatorInfo.status === 'error',
																[classes.greenColor]: validatorInfo.status !== 'error'
															})}>{validatorInfo.status}</span>
															</Typography>
																{ validatorInfo.LastError &&
																<Typography variant="h6" componnet="p">
																	<span className={classes.bold}>Last error :</span>
																	{validatorInfo.LastError}
																</Typography>
																}
															<Typography variant="h6" componnet="p">
																<span className={classes.bold}>Model :</span>
																{validatorInfo.Model}
															</Typography>
															<Typography variant="h6" componnet="p">
																	<span className={classes.bold}>
																		Validator :
																	</span>
																{validatorInfo.Validator}
															</Typography>
															<Typography style={{display: 'flex'}} variant="h6" componnet="p">
																<span style={{display:'block',maxWidth:'300px'}} className={classes.bold}>Bills : </span>
																<span style={{display:'block',maxWidth:'250px'}}>
																	{validatorInfo?.Bills?.replace(/,/g, ', ')}
																</span>

															</Typography>

															<Select
																color="secondary"
																className={classes.bold}
																onChange={this.handleCommandsChange}
																value={actionValidator}>
																{_.map(Commands, item => (
																	<MenuItem value={item.value}>
																		<Typography variant="h6" componnet="p">
																			{item.text}
																		</Typography>
																	</MenuItem>
																))}
															</Select>
														</>
													}
												</CardContent>
												
													<CardContent style={{display: 'flex', alignItems: 'center'}}>
														<Button
															onClick={this.handleForceEncashment}
															variant="contained"
															color="secondary">
															<Typography 
																className={classes.whiteColor} 
																variant="h6" 
																componnet="p" 
																style={{width:'100px', fontSize: '15px', lineHeight: '17px'}}>
																Force encashment
															</Typography>
														</Button>
														{ forceEncashmentStatus !== null && 											
															<Typography 
																variant="h6" 
																componnet="p">
																{
																	forceEncashmentStatus 
																		? <span className={classNames(classes.bold, classes.greenColor)}>Success</span>
																		: <span className={classNames(classes.bold, classes.redColor)}>Error</span>
																}
															</Typography>
													}
													</CardContent> 
												
										</Card>
										: ''}

									{ selected?.terminal?.printer?.is_exist ?
										<Card className={`${classes.card} ${classes.dispenserCards}`}>
											<CardContent>
												<Typography variant="h4" component="h2">
													Test printer
												</Typography>
												{ 
													this.state.preloaderStatusPrinter
													? <div
														className={classes.loaderStyle_2}>
														<CircularProgress/>
													</div>
													: <>
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Status :</span>
															<span className={classNames(classes.bold, {
																[classes.redColor]: validatorInfo.status === 'error',
																[classes.greenColor]: validatorInfo.status !== 'error'
															})}>{printerStatus}</span>
															
														</Typography>
														<Typography variant="p" componnet="p">
															{checkData.message &&
															JSON.stringify(checkData.message)}
														</Typography>
													</>
												}
											</CardContent>
											<CardActions className={classes.cardPadding}>
												<Button
													onClick={this.handlePrintCheck}
													variant="contained"
													color="secondary">
													<Typography className={classes.whiteColor} variant="h6" componnet="p">
														Print test check
													</Typography>
												</Button>
											</CardActions>
										</Card>
								: ''}
								</>
								{ selected?.terminal?.dispenser?.is_exist ?
									<>
										<Card className={`${classes.card} ${classes.dispenserCards}`}>
											<CardContent>
												<Typography variant="h4" component="h2">
													Test Dispenser
												</Typography>
												{this.state.preloaderStatusDispenser ?
													<div
														className={classes.loaderStyle_2}>
														<CircularProgress/>
													</div> :
													<>
														<Typography 
															className={`${classes.bold}`} 
															variant="h6"
														    component="h2"
															color="secondary"
														>
															INFO:
														</Typography>
														{dispenserInfoData.description ?
															<Typography variant="h6" componnet="p">
																<span className={classes.bold}>Description:</span>
																{dispenserInfoData.description}
															</Typography>: ''
														}
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Status:</span>
															<span className={classNames(classes.bold, {
																[classes.redColor]: dispenserInfoData.status === 'error',
																[classes.greenColor]: dispenserInfoData.status !== 'error'
															})}>{dispenserInfoData.status}</span>
														</Typography>
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Checksum:</span>
															{dispenserInfoData.checksum}
														</Typography>
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Model:</span>
															{dispenserInfoData.model}
														</Typography>
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Rom version:</span>
															{dispenserInfoData.rom_version}
														</Typography>
													</>
												}
											</CardContent>

											<CardContent>
												{this.state.preloaderStatusDispenser ?
													<div
														className={classes.loaderStyle_2}>
														<CircularProgress/>
													</div> :
													<>
														<Typography className={`${classes.bold}`} variant="h6"
														            component="h2"
																				color="secondary">
															STATUS:
														</Typography>
														{dispenserStatusData.description ?
															<Typography variant="h6" componnet="p">
																<span className={classes.bold}>Description:</span>
																{dispenserStatusData.description}
															</Typography>: ''
														}
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Status:</span>
															<span className={classNames(classes.bold, {
																[classes.redColor]: dispenserStatusData.status === 'error',
																[classes.greenColor]: dispenserStatusData.status !== 'error'
															})}>{dispenserStatusData.status}</span>

														</Typography>
														<Typography variant="h6" componnet="p">
															<span className={classes.bold}>Message:</span>
															{dispenserStatusData.message}
														</Typography>
														{cassettesDispenserStatuslist ?
															<Typography variant="h6" componnet="p">
																<span className={classes.bold}>Cassette info:</span>
																{cassettesDispenserStatuslist}
															</Typography>: ''
														}
													</>
												}
											</CardContent>
											<div>
												<CardActions className={classes.cardPadding}>
													<Button
														onClick={this.handlePurgeButton}
														className={classes.btnStyle}
														variant="contained"
														color="secondary"
														disableElevation>
														Purge
													</Button>
												</CardActions>
												<CardActions className={classes.cardPadding}>
													<Button
														onClick={this.handleDispenserTestButton}
														className={classes.btnStyle}
														variant="contained"
														color="secondary"
														disableElevation>
														Dispenser Test
													</Button>
												</CardActions>
											</div>
											<CardContent>
												{this.state.preloaderPurge ?
													<div
														className={classes.loaderStyle}>
														<CircularProgress/>
													</div> :
													<Typography variant="h6" component="p">
														{
															Object.keys(dispensePurgeData).length ?
																<div>
																	<Typography
																		variant="h4"
																		className={classes.blueColor}>
																		PURGE
																	</Typography>
																	{dispensePurgeData.description ?
																		<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Description:</span>
																			{dispensePurgeData.description}
																		</Typography> : ''
																	}
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Message:</span>
																		{dispensePurgeData.message}
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Status:</span>
																		<span className={classNames(classes.bold, {
																			[classes.redColor]: dispensePurgeData.status === 'error',
																			[classes.greenColor]: dispensePurgeData.status !== 'error'
																		})}>
														{dispensePurgeData.status}

														</span>
																	</Typography>
																</div> : ''
														}
													</Typography>
												}
											</CardContent>
											<CardContent>
												{this.state.preloaderDispenserTest ?
													<div
														className={classes.loaderStyle}>
														<CircularProgress />
													</div> :
												<Typography variant="h6" component="p">
													{
														Object.keys(dispenserTestData).length ?
															<div>
																<Typography
																	variant="h4"
																	className={classes.blueColor}>
																	DISPENSER TEST
																</Typography>
																{dispenserTestData.description ?
																	<Typography variant="h6" component="p">
																		<span className={classes.bold}>Description:</span>
																		<span>
														{dispenserTestData.description}
														</span>
																	</Typography>: ''
																}
																{dispenserTestData.message ?
																<Typography variant="h6" component="p">
																	<span className={classes.bold}>Message:</span>
																	<span>
														{dispenserTestData.message}
														</span>
																</Typography>: ''
																}
																<Typography variant="h6" component="p">
																	<span className={classes.bold}>Status:</span>
																	<span className={classNames(classes.bold, {
																		[classes.redColor]: dispenserTestData.status === 'error',
																		[classes.greenColor]: dispenserTestData.status !== 'error'
																	})}>
														{dispenserTestData.status}
														</span>
																</Typography>
																{cassettesDispenserTestlist ?
																	<Typography variant="h6" component="p">
																		<span className={classes.bold}>Cassette info:</span>
																		{cassettesDispenserTestlist}
																	</Typography>: ''
																}
															</div> : ''
													}
												</Typography>
												}
											</CardContent>

										</Card>

										<Card className={`${classes.card} ${classes.dispenserCards}`}>
											<CardContent>
												<Typography variant="h4" component="h2">
													Dispensing Controls
												</Typography>
											</CardContent>
											<div>
												<CardActions>
													<FieldDispenserTestForm
														currencyError={currencyError}
														amountError={amountError}
														currencies={currencies}
														nominals={notesNominals}
														// formData={initialValues}
														handleCurrencyChange={this.handleCurrencyChange}
														handleAmountChange={this.handleAmountChange}
														handleButton={this.handleButton}
													/>
												</CardActions>
												<CardContent>
													{this.state.preloaderAskForDispense ?
														<div
															className={classes.loaderStyle}>
															<CircularProgress/>
														</div> :
														<Typography variant="h6" componnet="p">
															{
																Object.keys(askForDispenseData).length ? <div>
																	<Typography variant="h4" className={classes.blueColor}>ASK FOR
																		DISPENSE</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Can dispense:</span>
																		{askForDispenseData.can_dispense}
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Is able to dispense:</span>
																		<span className={classNames(classes.bold, {
																			[classes.redColor]: !askForDispenseData.is_able_to_dispense,
																			[classes.greenColor]: askForDispenseData.is_able_to_dispense
																		})}>{`${askForDispenseData.is_able_to_dispense}`}</span>
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
													Message: </span>
																		{askForDispenseData.message}
																	</Typography>
																</div> : ''
															}
														</Typography>
													}
												</CardContent>

												<CardContent>
													{this.state.preloaderDispense ?
														<div
															className={classes.loaderStyle}>
															<CircularProgress/>
														</div> :
														<Typography>
															{
																Object.keys(dispenseData).length ? <div>
																	<Typography className={classes.blueColor}
																	            variant="h4">DISPENSE</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Can dispense:</span>
																		{dispenseData.can_dispense}
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Is able to dispense:</span>
																		<span className={classNames(classes.bold, {
																			[classes.redColor]: dispenseData.status === 'error',
																			[classes.greenColor]: dispenseData.status !== 'error'
																		})}>{`${dispenseData.is_able_to_dispense}`}</span>
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Requested currency:</span>
																		<span>{dispenseData.requested_currency}</span>
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
														Dispensed amount:</span>
																		<span>{dispenseData.dispensed_amount}</span>
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
													Message: </span>
																		{dispenseData.message}
																	</Typography>
																	<Typography variant="h6" componnet="p">
																		{/*<span className={classes.bold}>*/}
																		{/*Notes for dispense: </span>*/}
																		<span className={classes.bold}>
													Cassette info: </span>
																		{cassettesDispenselist}
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
													Requested amount: </span>
																		{dispenseData.requested_amount}
																	</Typography>
																	<Typography variant="h6" componnet="p">
													<span className={classes.bold}>
													Status: </span>
																		<span className={classNames(classes.bold, {
																			[classes.redColor]: dispenseData.status === 'error',
																			[classes.greenColor]: dispenseData.status !== 'error'
																		})}>{dispenseData.status}</span>
																	</Typography>
																</div> : ''
															}
														</Typography>
													}
												</CardContent>
											</div>
										</Card>
									
									</>
									: ''}
							</>
						)
					}

				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	validatorInfo: state.testing.validatorInfo,
	printerStatus: state.testing.printerStatus,
	checkData: state.testing.checkData,
	errorWidgets: state.widgets.terminals.error,
	errorValidator: state.testing.errorValidator,
	errorPrinter: state.testing.errorPrinter,
	errorDispenser: state.testing.errorDispenser,
	selected: state.selected,
	loadings: state.testing.loading,
	loadingTerminals: state.widgets.terminals.loading,
	askForDispenseData: state.testing.askForDispenseData,
	dispenseData: state.testing.dispenseData,
	dispensePurgeData: state.testing.dispensePurgeData,
	dispenserTestData: state.testing.dispenserTestData,
	dispenserInfoData: state.testing.dispenserInfoData,
	dispenserStatusData: state.testing.dispenserStatusData,
	errorTestDispenser: state.testing.errorTestDispenser,
	forceEncashmentStatus: state.validator.forceCorrectStatus,
	timezone: state.timezone.currentTimeZone,
});
const mapDispatchToProps = {
	fetchPrinterCheck,
	fetchPrinterStatus,
	fetchValidatorCommand,
	fetchValidatorInfo,
	// fetchValidatorStatus,
	fetchAskForDispense,
	fetchDispense,
	fetchPurge,
	fetchDispenserTest,
	fetchDispenserInfo,
	fetchDispenserStatus,
	cleanTerminalTestData,
	fetchForceEncashment,
	ResetForceStatus
};
Testing = withStyles(styles)(Testing);

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles),
)(Testing);
