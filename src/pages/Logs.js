import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLogs } from '../ducks/logs';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import ServerLogs from '../components/Logs/ServerLogs';
import AdminLogs from '../components/Logs/Admin';
import TerminalsLogs from '../components/Logs/Terminals';
import ApiLogs from '../components/Logs/Api';
import PlatformLogs from '../components/Logs/Platform';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { rRender } from '../utils/helper';
import { compose } from 'redux';
import moment from 'moment';

const styles = theme => ({
	root: {
		marginTop: theme.spacing(1),

		'& .wrapFilterLogsPage': {

			'& .MuiIconButton-root': {
				color: theme.palette.button.color
			}
		}
	},
	table: {
		width: '100%',
		// overflowX: 'auto'
	},
	TabsStyle:{
		[theme.breakpoints.up('1401')]:{
			background: theme.palette.tableControl.tableControlColor,
			position: 'sticky',
			top: '88px',
			zIndex: '20',
		}
	},
	reload: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	loading: {
		height: '5px',
		width: '100%'
	}
});

class Logs extends Component {
	constructor(props) {
		super(props);
		const storageTabs = sessionStorage.getItem('saveTabTerminals');

		this.state = {
			currentTab: storageTabs ? JSON.parse(storageTabs) : 0
		};
	}
	componentDidMount() {
		this.updateData();
	}	
	handleChangeTab = (event, newValue) => {
		sessionStorage.setItem('saveTabTerminals', newValue);
		this.setState({ currentTab: newValue });
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		// const { current } = nextProps;
		// if (current.is_root && prevState.currentTab === 1) {
		// 	return {
		// 		currentTab: 0
		// 	};
		// }
		// return null;
	}
	updateData = () => {};

	render() {
		const { classes, resources } = this.props;
		const { currentTab } = this.state;
		return (
			<div>
				<Paper className={classes.root}>
					<Tabs className={classes.TabsStyle}
								value={currentTab}
					      textColor="inherit"
					      onChange={this.handleChangeTab}
					      variant="scrollable"
					      scrollButtons="auto"
					>
						<Tab
							label="Admin"
							disabled={!rRender(resources, 'logs', 'allow_view')}
						/>
						<Tab
							label="Terminals"
							disabled={!rRender(resources, 'logs', 'allow_view')}
						/>
						<Tab
							label="Api"
							disabled={!rRender(resources, 'logs', 'allow_view')}
						/>
						<Tab
							label="Platform"
							disabled={!rRender(resources, 'logs', 'allow_view')}
						/>
					</Tabs>
					<div className={classes.table}>
						{currentTab === 0 && <AdminLogs />}
						{currentTab === 1 && <TerminalsLogs />}
						{currentTab === 2 && <ApiLogs />}
						{currentTab === 3 && <PlatformLogs />}

						{/* {currentTab === 1 && <TerminalsLogs />} */}
					</div>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	logs: state.logs.logs,
	countPage: state.logs.countPageLogs,
	loading: state.logs.loading,
	resources: state.authorization.userData.user.resources
});
const mapDispatchToProps = {
	fetchLogs
};

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withStyles(styles)
)(Logs);
