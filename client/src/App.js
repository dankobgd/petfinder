import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import store from './redux/store';
import { authActions } from './redux/auth';

import Toasts from './components/toast/Toasts';
import Navbar from './components/navigation/Navbar';
import Home from './screens/Home';
import NotFound from './screens/NotFound';
import Signup from './components/auth-form/Signup';
import Login from './components/auth-form/Login';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import Profile from './screens/profile/Profile';
import { PrivateRoute, PublicRoute, GuestRoute } from './components/route/Auth';

function App() {
  useEffect(() => {
    store.dispatch(authActions.setCurrentUserRequest());
  }, []);

  return (
    <Provider store={store}>
      <div className='app'>
        <Navbar />
        <Toasts />

        <Router>
          <PublicRoute path='/' component={Home} />
          <GuestRoute path='signup' component={Signup} />
          <GuestRoute path='login' component={Login} />
          <PublicRoute path='password-forgot' component={ForgotPassword} />
          <PublicRoute path='password-reset/:resetToken' component={ResetPassword} />
          <PrivateRoute path='profile/*' component={Profile} />
          <NotFound default />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
