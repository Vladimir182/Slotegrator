import React, { Component, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { logOut, checkAuth } from '../../ducks/authorization';
import { rRender, sideBarState } from '../../utils/helper';
import Preloader from '../preloaders/PreloaderOverlay';
import Header from '../Header';
import Pages from './Pages';
import { compose } from 'redux';
import { setSelectedNode } from '../../ducks/selected';
// const Pages = React.lazy(() => import('./Pages'));

const drawerWidth = 240;
const styles = theme => ({
	root: {
		display: 'flex',
		flexGrow: 1,
		width: '100%'
	},
	content: {
		width: '100%',
		[theme.breakpoints.down('sm')]:{
			overflow: 'auto',
			flexGrow: 1,
		},
		padding: theme.spacing(3),
		marginTop: theme.spacing(4),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		marginLeft: -drawerWidth,
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			padding: theme.spacing(1)
		},
		[theme.breakpoints.down('xs')]: {
			marginLeft: 0,
		},
	},
	contentShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: 0
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '0 8px',
		...theme.mixins.toolbar,
		justifyContent: 'flex-end'
	},
	loadingWrapper: {
		marginTop: theme.spacing(3)
	}
});

class Authorized extends Component {
	constructor(props) {
		super(props);
		const { checkAuth } = props;

		this.state = {
			open: sideBarState(),
		};
	}

	handlerDrawerOpen = () => {
		this.setState({ open: true });
	};

	handlerDrawerToggle = val => {
		this.setState({ open: val });
	};

	handlerDrawerClose = () => {
		this.setState({ open: false });
	};

	shouldComponentUpdate(nextProps, nextState) {
		if (!_.isEqual(this.state.user, nextState.user)) {
			return true;
		}
		if (!_.isEqual(this.state, nextState) || !_.isEqual(this.props, nextProps)) {
			return true;
		}

		return false;
	}

	static getDerivedStateFromProps(nextProps, prevState){
        if (!_.isEqual(nextProps.user, prevState.user)) {

			return {
				user : nextProps.user
			};
       }
	}		

	componentDidMount() {
		const { checkAuth } = this.props;

		checkAuth(this.initialRequestsWithUser.bind(this));
	}

	initialRequestsWithUser(user) {
		const { setSelectedNode } = this.props;

		const selected = JSON.parse(sessionStorage.getItem('selected'));
		
		if (selected) {
			setSelectedNode(selected[selected.nodeType].id, selected.nodeType, user.resources)
		}
	}

	render() {
		const { classes, isAuth, loading, location } = this.props;
		const { open } = this.state;

		return (
			loading ? <Preloader />
			: !loading && !isAuth && location.pathname !== '/login' ? <Redirect to="/login" />
			: <div className={classes.root}>
				<Header
					handlerDrawerToggle={this.handlerDrawerToggle} 
				/>
				<main
					className={classNames(classes.content, {
						[classes.contentShift]: open
					})}>
					<div className={classes.drawerHeader} />
						<Suspense fallback={<Preloader />}>
							<Pages/>
						</Suspense>
				</main>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	loading: state.authorization.isLoading,
	user: state.authorization.userData.user,
	isAuth: state.authorization.isAuth,
	tree: state.merchants.tree,
});

const mapDispatchToProps = {
	logOut,
	checkAuth,
	setSelectedNode
};

export default compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Authorized);
