import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	clear: {	
		clear: 'both'
	}
});

function ModalWithdrawVerified({
	open,
	handlerClose,
	handlerDone,
	onChange,
	value,
	id,
	classes
}) {
	return (
		<div>
			<Dialog
				className={classes.clear}
				open={open}
				onClose={handlerClose}
				aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">
					Verified withdraw
				</DialogTitle>
				<DialogContent>
					<DialogContentText>Enter withdraw id</DialogContentText>
					<TextField
						onChange={onChange}
						value={value}
						placeholder="ID"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handlerClose} color="primary">
						Cancel
					</Button>
					<Button
						disabled={value != id}
						onClick={handlerDone}
						type="submit"
						variant="contained"
						color="primary"
						size="medium">
						Verified
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
export default withStyles(styles)(ModalWithdrawVerified);
