import React from 'react';
import { Link } from '@reach/router';
import { Menu, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { userLogoutRequest } from '../../redux/auth/authActions';

function RightMenu({ mode, activeSide, setActiveSide }) {
  const underlineClass = activeSide === 'left' ? 'no-underline' : null;

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const authMenuItems = (
    <Menu mode={mode}>
      <Menu.Item key='signup' onClick={() => setActiveSide('right')} className={underlineClass}>
        <Link to='signup'>
          <Icon type='user-add' />
          Signup
        </Link>
      </Menu.Item>
      <Menu.Item key='login' onClick={() => setActiveSide('right')} className={underlineClass}>
        <Link to='login'>
          <Icon type='login' />
          Login
        </Link>
      </Menu.Item>
    </Menu>
  );

  const logoutMenuItem = (
    <Menu mode={mode}>
      <Menu.Item key='logout' onClick={() => dispatch(userLogoutRequest())} className={underlineClass}>
        <Link to='/'>
          <Icon type='logout' />
          Logout
        </Link>
      </Menu.Item>
    </Menu>
  );

  if (isAuthenticated) {
    return logoutMenuItem;
  } else {
    return authMenuItems;
  }
}

export default RightMenu;
