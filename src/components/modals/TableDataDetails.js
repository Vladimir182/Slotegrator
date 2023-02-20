import React from 'react';
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
import tm from 'moment-timezone';
import _ from 'lodash';
import config from '../Menu/config';
import { compose } from 'redux';

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

			fontWeight: 700,
			color: theme.modalWindow.title.color,
			opacity: '.8'
		},
		subtitle: {
            ...theme.typography.button,
			display: 'flex',
            alignItems: 'center',
		},
		icon: {
			marginLeft: '5px'
		},

		block: {
			marginBottom: '10px'
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
			justifyContent: 'space-around',
			[theme.breakpoints.down('xs')]: {
				flexDirection: 'column'
			}
		},
		listItem: {
			textAlign: 'center',
			[theme.breakpoints.down('xs')]: {
				flexDirection: 'left'
			}
		},
		listItemText: {
			display: 'inline-flex',
			flexDirection: 'column',
			paddingLeft: 'initial',
			"& span": {
				color: ItemTextSpanColor + '!important',
				paddingBottom: theme.spacing(1)
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
		}
	};
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class DepositDetails extends React.Component {
	
	getDialogContentList(data, config, rowSize, selectedTimeZone) {
		const { width, classes } = this.props;
		const { listConfig } = config;
		const isMobile = width === 'xs';
		
		return (
			<div  className={classes.wrapp}>
			{
				!isMobile ? _.chunk(listConfig, rowSize).map((d, i) => (
					<List className={classes.list} dense={true} component={'div'}>
						{Array.apply(null, Array(rowSize)).map((p, j) => {	
							const configItem = listConfig[(i * rowSize) + j];
							if(configItem) {
								const listItem = this.getListItem(configItem, data, selectedTimeZone);
					
								return listItem;
							} else {
								return this.getEmptyListItem();
							}
						})}
					</List>
				)) 
				: <List className={classes.list} dense={true} component={'div'}>
					{ listConfig.map(item => {
						const listItem = this.getListItem(item, data, selectedTimeZone);

						return listItem;
					})}
				</List>
			}
			{ 
				config.allowDescription  && 
				<div className={classes.description}>
					<Typography variant="subtitle1">Description:</Typography>
					<Typography 
						variant="body2" 
						className={classes.descriptionText}
					>
						{data.description ? data.description : '----'}
					</Typography>
				</div>
			}
			</div>
		)
	}

	getListItem(configItem, data, selectedTimeZone) {
		const { classes } = this.props;
		const listItemTextPrimaryStyles = {
			color: 'rgba(0, 0, 0, 0.54)',
			textTransform: 'uppercase'
		};
		const listItemTextSecondaryStyles = {
			color: '#000',
			whiteSpace: 'pre-wrap'
		};

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

		return(
			<ListItem className={classes.listItem} divider={true} disableGutters={true}>
				<ListItemText 
					primaryTypographyProps={{ style: listItemTextPrimaryStyles }} 
					secondaryTypographyProps={{ style: listItemTextSecondaryStyles }}
					className={classes.listItemText} 
					primary={configItem.label} 
					secondary={String(dataItem)}
				/>
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
			<ListItem className={classes.listItem} divider={true} disableGutters={true}>
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
					<DialogTitle id="alert-dialog-slide-title">
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

export default compose(
	withWidth(),
	withStyles(styles)
)(DepositDetails);
