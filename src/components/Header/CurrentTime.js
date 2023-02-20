import React, { Component } from 'react';
import moment from 'moment';

export default class CurrentTime extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: moment().format('HH:mm:ss')
		};
	}
	componentDidMount() {
		this.intervalID = setInterval(() => this.tick(), 1000);
	}
	componentWillUnmount() {
		clearInterval(this.intervalID);
	}
	tick() {
		this.setState({
			time: moment().format('H:mm:ss')
		});
	}
	render() {
		return <p className="App-clock">{this.state.time}</p>;
	}
}
