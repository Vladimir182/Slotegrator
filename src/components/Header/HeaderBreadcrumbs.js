import React, { Component } from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from './Breadcrumbs';
import _ from 'lodash';
import { compose } from 'redux';
import MobileBreadcrumbs from './Breadcrumbs/MobileBread';

class HeaderBreadcrumbs extends Component {
	createBreadcrumb = () => {
		const {  selected, terminals } = this.props;
		const breadcrubs = [{ title: 'Root', nodeType: 'root' }];

		const merchantData = { ...selected.merchant, nodeType: 'merchant'};
		const roomData = { ...selected.room, nodeType: 'room'};
		const terminalData = { ...selected.terminal, nodeType: 'terminal'};

		if (selected.nodeType === 'terminal') {
			breadcrubs.push(merchantData, roomData, terminalData);
		} else if (selected.nodeType === 'room') {
			breadcrubs.push(merchantData, roomData);
		} else if (selected.nodeType === 'merchant') {
			breadcrubs.push(merchantData);
		}
		if( window.innerWidth > 600){
			return <Breadcrumbs
			data={breadcrubs}
			key={_.uniqueId('breadcrumb')}
		/>
		} else {
			return <MobileBreadcrumbs
			data={breadcrubs}
			key={_.uniqueId('mobileBreadcrumb')}
			/>
		}		
	};

	createLoadingBreadcrumb = () => {
		const { selected } = this.props;

		const size = selected.preloadNodeType === 'terminal' ? 4
			: selected.preloadNodeType === 'room' ? 3
			: selected.preloadNodeType === 'merchant' ? 2
			: 1;
			 if(window.innerWidth > 600){
				return <Breadcrumbs size={size} isLoading={true} />;
			 }else {
				return <MobileBreadcrumbs size={size} isLoading={true} />;
			 }
	
	}

	render() {
		const { selected } = this.props;

		const Breadcrumbs = selected.isLoading ? this.createLoadingBreadcrumb() : this.createBreadcrumb();
		const MobBreadcrumbs = selected.isLoading ? this.createLoadingBreadcrumb() : this.createBreadcrumb();
		const ChangeBreadcrumbs = window.innerWidth > 600 ? Breadcrumbs : MobBreadcrumbs

		// return <div>{Breadcrumbs}</div>;
		return <div>{ChangeBreadcrumbs}</div>
	}
}

const mapStateToProps = state => ({
	user: state.authorization.userData.user,
	current: state.merchants.current,
	rooms: state.merchants.rooms,
	terminals: state.merchants.terminals,
	merchants: state.merchants.merchants,
	selected: state.selected
});

export default compose(
	connect(mapStateToProps)
)(HeaderBreadcrumbs);
