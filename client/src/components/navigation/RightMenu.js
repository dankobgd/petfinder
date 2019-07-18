import React from 'react';
import { Link } from '@reach/router';
import { Menu, Icon, Avatar, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth';
import s from './styles.module.css';

const { SubMenu } = Menu;

function RightMenu({ mode }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  const loggedOutMenuItems = (
    <Menu mode={mode}>
      <Menu.Item key='signup'>
        <Link to='signup'>
          <Icon type='user-add' />
          <Typography.Text>Signup</Typography.Text>
        </Link>
      </Menu.Item>
      <Menu.Item key='login'>
        <Link to='login'>
          <Icon type='login' />
          <Typography.Text>Login</Typography.Text>
        </Link>
      </Menu.Item>
    </Menu>
  );

  const loggedInMenuItems = (
    <Menu mode={mode}>
      <SubMenu
        key='sub'
        title={
          user && (
            <span className={s.profile_avatar}>
              {<Typography.Text>{user.username}</Typography.Text>}
              {user.avatar ? <Avatar size='large' src={user.avatar} /> : <Avatar size='large' icon='user' />}
            </span>
          )
        }
      >
        <Menu.Item key='profile'>
          <Link to='/profile'>
            <Icon type='user' />
            <Typography.Text>Profile</Typography.Text>
          </Link>
        </Menu.Item>
        <Menu.Item key='logout' onClick={() => dispatch(authActions.userLogoutRequest())}>
          <Link to='/'>
            <Icon type='logout' />
            <Typography.Text>Logout</Typography.Text>
          </Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );

  if (isAuthenticated) {
    return loggedInMenuItems;
  } else {
    return loggedOutMenuItems;
  }
}

export default RightMenu;
