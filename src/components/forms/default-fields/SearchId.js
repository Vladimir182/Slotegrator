import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import FormHelperText from '@material-ui/core/FormHelperText';
import classNames from 'classnames';
import { IconButton, InputAdornment } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
	input: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	root: {
		backgroundColor: 'rgba(0,0,0,0)',
		'&:focus': {
			backgroundColor: 'rgba(0,0,0,0)'
		}
	},
	fullWidth: {
		width: '100%'
	},
	slim: {
		width: '100pt',
		[theme.breakpoints.only('xs')]: {
			width: '70pt'
		}
	},
	rootHidden: {
		width: 0,
		height: 0
	},
	carefully: {
		color: amber['600']
	},
	halperText: {
		color: '#ffb300',
		padding: '8px 12px 0',
		fontSize: '0.75rem'
	},
  filterSearchId: {
		border: theme.palette.button.borderColor,
		borderRadius: '25px',
		display: 'flex',
		minHeight: '48px',
		width: '160px',
		marginLeft: '8px',
		padding: theme.spacing(1, 2, 1, 0),
		justifyContent: 'space-between',
		alignItems: 'center',
		transition: '.25s',
		'&:hover':{
			backgroundColor: theme.palette.button.hover
		},
		'& .MuiFormControl-root': {
			flexDirection: 'row',
			height: '40px'
		},
		'& .MuiIconButton-colorPrimary': {
			color: theme.palette.iconColor,
			padding: theme.spacing(2),
			'&:hover': {
				backgroundColor: theme.palette.button.background
			}
		}
	},
  searchInputId: {
		'& .MuiInputBase-input': {
      width: '90px',
			paddingLeft: theme.spacing(4),
			color: theme.typography.color
		},
		'& .MuiInput-input': {
			'&[type=number]': {
				'-moz-appearance': 'textfield',
			},
			'&::-webkit-outer-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0,
			},
			'&::-webkit-inner-spin-button': {
				'-webkit-appearance': 'none',
				margin: 0,
			},
		}
	},
});

const SearchId = ({
	classes,
	name,
	input,
	label,
	meta: { touched, error },
	fullWidth,
	size,
	hidden,
	carefully,
	endAdornment,
  handleSearchClick,
	...custom
}) => {

	const inputRef = React.createRef();

	React.useEffect(() => {
		if (custom.type === 'number' && inputRef.current) {
			inputRef.current.addEventListener("keypress", evt => {
				if (evt.which === 8) {
				return;
				}
				if (evt.which < 48 || evt.which > 57) {
				evt.preventDefault();
				}
			});
		}
	  }, []);

	const formControlClasses = classNames({
		[classes.fullWidth]: fullWidth,
		[classes.slim]: size === 'slim'
	})

	return (
    
    <div className={classes.filterSearchId}>
		<FormControl
			error={Boolean(touched) && Boolean(error)}
			className={`${formControlClasses} ${classes.searchInputId}`}
		>
			<TextField
				// hintText={label}
				inputRef={inputRef}
				value={input.value}
				name={name}
				label={label}
				errorText={Boolean(touched) && Boolean(error)}
				// floatingLabelText={label}
				error={Boolean(touched) && Boolean(error)}
				// type={hidden || 'text'}
				InputProps={{
					classes: {
						input: classes.input,
						root: classes.root,
						focused: classes.root
					},
					disableUnderline: true,
					endAdornment
				}}
				onKeyPress={(e) => {
					if (input.value.length === 0 && e.which === 32) {
						e.preventDefault();
						}
					}}
				FormHelperTextProps={{
					classes: {
						root: carefully ? classes.carefully : {}
					}
				}}
				{...input}
				{...custom}
			/>
			<FormHelperText htmlFor={name}>{touched && error}</FormHelperText>
		</FormControl>
      <div>
        <InputAdornment>
        <IconButton  
          color='primary'
          onClick={() => {

            const value = inputRef.current.value;

            if (!handleSearchClick)
              return;

            handleSearchClick(value);
          }}
        >
          <SearchIcon/>
        </IconButton>
        </InputAdornment>
      </div>
    </div>
	)
};
SearchId.defaultProps = {
	name: 'name',
	type: 'text',
	carefully: false
};

SearchId.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default withStyles(styles)(SearchId);
