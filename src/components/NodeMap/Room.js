import React, { Component } from 'react';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Controls from './Controls';
import cyan from '@material-ui/core/colors/cyan';
import { Box, Button } from '@material-ui/core';
import { rRender } from '../../utils/helper';
import Preloader from '../preloaders/Preloader';
import Terminal from './Terminal';
import {
	fetchRoomTerminals
} from '../../ducks/merchants';

const styles = theme => {
	let ActiveShade = 100,
		SHADE = 100;
	if (theme.palette.type === 'dark') {
		SHADE = 400;
		ActiveShade = 200;
	}

	return {
		root: {
			width: '250pt',
			margin: 0,
			marginRight: '10pt',
			marginBottom: theme.spacing.unit,
			// color: '#fff',
			[theme.breakpoints.between('xs', 'sm')]: {
				margin: 0,
				marginBottom: '10px'
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
		container: {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'wrap',
			width: '100%'
		},
		panel: {
			margin: 0,
			width: '100%',
			marginBottom: theme.spacing.unit,
		},
		nodes: { width: '100%' },
		room: {
			// backgroundColor: cyan[SHADE]
			backgroundColor: theme.palette.primary.room,
			color: theme.palette.secondary.contrastText
		},
		roomActive: {
			// backgroundColor: cyan[SHADE + ActiveShade]
			backgroundColor: theme.palette.primary.roomActive,
			color: theme.palette.secondary.contrastText
		},
		titleBlock: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width:'100%',
			whiteSpace: "nowrap" 
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
			color: theme.palette.primary.contrastText
		},
		moreButton: {
			display: 'flex',
			margin: '0 auto',
			marginTop: '10px'
		}
	};
};

class Room extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			accordionState: this.checkIsCurrentRoom(props.room, props.selected)
		}
	}
	
	componentDidMount() {
		const { fetchRoomTerminals, id, roomRequestedTerminals } = this.props;
		const { accordionState } = this.state;

		const isTerminalsLoaded = Object.keys(roomRequestedTerminals).indexOf(String(id)) !== -1;

		if (accordionState && !isTerminalsLoaded) {
			fetchRoomTerminals(id);
		}
	}

	handleChangeExpanded = () => {
		const { 
			fetchRoomTerminals,
			roomRequestedTerminals,
			id, 
			accesses
		} = this.props;

		const isTerminalsLoaded = Object.keys(roomRequestedTerminals).indexOf(String(id)) !== -1;
		
		this.setState((prevState) => ({
			accordionState: !prevState.accordionState 
		}));

		if (isTerminalsLoaded || !fetchRoomTerminals || !accesses.terminals.allow_view)
			return;

		fetchRoomTerminals(id);
	}

	checkIsCurrentRoom = (room, selected) => {
		if (selected.nodeType === 'root' || selected.nodeType === 'merchant') {
			return false;
		}

		return selected.room.id === room.id;
	}

	handleMoreButtonClick() {
		const { fetchRoomTerminals, id, terminals } = this.props;
		const offset = terminals.length;

		fetchRoomTerminals(id, offset);
	}
	
	render() {
		const {
			selected,
			room,
			terminals,
			classes,
			accesses,
			handlerEdit,
			handlerCreate,
			handlerRemove,
			handlerReset,
			config,
			id,  
			roomIdRequestingTerminals,
			roomRequestedTerminals,
			isRoot
		} = this.props;
		
		const { accordionState } = this.state;
		const isCurrent = this.checkIsCurrentRoom(room, selected);
		const terminalsCount = roomRequestedTerminals[room.id]?.count;

		return (
			<div id={`room${id}`} className={classNames({
				[classes.panel]: !isRoot,
				[classes.root]: isRoot 
			})}>
				<Accordion
					expanded={accordionState}
					onChange={() => this.handleChangeExpanded()}
					className={classNames(classes.room, {
						[classes.roomActive]: isCurrent,
						[classes.room]: !isCurrent,
					})}>
					<AccordionSummary 
						expandIcon={<ExpandMoreIcon />}
						// onClick={setExtended}
						classes={{
							content: classes.expansionPanelSummaryContent
						}}
					>
						<div className={classes.titleBlock}>
							<Box className={classes.heading} textOverflow="ellipsis" overflow="hidden" >
								{room.title}
							</Box>
						</div>
					</AccordionSummary>
					<Controls
						item={room}
						handlerEdit={handlerEdit}
						handlerCreate={handlerCreate}
						handlerRemove={handlerRemove}
						config={config}
					/>
					<AccordionDetails
						classes={{ root: classes.detailsPannel }}
						className={classes.container}
					>
						{ roomIdRequestingTerminals === room.id
							? (<Box m={'15.5px auto'} color="mint.main"><Preloader color="primary" size={25} /></Box>)
							: terminals.length && accordionState ? <div className={classes.container}>
								{ terminals.map(terminal => {
									return <Terminal
										id={terminal.id}
										key={`terminal_node_${
											terminal.id
										}`}
										handlerRemove={handlerRemove}
										handlerReset={handlerReset}
										config={{
											edit: false,
											create: false,
											current: true,
											trash: accesses.terminals.allow_delete,
											reset: accesses.terminals.allow_view && accesses.terminals.allow_update,
										}}
										terminal={terminal}
									/>
								})}
								{ (terminals && terminals.length < terminalsCount) && <Button
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
	roomIdRequestingTerminals: state.merchants.roomIdRequestingTerminals,
	roomRequestedTerminals: state.merchants.roomRequestedTerminals
})

const mapDispatchToProps = {
	fetchRoomTerminals
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(Room);

