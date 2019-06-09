import React from 'react';
import { Link } from '@reach/router';
import { Menu } from 'antd';

function LeftMenu({ mode }) {
  return (
    <Menu mode={mode}>
      <Menu.Item key='home'>
        <Link to='/'>Home</Link>
      </Menu.Item>
      <Menu.Item key='search-pets'>
        <Link to='/search'>Search Pets</Link>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
