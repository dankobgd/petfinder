import React from 'react';
import { Router } from '@reach/router';
import Home from './screens/Home';
import NotFound from './screens/NotFound';
import Signup from './components/auth-form/Signup';
import Login from './components/auth-form/Login';
import Navbar from './components/navigation/Navbar';

function App() {
  return (
    <div className='app'>
      <Navbar />
      <Router>
        <Home path='/' />
        <Signup path='signup' />
        <Login path='login' />
        <NotFound default />
      </Router>
    </div>
  );
}

export default App;
