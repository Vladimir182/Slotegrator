/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { compose } from "redux";
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = theme => ({
  root: {
    // padding: '27px 12px 10px'
  },
  fullWidth: {
    width: '100%',
    marginTop: '0px'
  }
});


const AutocompleteSelectCurrency = ({
  classes,
  name,
  theme, 
  helperText,
  input,
  label,
  meta: { touched, error },
  children,
  fullWidth,
  ...custom
}) => {
    return (
      <FormControl error={touched && error} className={classes.fullWidth}>
            <Autocomplete
              {...input}
              {...custom}
              autoHighlight={true}
              disableClearable={true}
              id="select-currency-autocomplete"
              value={input.value}
              onChange={(event, value) => input.onChange(value)}
              renderInput={(params) => {
                return (
                  <TextField 
                    className={classes.root}
                    {...params}
                    label="Select currency"
                    placeholder='Select currency'
                    fullWidth={true}
                    variant="filled"
                  />
                )
              }}
            />
          <FormHelperText className={classes.halperText} htmlFor={name}>{helperText}</FormHelperText>
      </FormControl>  
    );
}
export default compose(
  withStyles(styles, { withTheme: true })
)(AutocompleteSelectCurrency);
