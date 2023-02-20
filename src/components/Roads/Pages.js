import React, { Component } from 'react';
import Dashboard from '../../pages/Dashboard';
import Deposit from '../../pages/Deposit';
import Withdraw from '../../pages/Withdraw';
import Reports from '../../pages/Reports';
import Terminal from '../../pages/Terminal';
import Terminals from '../../pages/Terminals';
import Drivers from '../../pages/Drivers';
import EncashmentValidator from '../../pages/encashment/Validator';
import EncashmentDispenser from '../../pages/encashment/Dispenser';
import Roles from '../../pages/Roles';
import Logs from '../../pages/Logs';
import EncashmentHistoryDispenser from '../../pages/encashment-history/Dispenser';
import EncashmentHistoryValidator from '../../pages/encashment-history/Validator';
import NodeManagment from '../../pages/NodeManagement';
import Users from '../../pages/Users';
import Page from './Page';
import PrivateRoute from '../private-routes/PrivateRoute';
import WithTerminalProtectedRoute from '../private-routes/WithTerminalProtectedRoute';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { rRender } from '../../utils/helper';
import { compose } from 'redux';

const styles = theme => {
	// const marginTop = theme.spacing.unit * 3; //Old content top margin
	const marginTop = theme.spacing.unit * 2;
	const selected = sessionStorage.getItem('selected') ? JSON.parse(sessionStorage.getItem('selected')) : null;
	
	return {
		root: {
			marginTop: marginTop,
			[theme.breakpoints.down('xs','sm')]: {
				marginTop: selected && (selected.nodeType === 'terminal' || selected.nodeType === 'rooms') 
					? marginTop * 2 
					: marginTop
			}
		}
	}
};

class Pages extends Component {
	render() {
		const { classes, resources, user } = this.props;
		return (
			<div className={classes.root}>
				<Switch>
					<PrivateRoute
						exact={true}
						path="/"
						component={() => (
							<Page
								caption="Dashboard"
								component={<Dashboard />}
							/>
						)}
					/>
					{rRender(resources, 'deposits', 'allow_view') && (
						<PrivateRoute
							exact={true}
							path="/deposit"
							component={() => (
								<Page
									caption="Deposit"
									component={<Deposit />}
								/>
							)}
						/>
					)}
					{rRender(resources, 'reports', 'allow_view') && (
						<PrivateRoute
							exact={true}
							path="/reports"
							component={() => (
								<Page
									caption="Reports"
									component={<Reports />}
								/>
							)}
						/>
					)}

					{rRender(resources, 'withdraws', 'allow_view') && (
						<PrivateRoute
							exact={true}
							path="/withdraw"
							component={() => (
								<Page
									caption="Withdraw"
									component={<Withdraw />}
								/>
							)}
						/>
					)}
					{rRender(resources, 'users', 'allow_view') && (
						<PrivateRoute
							exact={true}
							path="/users"
							component={() => (
								<Page caption="Users" component={<Users />} />
							)}
						/>
					)}

					{rRender(resources, 'terminals', 'allow_update') && (
						<WithTerminalProtectedRoute
							exact={true}
							path="/terminal"
							component={() => (
								<Page
									caption="Terminal"
									component={<Terminal />}
								/>
							)}
						/>
					)}
					{rRender(resources, 'driver_versions', 'allow_view') && (
						<WithTerminalProtectedRoute
							exact={true}
							path="/drivers"
							component={() => (
								<Page
									caption="Drivers"
									component={<Drivers />}
								/>
							)}
						/>
					)}
					{(rRender(resources, 'merchants', 'allow_view') ||
						rRender(resources, 'rooms', 'allow_view') ||
						rRender(resources, 'terminals', 'allow_view')) && (
							<PrivateRoute
								exact={true}
								path="/nodes"
								component={() => (
									<Page
										caption="NodeManagement"
										component={<NodeManagment />}
									/>
								)}
							/>
						)}

					{rRender(resources, 'encashments', 'allow_create') && (
						<WithTerminalProtectedRoute
							exact={true}
							path="/encashment/validator"
							component={() => (
								<Page
									caption="Encashment validator"
									component={<EncashmentValidator />}
								/>
							)}
						/>	
					)}

					{rRender(resources, 'encashments', 'allow_create') && (
						<WithTerminalProtectedRoute
							exact={true}
							path="/encashment/dispenser"
							component={() => (
								<Page
									caption="Encashment dispenser"
									component={<EncashmentDispenser />}
								/>
							)}
						/>
					)}

					{rRender(resources, 'encashments', 'allow_view') && (
						<WithTerminalProtectedRoute
							exact={true}
							path="/encashment-history/validator"
							component={() => (
								<Page
									caption="EncashmentHistory"
									component={<EncashmentHistoryValidator />}
								/>
							)}
						/>
					)}

					{rRender(resources, 'encashments', 'allow_view') && (
						<WithTerminalProtectedRoute
							exact={true}
							path="/encashment-history/dispenser"
							component={() => (
								<Page
									caption="EncashmentHistory"
									component={<EncashmentHistoryDispenser />}
								/>
							)}
						/>
					)}

					{rRender(resources, 'permissions', 'allow_view') && (
						<PrivateRoute
							exact={true}
							path="/roles"
							component={() => (
								<Page caption="Roles" component={<Roles />} />
							)}
						/>
					)}

					{(rRender(resources, 'logs', 'allow_view') ||
						rRender(
							resources,
							'terminal_events',
							'allow_view'
						)) && (
							<PrivateRoute
								exact={true}
								path="/logs"
								component={() => (
									<Page caption="Logs" component={<Logs />} />
								)}
							/>
						)}

					{rRender(resources, 'terminals', 'allow_view') && (
							<PrivateRoute
								exact={true}
								path="/terminals"
								component={() => <Page 
									caption="Terminals" 
									component={<Terminals />} 
								/>}
							/>
					)}	
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.authorization.userData.user,
	resources: state.authorization.userData.user.resources,
	selected: state.selected
});

export default compose(
	withRouter,
	connect(mapStateToProps),
	withStyles(styles)
)(Pages);
