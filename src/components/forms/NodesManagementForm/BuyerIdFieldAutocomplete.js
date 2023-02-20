/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { compose } from "redux";

const styles = theme => ({
  root: {
    // flexGrow: 1,
    // height: 56
  },
  input: {
    display: "flex",
    padding: 0,
    marginLeft: '10px'
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    // overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16,
    marginLeft: '10px'
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 999999
  },
  divider: {
    height: theme.spacing.unit * 2
  },
  halperText: {
    color: '#ffb300',
    padding: '8px 12px 0',
    fontSize: '0.75rem'
  },
  fullWidth: {
		width: '100%'
  },
  disabledBG: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)!important',
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const { isDisabled, classes } = props.selectProps;
  return (
    <TextField
      onClick={() => {
        if(props.hasValue) props.clearValue();
      }}
      className={classNames({[classes.disabledBG]: isDisabled ? true : false })}
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class FieldAutocomplete extends React.Component {
  state = {
    single: null,
    multi: null
  };

  handleChange = name => value => {
    this.setState({
      [name]: value
    });
  };

  render() {
    const { 
      classes,
      name,
      theme, 
      selectArr, 
      placeholder,
      helperText,
      input: { value, onChange },
      label,
      meta: { touched, error },
      disabled,
      children,
      ...custom
    } = this.props;
    const selectItems = selectArr.map(item => ({
        value: item,
        label: item
    }));
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };
    let selectValue = disabled ? null : { value: value, label: value }; 
    return (
      <FormControl error={touched && error} className={classes.fullWidth}>
        <div className={classes.root}>
          <div className={classNames(classes.divider, {[classes.disabledBG]: disabled ? true : false })} />
          { disabled 
            ? <Select
              stykr
              isDisabled={disabled === true}
              value={selectValue}
              classes={classes}
              styles={selectStyles}
              textFieldProps={{
              }}
              options={selectItems}
              components={components}
              onChange={onChange}
              placeholder={placeholder}
            />
            : <Select
              stykr
              classes={classes}
              styles={selectStyles}
              textFieldProps={{
              }}
              options={selectItems}
              components={components}
              onChange={onChange}
              placeholder={placeholder}
            />
          }
          <FormHelperText className={classes.halperText} htmlFor={name}>{helperText}</FormHelperText>
        </div>
      </FormControl>  
    );
  }
}
export default compose(
  withStyles(styles, { withTheme: true })
)(FieldAutocomplete);
