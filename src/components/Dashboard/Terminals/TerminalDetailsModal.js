import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { statusTerminal } from '../../../utils/helper';
import tm from 'moment-timezone';
import StatusLabel from '../../../core/StatusLabel';
import { fetchDeviceFix } from '../../../ducks/widgets';
import { compose } from 'redux';
import { red } from '@material-ui/core/colors';

const styles = theme => {
	const ItemTextSpanColor = theme.palette.type === 'light' 
		? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.54)';
	
		const ItemTextParagraphColor = theme.palette.type === 'light' 
		? 'rgba(0, 0, 0)' : 'rgba(255, 255, 255)';
	
		const closeButtonHoverBackgroundColor = theme.palette.type === 'light'
		? 'rgba(63, 81, 181, 0.08)' : 'rgba(255, 255, 255, 0.08);';
	
		const closeButtonTextColor = theme.palette.type === 'light'
		? '#3f51b5' : '#ffffff';

	return {
		root: {
			[theme.breakpoints.only('xs')]: {
				width: '90%'
			}
		},
		alert: {
			[theme.breakpoints.up('xs')]: {
				width: '600px'
			},
			[theme.breakpoints.down('xs')]: {
				width: '100%'
			}
		},
		wrapp: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'start'
		},
		title: {
			marginBottom: '5px',
			display: 'flex',
            alignItems: 'center',
			textTransform: 'uppercase',
			color: ItemTextSpanColor,
			// fontWeight: 900,
			fontWeight: 700,
			color: theme.modalWindow.title.color,
			opacity: '.8'
		},
		subtitle: {
            ...theme.typography.button,
			display: 'flex',
            alignItems: 'center',
		},
		dialogTitle: {
			padding: '16px 24px 0 24px'
		},
		icon: {
			marginLeft: '5px'
		},

		block: {
			marginBottom: '10px'
		},
		section: { 
			marginTop: '20px', 
			width: '100%',
			textTransform: 'uppercase'
		},
		sectionTitle: {
			display: 'block',
			// fontWeight: 900,
			fontWeight: 700,
			marginBottom: '5px',
			color: theme.modalWindow.title.color,
			opacity: '.8'
		},
		sectionError: {
			padding: '3px 10px',
			width: '100%',
			borderRadius: '5px',
			textTransform: 'none',
			backgroundColor: theme.palette.error.main,
			color: theme.palette.error.contrastText,
			fontWeight: 500,
			border: '2px solid rgba(0, 0, 0, 0.12)',
			boxShadow: '-1px 1px 1px rgba(0, 0, 0, 0.32)',
			cursor: 'pointer',
			fontSize: '13px',
			'&:active': {
				boxShadow: '0px 0px 0px rgba(0.22, 0, 0, 0)',
			},
			'&:hover': {
				backgroundColor: theme.palette.error.dark,
			},
		},
		sectionErrorSubtitle: { 
			fontWeight: 600, 
			fontSize: '14px' 
		},
		errorText: {
			color: '#f44336'
		},
		fixingItButton: {
			marginLeft: '10px'
        },
        list: {
            width: '100%',
			display: 'flex',
			padding: 0,
			justifyContent: 'space-around',
			[theme.breakpoints.down('xs')]: {
				flexDirection: 'column'
			},
			borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
			marginBottom: '10px'
		},
		listItem: {
			display: 'flex',
			justifyContent: 'center',
			textAlign: 'center',
			height: 'fit-content',
			[theme.breakpoints.down('xs')]: {
				justifyContent: 'flex-start',
				'&>div': {
					display: 'flex',
					alignItems: 'center'
				}
			}
		},
		listItemTitle: {
			margin: 0,
			marginBottom: '5px',
			fontSize: '14px',
			textTransform: 'uppercase',
			[theme.breakpoints.down('xs')]: {
				margin: 0,
				marginRight: '10px',
				'&::after': {
					content: ":"
				},
			}
		},
		listItemTextValue: {
			margin: 0,
		},
		listItemText: {
			display: 'inline-flex',
			flexDirection: 'column',
			paddingLeft: 'initial',
			"& span": {
				color: ItemTextSpanColor + '!important'
			},
			"& p": {
				color: ItemTextParagraphColor + '!important'
			},
			[theme.breakpoints.down('xs')]: {
				flexDirection: 'row',
				'& span': {
					marginRight: '5pt',
					textAlign: 'left'
				}
			}
		},
		closeButton: {
			color: closeButtonTextColor,
			border: `2px solid ${theme.palette.button.color}`,
			"&:hover": {
				backgroundColor: closeButtonHoverBackgroundColor
			}
		},
		description: {
			marginTop: '10pt'
		},
		descriptionText: {
			textIndent: '10pt'
		},

		buttonPoverTerminal: {
			color: 'rgba(118, 114, 251, 1)',
			border: '2px solid rgba(118, 114, 251, 1)',
			padding: '12px',
			minWidth: '52px',
			borderRadius: '50%',
		}
	};
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class DepositDetails extends React.Component {

	handleSectionErrorClick(data, errorTarget) {
		const { handleClose, fetchDeviceFix } = this.props;

		fetchDeviceFix(data.id, errorTarget);
		handleClose();
	}
	
	getDialogContentList(data, config, rowSize, selectedTimeZone) {
		const { width, classes } = this.props;
		const { listConfig } = config;
		const isMobile = width === 'xs';

		const sectionsList = listConfig
			.map(configItem => configItem.section)
			.filter((configItem, index, array) => array.indexOf(configItem) === index);

		return (
			<div className={classes.wrapp}>
				{ 
					sectionsList.map(section => {
						const sectionListConfig = listConfig.filter(configItem => configItem.section === section);
						const sectionLowercase = section?.toLowerCase();

						return (
							<div className={classes.section}>
								<span className={classes.sectionTitle}>{section}</span>
								{
									!isMobile 
									? (
										<>
											{
												_.chunk(sectionListConfig, rowSize).map((d, i) => (
													<List className={classes.list} dense={true} component={'div'}>
														{Array.apply(null, Array(rowSize)).map((p, j) => {	
															const configItem = sectionListConfig[(i * rowSize) + j];
															if(configItem) {
																const listItem = this.getListItem(configItem, data, selectedTimeZone);
													
																return listItem;
															} else {
																return this.getEmptyListItem();
															}
														})}
													</List>
												))
											}
										</>	
									)
									: <List className={classes.list} dense={true} component={'div'}>
										{ sectionListConfig.map(item => {
											const listItem = this.getListItem(item, data, selectedTimeZone);
				   
											return listItem;
										})}
									</List>
								}
								{ (sectionLowercase && data[sectionLowercase]?.is_no_error === false) && 
									<div 
										title={"Click to set error as fixed"} 
										className={classes.sectionError} 
										onClick={() => this.handleSectionErrorClick(data, sectionLowercase)}
									>
										<span className={classes.sectionErrorSubtitle}>Click to set {sectionLowercase} error as fixed: </span>
										{data[sectionLowercase]?.error}
									</div> 
								}	
							</div>
						)}
					)
				}
			</div>
		)
	}

	getListItem(configItem, data, selectedTimeZone) {
		const { classes, handlePowerTerminal } = this.props;
		const maxRowLength = 20;
		let brakedValue = data[configItem.prop];

		if (String(brakedValue) === 'undefined') {
			return;
		}

		if (!configItem.isDate && brakedValue && brakedValue.length > maxRowLength) {
			new Array(Math.ceil(brakedValue.length / maxRowLength)).fill(undefined).map((item, index) => {
				if (index > 0)
					brakedValue = brakedValue.slice(0, ((index) * maxRowLength)) + "\n" + brakedValue.slice(((index) * maxRowLength), brakedValue.length);
			})
		}

		let dataItem = configItem.value ? configItem.value
		: configItem.isDate && !tm(data[configItem.prop]).isValid() ? '----'
		: configItem.isDate ? tm(data[configItem.prop]).tz(selectedTimeZone).format('YYYY-MM-DD hh:mm:ss.SSS').replace(' ', '\n')
		: (configItem.isObj && data[configItem.prop] && data[configItem.prop][configItem.objProp] !== 'undefined') ? data[configItem.prop][configItem.objProp] 
		: !configItem.isObj && data[configItem.prop].length > maxRowLength ? brakedValue
		: data[configItem.prop];
	
		dataItem = dataItem === null ? 'No data' : dataItem;
		
		const statusLabelData = configItem.prop !== -1 
		? statusTerminal({ stageData: dataItem }, configItem.stage ?? 1) 
		: '';
		
		return(
			<ListItem className={classes.listItem} disableGutters={true}>
				<div>
					<p className={classes.listItemTitle}>{configItem.label}</p>
					{
						configItem.isButton ? <Button
							className={classes.buttonPoverTerminal}
							onClick={e => {
								e.stopPropagation();
								handlePowerTerminal(data);
							}}>
							<StatusLabel
								status={statusLabelData}
							/>
						</Button>
						: configItem.isIcon ? <StatusLabel status={statusLabelData} />
						: <p className={classes.listItemTextValue}>{String(dataItem)}</p>
					}
				</div>
				
			</ListItem>
		)	
	}

	getEmptyListItem() {
		const { classes } = this.props;
		const listItemTextPrimaryStyles = {
			color: 'rgba(0, 0, 0, 0.54)',
			textTransform: 'uppercase'
		};
		const listItemTextSecondaryStyles = {
			color: '#000',
			whiteSpace: 'pre-wrap'
		};
		
		return(
			<ListItem className={classes.listItem} disableGutters={true}>
				<ListItemText 
					primaryTypographyProps={{ style: listItemTextPrimaryStyles }} 
					secondaryTypographyProps={{ style: listItemTextSecondaryStyles }}
					className={classes.listItemText} 
					primary={''} 
					secondary={''}
				/>
			</ListItem>
		)	
	}
	
	render() {
		const { handleClose, data, config, classes, width, selectedTimeZone } = this.props;
		const isMobile = width === 'xs';
		const dialogPaperStyles = {
			margin: isMobile ? '20pt' : 0
		};
		const dialogContent = this.getDialogContentList(data, config, 3, selectedTimeZone);

		return (
			<div>
				<Dialog
					open={true}
					fullWidth={isMobile}
					maxWidth={isMobile ? 'lg' : 'sm'}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleClose}
					PaperProps={{ style: dialogPaperStyles }}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle id="alert-dialog-slide-title" className={classes.dialogTitle}>
						<Typography variant="h5" component="p" className={classes.title}>
							{config.title}
						</Typography>
					</DialogTitle>
					<DialogContent className={classes.alert}>
						<DialogContentText id="alert-dialog-slide-description">
							{ dialogContent }
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary" className={classes.closeButton}>
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

DepositDetails.defaultProps = {
	config: {
		title: 'Default',
		allowDescription: 'Description example',
		listConfig: [{ prop: 'example_prop', label: 'example', isDate: false }]  // is_date is not required
	},
	data: { example_prop: 'example value' },
	handleClose: () => {},
	classes: {}
};

const mapDispatchToProps = {
	fetchDeviceFix
}
export default compose (
	connect(null, mapDispatchToProps),
	withWidth(),
	withStyles(styles)
)(DepositDetails)
