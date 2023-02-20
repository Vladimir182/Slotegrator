import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        rest.isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              // state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = state => ({
  isAuth: state.authorization.isAuth
});

export default compose(
  connect(mapStateToProps, null)
)(PrivateRoute);
