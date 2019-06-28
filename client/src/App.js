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
import AddPet from './screens/add/AddPet';
import PrivateRoute from './components/route/Private';

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
          <Home path='/' />
          <Signup path='signup' />
          <Login path='login' />
          <PrivateRoute path='add' component={AddPet} />
          <ForgotPassword path='password-forgot' />
          <ResetPassword path='password-reset/:resetToken' />
          <NotFound default />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
