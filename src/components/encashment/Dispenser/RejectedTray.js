import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import RejectedTrayForm from '../../forms/dispenser-forms/RejectedTrayForm';
import { compose } from 'redux';

const SHADE = 50;
const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		display: 'flex',
		justifyContent: 'space-around'
	},
	table: {
		width: '700px',
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
	correct: {
		backgroundColor: green[SHADE]
	},
	unCorrect: {
		backgroundColor: red[SHADE]
    },
    formWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
		justifyContent: 'flex-start',
		// [theme.breakpoints.only('xs')]: {
		// 	padding: '16px'
		// }
    }
});

class RejectedTray extends Component {
	render() {
		const { 
			classes,
			data,
			initValues,
			handleSubmit,
			handleResetForm,
			updateInitValues
		} = this.props;
		
		return (
			<div>
				<Paper className={classes.root}>
					<React.Fragment>
						<div className={classes.formWrapper}>
							<div>
								<RejectedTrayForm
									billsData={data}
									formData={initValues}
									disabledDenomination={true}
									textSubmit="Next"
									onSubmit={handleSubmit}
									updateInitValues={updateInitValues}
									handleResetForm={handleResetForm}
								/>
							</div>
						</div>
					</React.Fragment>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

export default compose(
	withRouter,
	connect(mapStateToProps),
	withStyles(styles)
)(RejectedTray)
