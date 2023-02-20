import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';

const styles = {
	root: {
		width: '238px',
		maxWidth: '239px',
		justifyContent: 'flex-start',
		fontWeight: '600'
	},
	heading: {
		fontWeight: '600',
		background: 'transparent',
		borderRadius: '0px',
		width: '100%'

	},
	button: {
		width: '100%',
		fontWeight: '600'
	},
	text: {
		textAlign: 'left'
	},
	styleDropDown:{
		height: '48px'
	},
};

class DropdownApi extends Component {

	render() {

		const {classes, target, text, children} = this.props;

		// children.forEach(item => {
		// 	item.margin;
		// });

		return (
			<div >
				<ExpansionPanel className={classes.heading}>
					<ExpansionPanelSummary
						className={classes.styleDropDown}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Button
							size="large"
							classes={{ root: classes.root }}>{text}</Button>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<div>{children}</div>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</div>
		);
	}
}

export default withStyles(styles)(DropdownApi);