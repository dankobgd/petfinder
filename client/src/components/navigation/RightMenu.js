import React from 'react';
import { Link } from '@reach/router';
import { Menu, Icon } from 'antd';

function RightMenu({ mode, activeSide, setActiveSide }) {
  const underlineClass = activeSide === 'left' ? 'no-underline' : null;

  return (
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
}

export default RightMenu;
