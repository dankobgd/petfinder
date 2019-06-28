import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from '@reach/router';

function PrivateRoute({ component: Component, redirectUrl = 'login', ...rest }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Redirect from={window.location.pathname} to={redirectUrl} noThrow />
  );
}

export default PrivateRoute;
