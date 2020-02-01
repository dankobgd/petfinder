import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import store from './redux/store';
import { identityActions } from './redux/identity';

import Toasts from './components/toast/Toasts';
import Navbar from './components/navigation/Navbar';
import Home from './screens/home';
import NotFound from './screens/404';
import { Login, Signup, Forgot, Reset } from './screens/auth';
import Profile from './screens/profile/Profile';
import Search from './screens/search/Search';
import PetSingle from './components/pet/PetSingle';
import { PrivateRoute, PublicRoute, GuestRoute } from './components/authorization';

function App() {
  useEffect(() => {
    store.dispatch(identityActions.setCurrentUserRequest());
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
          <PublicRoute path='password-forgot' component={Forgot} />
          <PublicRoute path='password-reset/:resetToken' component={Reset} />
          <PublicRoute path='search' component={Search} />
          <PublicRoute path='pet/:id/:name' component={p => <PetSingle arr='pets.searchResults' {...p} />} />
          <PublicRoute path='latest/pet/:id/:name' component={p => <PetSingle arr='pets.latest' {...p} />} />
          <PrivateRoute path='profile/*' component={Profile} />
          <NotFound default />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
