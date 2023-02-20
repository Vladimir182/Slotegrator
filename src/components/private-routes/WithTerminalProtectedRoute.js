import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

const WithTerminalProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        rest.isAuth === false ? <Redirect to={{ pathname: "/login" }} />
        : !rest.selected.terminal ? <Redirect to={{ pathname: "/" }} />
        : <Component {...props} />
      }
    />
  );
};

const mapStateToProps = state => ({
  isAuth: state.authorization.isAuth,
  selected: state.selected
});

export default compose(
  connect(mapStateToProps, null)
)(WithTerminalProtectedRoute);
