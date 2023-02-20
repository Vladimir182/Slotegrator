/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { compose } from "redux";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = theme => ({
  fullWidth: {
    width: '100%',
    marginTop: '0px'
  },
  halperText: {
    color: '#ffb300',
    padding: '8px 12px 0',
    fontSize: '0.75rem'
  }
});


class FieldAutocomplete extends React.Component {
 

  render() {
    const { 
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
    } = this.props;

    return (
      <FormControl error={touched && error} className={classes.fullWidth}>
         <Autocomplete
              {...input}
              {...custom}
              autoComplete={true}
              autoHighlight={true}
              disableClearable={true}
              id="buyer-id-autocomplete"
              value={input.value}
              onChange={(event, value) => input.onChange(value)}
              renderInput={(params) => {
                return (
                  <TextField 
                    className={classes.root}
                    {...params}
                    label="Buyer ID"
                    placeholder="Buyer ID"
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
}
export default compose(
  withStyles(styles, { withTheme: true })
)(FieldAutocomplete);
