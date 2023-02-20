import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import TakenBillsForm from '../../forms/dispenser-forms/TakenBillsForm';
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
    }
});
class TakenBills extends Component {
	render() {
    const { 
			classes,
			handleSubmit,
			data,
			initValues,
			handleResetForm,
			setTakenBillsFormValid,
			updateInitValues,
		} = this.props;

		return (
			<div>
				<Paper className={classes.root}>
					<React.Fragment>
						<div className={classes.formWrapper}>
							<div>
								<TakenBillsForm
									disabledDenomination={true}
									formData={initValues}
									handleResetForm={handleResetForm}
									setTakenBillsFormValid={setTakenBillsFormValid}
									updateInitValues={updateInitValues}
									billsData={data}
									textSubmit="Next"
									onSubmit={handleSubmit}
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
)(TakenBills)
