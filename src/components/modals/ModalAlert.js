import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	clear: {	
		clear: 'both',
		'& .MuiDialog-paper': {
			width: '100%'
		}
	},
	// buttonStyles: {
	// 	color: theme.palette.active.main
	// }
});

class AlertDialog extends Component {
	render() {
		const { text, title, answer, classes } = this.props;
		return (
			<div>
				<Dialog
					className={classes.clear}
					open={true}
					onClose={() => answer(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{text}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => answer(false)}
							color="secondary"
							// className={classes.buttonStyles}
						>
							Disagree
						</Button>
						<Button 
							onClick={() => answer(true)}
							color="secondary"
							// className={classes.buttonStyles}
						>
							Agree
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default withStyles(styles)(AlertDialog);
