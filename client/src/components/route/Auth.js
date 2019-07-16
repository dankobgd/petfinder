import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from '@reach/router';

export function PrivateRoute({ component: Component, redirectUrl = 'login', ...rest }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Redirect from={window.location.pathname} to={redirectUrl} noThrow />
  );
}

export function PublicRoute({ component: Component, ...rest }) {
  return <Component {...rest} />;
}

export function GuestRoute({ component: Component, redirectUrl = '/', ...rest }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Redirect from={window.location.pathname} to={redirectUrl} noThrow />
  ) : (
    <Component {...rest} />
  );
}
