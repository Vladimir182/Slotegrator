import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import { compose } from 'redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import teal from '@material-ui/core/colors/teal';
import Controls from './Controls';

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
			marginBottom: theme.spacing.unit + 'px',
			// color: '#fff',
			[theme.breakpoints.between('xs', 'sm')]: {
				margin: 0,
				// marginBottom: '10px'
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
			marginBottom: theme.spacing.unit + "px",
		},
		nodes: { width: '100%' },
		terminal: {
			// backgroundColor: teal[SHADE]
			backgroundColor: theme.palette.primary.terminal,
			color: theme.palette.primary.contrastText
		},
		terminalActive: {
			// backgroundColor: teal[SHADE + ActiveShade]
			backgroundColor: theme.palette.primary.terminalActive,
			color: theme.palette.primary.contrastText
		},
		detailsPannel: {
			padding: 8
		}
	};
};

class Terminal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			accordionState: this.checkIsCurrentTerminal(props.terminal, props.selected),
		}
	}

	checkIsCurrentTerminal = (terminal, selected) => {
		if (selected.nodeType !== 'terminal') {
			return false;
		}

		return selected.terminal.id === terminal.id;
	}

	handleChangeExpanded = () => {
		this.setState((prevState) => ({
			accordionState: !prevState.accordionState 
		}));
	}

	render() {
		const {
			selected,
			terminal,
			classes,
			handlerRemove,
			handlerReset,
			isRoot,
			id,
			config,
		} = this.props;

		const { accordionState } = this.state;
		const isCurrent = this.checkIsCurrentTerminal(terminal, selected);

		return (
			<div id={`terminal${id}`} className={classNames({
				[classes.panel]: !isRoot,
				[classes.root]: isRoot 
			})}>
				<Accordion
					expanded={accordionState}
					onChange={this.handleChangeExpanded}
					className={classNames({
						[classes.terminalActive]: isCurrent,
						[classes.terminal]: !isCurrent,
					})}
				>
					<AccordionSummary>
						<Typography className={classes.heading}>{`Terminal ${
							terminal.id
						}`}</Typography>
					</AccordionSummary>
					<AccordionDetails classes={{ root: classes.detailsPannel }}>
						<Controls
							item={terminal}
							handlerRemove={handlerRemove}
							handlerReset={handlerReset}
							config={config}
						/>
					</AccordionDetails>
				</Accordion>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selected: state.selected,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps)
)(Terminal);