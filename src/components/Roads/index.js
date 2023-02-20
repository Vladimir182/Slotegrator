import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Authorized from './Authorized';
// import Preloader from '../preloaders/PreloaderOverlay';
// const AuthLazy = lazy(() => import('./Authorized'));

class Road extends Component {
	render() {
		return (
			<Switch>
				<Route path="/login" component={Login} />
				<Suspense fallback={null}>
					<Route path="/" component={Authorized} />
				</Suspense>
			</Switch>
		);
	}
}
const mapStateToProps = state => ({
	isAuth: state.authorization.isAuth
});

export default compose(
	withRouter,
	connect(mapStateToProps)
)(Road);
