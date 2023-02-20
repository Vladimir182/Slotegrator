import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import timezones from '../../../utils/timezones';

class TimezonePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			focus: null,
			query: '',
			currentZone: props.value
				? timezones.find(zone => zone.name === this.props.value)
				: null
		};
	}

	handleChange = e => {
		this.setState({ currentZone: e.target.value }, () => {
			if (this.props.onChange) this.props.onChange(e.target.value.name);
		});
	};

	handleBlur = e => {
		if (this.props.onBlur) this.props.onBlur(e.target.value.name);
	};

	stringifyZone = (zone, offset) => {
		const ensure2Digits = num => (num > 9 ? `${num}` : `0${num}`);

		return `(${offset}${zone.offset < 0 ? '-' : '+'}${ensure2Digits(
			Math.floor(Math.abs(zone.offset))
		)}:${ensure2Digits(Math.abs((zone.offset % 1) * 60))}) ${zone.label}`;
	};

	static getDerivedStateFromProps(props, state) {
		if (props.value !== (state.currentZone ? state.currentZone.name : '')) {
			return {
				currentZone: timezones.find(zone => zone.name === props.value)
			};
		}
		return null;
	}

	render() {
		const { currentZone } = this.state;
		const { offset, value, ...custom } = this.props;
		return (
			<React.Fragment>
				<TextField
					select
					label="Timezone"
					variant="filled"
					{...custom}
					value={currentZone}
					onChange={this.handleChange}
					onBlur={this.handleBlur}>
					{timezones.map(zone => (
						<option key={zone.name} value={zone} title={zone.label}>
							{this.stringifyZone(zone, offset)}
						</option>
					))}
				</TextField>
			</React.Fragment>
		);
	}
}

TimezonePicker.defaultProps = {
	value: '',
	offset: 'GMT'
};

export default TimezonePicker;
