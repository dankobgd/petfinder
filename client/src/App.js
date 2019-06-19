import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import store from './redux/store';
import { authActions } from './redux/auth';

import Home from './screens/Home';
import NotFound from './screens/NotFound';
import Signup from './components/auth-form/Signup';
import Login from './components/auth-form/Login';
import Navbar from './components/navigation/Navbar';

function App() {
  useEffect(() => {
    store.dispatch(authActions.setCurrentUserRequest());
  }, []);

  return (
    <Provider store={store}>
      <div className='app'>
        <Navbar />
        <Router>
          <Home path='/' />
          <Signup path='signup' />
          <Login path='login' />
          <NotFound default />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
