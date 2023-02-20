import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { setIsEncashmentDispenserDone } from '../ducks/dispenser';
import { WithdrawChart, DepositChart, Terminals } from '../components/Dashboard';
import { rRender } from '../utils/helper';
import { compose } from 'redux';

const styles = theme => ({
	chart: {
		width: '500px',
		height: '500px'
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around'
	},
	chartWrapper: {
		display: 'flex',
		columnGap: theme.spacing(3),
		width: '100%',
		[theme.breakpoints.between('xs','sm')]: {
			flexDirection: 'column',
		},
	},
	chartPaper: {
		flex: '1',
		padding: '20px 70px',
		width: '49%',
		height: 'auto',
		[theme.breakpoints.down('md')]: {
			padding: '10px 25px'
		},
		[theme.breakpoints.between('xs','sm')]: {
			width: '100%',
			marginBottom: theme.spacing(),
			padding: '20px 20px',
			'&:last-child': {
				marginBottom: '0'
			}
		},
	}
});
class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentZone: null
		};
	}
	componentDidMount() {
		const { setIsEncashmentDispenserDone } = this.props;

		setIsEncashmentDispenserDone(false);
	}
	render() {
		const { classes, user } = this.props;
		return (
			<div >
				<div className={classes.chartWrapper}>
				{rRender(user.resources, 'deposits', 'allow_view') && (
					<Paper className={classes.chartPaper}>	
						<DepositChart />
					</Paper>
				)}
				{rRender(user.resources, 'withdraws', 'allow_view') && (
					<Paper className={classes.chartPaper}>
						<WithdrawChart />
					</Paper>
				)}
				</div>
					{rRender(user.resources, 'terminals', 'allow_view') && (
						<Terminals />
					)}
			</div>
		);
	}
}
const mapStateToProps = state => ({
	user: state.authorization.userData.user
});

const mapDispatchToProps = {
	setIsEncashmentDispenserDone
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Dashboard);
