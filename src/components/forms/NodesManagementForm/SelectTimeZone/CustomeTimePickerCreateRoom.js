import React, { Component } from 'react';

import Select from 'react-select';
import timezones from '../../../../utils/timezones';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		},
		'&:hover': {
			cursor: 'pointer'
		}
	},
	inputRoot: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		},
		'&:hover': {
			cursor: 'pointer'
		},
		'&::before': {
			borderBottom: 'none!important' //turn off underline under header select
		}
	},
	inputNative: {
		display: 'flex',
		padding: '10px 5px'
	},
	select: {
		position: 'relative'
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden',
		'& div':{
			color: theme.palette.type === 'dark' ? theme.palette.primary.contrastText : theme.palette.dark
		}
	},
	paper: {
		width: '100%',
		zIndex: 9999,
		marginTop: theme.spacing.unit,
	}
});
const stringifyZone = (zone, offset) => {
	const ensure2Digits = num => (num > 9 ? `${num}` : `0${num}`);

	return `(${offset}${zone.offset < 0 ? '-' : '+'}${ensure2Digits(
		Math.floor(Math.abs(zone.offset))
	)}:${ensure2Digits(Math.abs((zone.offset % 1) * 60))}) ${zone.label}`;
};

const inputComponent = ({ inputRef, ...props }) => {
	return <div ref={inputRef} {...props} />;
};

const Control = props => {
	return (
		<TextField
			fullWidth
			variant="filled"
			InputProps={{
				classes: {
					input: props.selectProps.classes.input,
					root: props.selectProps.classes.inputRoot,
					focused: props.selectProps.classes.inputRoot
				},
				inputComponent,
				inputProps: {
					className: props.selectProps.classes.inputNative,
					inputRef: props.innerRef,
					children: props.children,
					...props.innerProps
				}
			}}
			{...props.selectProps.textFieldProps}
		/>
	);
};
const Menu = props => {
	return (
		<Paper
			square
			className={props.selectProps.classes.paper}
			{...props.innerProps}>
			{props.children}
		</Paper>
	);
};
const CustomOption = ({ innerRef, innerProps, ...commonProps }) => {
	return (
		<MenuItem
			buttonRef={innerRef}
			selected={commonProps.isFocused}
			component="div"
			style={{
				fontWeight: commonProps.isSelected ? 500 : 400
			}}
			{...innerProps}>
			{stringifyZone(commonProps.data, 'GMT')}
		</MenuItem>
	);
};
const ValueContainer = props => {
	return (
		<div
			className={classnames(
				props.selectProps.classes.valueContainer,
				props.selectProps.customStylesInput
			)}>
			{props.children}
		</div>
	);
};
class CustomControl extends Component {
	render() {
		const {
			classes,
			customStylesInput,
			handlerChange,
			placeholder,
			...other
		} = this.props;
		return (
			<div>
				<Select
					customStylesInput={customStylesInput}
					className={classes.select}
					classes={classes}
					value={
						timezones.find(zone => zone.name === other.value) || ''
					}
					placeholder={placeholder}
					components={{
						Control: Control,
						Option: CustomOption,
						ValueContainer: ValueContainer,
						Menu: Menu
					}}
					isSearchable
					name="color"
					options={timezones}
					onChange={handlerChange}
				/>
			</div>
		);
	}
}
CustomControl.defaultProps = {
	customStylesInput: {}
};
export default withStyles(styles)(CustomControl);
