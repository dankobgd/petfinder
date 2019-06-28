import React from 'react';
import { Link } from '@reach/router';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';

function LeftMenu({ mode, activeSide, setActiveSide }) {
  const underlineClass = activeSide === 'right' ? 'no-underline' : null;
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const loggedInItems = (
    <Menu mode={mode}>
      <Menu.Item key='home' onClick={() => setActiveSide('left')} className={underlineClass}>
        <Link to='/'>Home</Link>
      </Menu.Item>
      <Menu.Item key='search-pets' onClick={() => setActiveSide('left')} className={underlineClass}>
        <Link to='/search'>Search Pets</Link>
      </Menu.Item>
      <Menu.Item key='add' onClick={() => setActiveSide('left')} className={underlineClass}>
        <Link to='/add'>Add pet</Link>
      </Menu.Item>
    </Menu>
  );

  const loggedOutItems = (
    <Menu mode={mode}>
      <Menu.Item key='home' onClick={() => setActiveSide('left')} className={underlineClass}>
        <Link to='/'>Home</Link>
      </Menu.Item>
      <Menu.Item key='search-pets' onClick={() => setActiveSide('left')} className={underlineClass}>
        <Link to='/search'>Search Pets</Link>
      </Menu.Item>
    </Menu>
  );

  if (isAuthenticated) {
    return loggedInItems;
  } else {
    return loggedOutItems;
  }
}

export default LeftMenu;
