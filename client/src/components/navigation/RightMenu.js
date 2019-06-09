import React from 'react';
import { Link } from '@reach/router';
import { Menu, Icon } from 'antd';

function RightMenu({ mode }) {
  return (
    <Menu mode={mode}>
      <Menu.Item key='signup'>
        <Link to='signup'>
          <Icon type='user-add' />
          Signup
        </Link>
      </Menu.Item>
      <Menu.Item key='login'>
        <Link to='login'>
          <Icon type='login' />
          Login
        </Link>
      </Menu.Item>
    </Menu>
  );
}

export default RightMenu;
