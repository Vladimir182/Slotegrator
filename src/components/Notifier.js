import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { removeSnackbar } from '../ducks/notification';
import { compose } from 'redux';

class Notifier extends Component {
	displayed = [];

	storeDisplayed = id => {
		this.displayed = [...this.displayed, id];
	};

	shouldComponentUpdate({ notifications: newSnacks = [] }) {
		const { notifications: currentSnacks } = this.props;
		let notExists = false;
		for (let i = 0; i < newSnacks.length; i += 1) {
			if (notExists) continue;
			notExists =
				notExists ||
				!currentSnacks.filter(({ key }) => newSnacks[i].key === key)
					.length;
		}
		return notExists;
	}

	componentDidUpdate() {
		const {
			notifications = [],
			enqueueSnackbar,
			removeSnackbar
		} = this.props;
		notifications.forEach(notification => {
			if (!this.displayed.length) {
				enqueueSnackbar(notification.message, notification.options);
				this.storeDisplayed(notification.key);
				setTimeout(function() {
					this.displayed = [];
				}.bind(this), 2000);
				return;
			};
		});
	}

	render() {
		return null;
	}
}

const mapStateToProps = store => ({
	notifications: store.notification.notifications
});

export default compose(
	connect(mapStateToProps, {removeSnackbar}),
	withSnackbar
)(Notifier);
