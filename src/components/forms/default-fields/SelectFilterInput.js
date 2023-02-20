import React, { Component } from 'react';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		position: 'relative',
		minWidth: '100pt',
		'& label': {
			position: 'absolute',
			top: '-7px',
			left: '-12px'
		},
		'& input': {
			marginBottom: '13px'
		},
		[theme.breakpoints.only('md')]: {
			minWidth: '70pt'
		},
		[theme.breakpoints.between('xs','sm')]: {
			minWidth: '50pt'
		}
	},
	input: {
		color: '#000!important',
		marginTop: '13px',
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
		marginTop: '16px',
		height: '32px',
		'border-top-left-radius': '0px!important',
		'border-top-right-radius': '0px!important',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)',
		},
		'&:hover:before': {
			borderBottom: theme.palette.type === 'dark' ? '2px solid white!important' : '2px solid black!important'
		},
		'&:hover': {
			cursor: 'pointer',
			backgroundColor: 'rgba(0,0,0,0)',
		}
	},
	inputNative: {
		display: 'flex',
		padding: '6px 5px',
		maxWidth: '120px',
		'& span': {
			display: 'none'
		},
		'& svg': {
			marginBottom: '10px'
		}
	},
	select: {
		position: 'relative',
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden',
		// '& div': {
		// 	paddingBottom: '13px',
		// },
	},
	paper: {
		position: 'absolute',
		width: '100%',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0
	}
});

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
				placeholder: 'With Popper',
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
			{commonProps.data.value}
		</MenuItem>
	);
};

const ValueContainer = props => {
	return (
		<div
			style={{ color: 'black' }}
			className={ classnames(
				props.selectProps.classes.valueContainer,
				props.selectProps.customStylesInput
			)}>
			{props.children}
		</div>
	);
};

class SelectFilterInput extends Component {
	render() {
		const {
			classes,
			customStylesInput,
			handlerChange,
			placeholder,
			terminalIds,
			label,
			...other
		} = this.props;

		return (
			<div className={classes.root}>
				<Select
					customStylesInput={customStylesInput}
					className={classes.select}
					classes={classes}
					value={
						terminalIds.find(idObj => idObj.value === other.value) || ''
					}
					textFieldProps={{
						label: label,
						InputLabelProps: {
							shrink: true,
						},
					}}
					components={{
						Control: Control,
						Option: CustomOption,
						ValueContainer: ValueContainer,
						Menu: Menu
					}}
					isSearchable
					name="color"

					options={terminalIds}
					onChange={handlerChange}
				/>
			</div>
		);
	}
};

SelectFilterInput.defaultProps = {
	customStylesInput: {}
};
export default compose(
	withStyles(styles)
)(SelectFilterInput);

