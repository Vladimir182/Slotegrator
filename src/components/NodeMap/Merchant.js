import React, { Component, PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Controls from './Controls';
import Preloader from '../preloaders/Preloader'; 
import Room from './Room';
import {
	fetchMerchantRooms,
	fetchRoomTerminals
} from '../../ducks/merchants';

const styles = theme => {
	let ActiveShade = 200,
		SHADE = 300;

	if (theme.palette.type === 'dark') {
		SHADE = 400;
		ActiveShade = 200;
	}
	return {
		merchantsRow: {
			// width: '251pt',
			width: `calc(100%/8 - ${theme.spacing(2)}px)`,
			marginRight: theme.spacing(2),
			margin: 0,
			marginBottom: theme.spacing(2),
			color: '#fff',
			[theme.breakpoints.between('xs', 'sm')]: {
				margin: 0,
				marginBottom: theme.spacing(1)
			},

			[theme.breakpoints.down('2600')]: {
				width: `calc(100%/7 - ${theme.spacing(2)}px)`,
			},

			[theme.breakpoints.down('2300')]: {
				width: `calc(100%/6 - ${theme.spacing(2)}px)`,
			},

			[theme.breakpoints.down('1900')]: {
				width: `calc(100%/5 - ${theme.spacing(2)}px)`,
			},

			[theme.breakpoints.down('1660')]: {
				width: `calc(100%/4 - ${theme.spacing(2)}px)`,
			},

			[theme.breakpoints.down('1440')]: {
				width: `calc(100%/3 - ${theme.spacing(2)}px)`,
			},

			[theme.breakpoints.only('md')]: {
				width: 'calc(33% - 7pt)',
				boxSizing: 'border-box',
				'&:nth-child(3n)': {
					marginRight: 0
				},
			},
			[theme.breakpoints.only('sm')]: {
				width: 'calc(50% - 7pt)',
				marginRight: '10pt',
				boxSizing: 'border-box',
				'&:nth-child(2n)': {
					marginRight: 0
				},
			},
			[theme.breakpoints.down('xs')]: {
				width: '100%',
				marginRight: 0,
			}
		},
		heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightRegular
		},
		panel: {
			width: '100%',
			margin: 0,
			marginBottom: theme.spacing.unit,
			color: '#fff',
			[theme.breakpoints.between('xs', 'sm')]: {
				margin: 0,
				marginBottom: '10px'
			}
		},
		container: {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'wrap',
			width: '100%',
			marginBottom: 0
		},
		merchant: {
			// backgroundColor: lightBlue[SHADE]
			backgroundColor: theme.palette.primary.merchant,
			color: theme.palette.primary.contrastText
		},
		merchantActive: {
			// backgroundColor: lightBlue[SHADE + ActiveShade]
			backgroundColor: theme.palette.primary.merchantActive,
			color: theme.palette.primary.contrastText
		},

		titleBlock: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width:'100%',
			whiteSpace: 'nowrap' 
		},
		detailsPannel: {
			padding: 8
		},
		expansionPanelSummaryContent:{
			width: '100%',
			padding: '0 10px',
			minWidth: '50px'
		},
		noDataText: {
			padding: '18px',
			margin: 'auto',
			color: theme.palette.gray.main
		},
		moreButton: {
			display: 'flex',
			margin: '0 auto',
			marginTop: '10px'
		}
	};
};

class Merchant extends PureComponent {
	constructor(props) {
		super(props);
		
		const isCurrent = props.selected.nodeType === 'root' ? false : props.merchant.id === props.selected.merchant.id;
		
		this.state = {
			accordionState: isCurrent
		}
	}

	componentDidMount() {
		const { fetchMerchantRooms, id, merchantRequstedRooms } = this.props;
		const { accordionState } = this.state;

		const isRoomsLoaded = Object.keys(merchantRequstedRooms).indexOf(String(id)) !== -1;

		if (accordionState && !isRoomsLoaded)
			fetchMerchantRooms(id);
	}

	handleChangeExpanded() {
		const { fetchMerchantRooms, id, merchantRequstedRooms } = this.props;
		
		this.setState((prevState) => ({
			accordionState: !prevState.accordionState 
		}));
		const isRoomsLoaded = Object.keys(merchantRequstedRooms).indexOf(String(id)) !== -1;

		if (isRoomsLoaded || !fetchMerchantRooms) 
			return;

		fetchMerchantRooms(id);
	}

	handleMoreButtonClick() {
		const { fetchMerchantRooms, id, rooms } = this.props;
		const offset = rooms.length;

		fetchMerchantRooms(id, offset);
	}

	render() {
		const {
			selected,
			merchant,
			rooms,
			terminals,
			classes,
			handlerEdit,
			handlerCreate,
			handlerRemove,
			handlerReset,
			config,
			id,
			merchantIdRequstingRooms,
			accesses,
			fetchRoomTerminals,
			merchantRequstedRooms
		} = this.props;

		const { accordionState } = this.state;

		const isCurrent = selected.nodeType === 'root' ? false : merchant.id === selected.merchant.id;
		const roomsCount = merchantRequstedRooms[merchant.id]?.count;

		return (
			<div 
				id={`merchant${id}`}
				className={classes.merchantsRow}
			>
				<Accordion
					expanded={accordionState}
					onChange={() => this.handleChangeExpanded(id)}
					className={isCurrent ? classes.merchantActive : classes.merchant}
				>
					<AccordionSummary 
						expandIcon={<ExpandMoreIcon />} 
						classes={{
							content: classes.expansionPanelSummaryContent
						}}
					>
						<div className={classes.titleBlock}>
							<Box className={classes.heading} textOverflow="ellipsis" overflow="hidden" >
								{merchant.title}
							</Box>
						</div>
					</AccordionSummary>
					<Controls
						item={merchant}
						handlerEdit={handlerEdit}
						handlerCreate={handlerCreate}
						handlerRemove={handlerRemove}
						config={config}
					/>
					<AccordionDetails classes={{ root: classes.detailsPannel }}>
						{ merchantIdRequstingRooms === merchant.id 
							? (<Box m={'15.5px auto'} color="mint.main"><Preloader color="mint" size={25} /></Box>)
							: rooms.length && accordionState ? <div className={classes.container}>
								{ rooms.map(room => {
									const roomTerminals = terminals.filter(terminal => room.id === terminal.room_id);

									return <Room 
										id={room.id}
										key={`room_node_${room.id}`}
										terminals={roomTerminals}
										room={room}
										handlerEdit={handlerEdit}
										handlerCreate={handlerCreate}
										handlerRemove={handlerRemove}
										handlerReset={handlerReset}
										fetchRoomTerminals={fetchRoomTerminals}
										accesses={accesses}
										config={{
											edit: accesses.rooms.allow_update,
											create: accesses.terminals.allow_create,
											current: true,
											// trash: accesses.terminals.allow_delete
											trash: accesses.rooms.allow_delete
										}}
									/>
								}) }
								{ (rooms && rooms.length < roomsCount) && <Button
									onClick={this.handleMoreButtonClick.bind(this)} 
									size="small" 
									className={classes.moreButton}
									>
										Show more...
									</Button>
								}
							</div>
							: <div className={classes.noDataText}>No data</div>
						}
					</AccordionDetails>
				</Accordion>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
	merchantRequstedRooms: state.merchants.merchantRequstedRooms
});

const mapDispatchToProps = {
	fetchMerchantRooms,
	fetchRoomTerminals
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(Merchant);
