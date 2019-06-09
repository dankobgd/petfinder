import React from 'react';
import { Link } from '@reach/router';
import { Menu } from 'antd';

function LeftMenu({ mode, activeSide, setActiveSide }) {
  const underlineStyle = activeSide === 'right' ? { borderBottom: 'none' } : null;
  const underlineClass = activeSide === 'right' ? 'no-underline' : null;

  return (
    <Menu mode={mode}>
      <Menu.Item key='home' onClick={() => setActiveSide('left')} style={underlineStyle} className={underlineClass}>
        <Link to='/'>Home</Link>
      </Menu.Item>
      <Menu.Item
        key='search-pets'
        onClick={() => setActiveSide('left')}
        style={underlineStyle}
        className={underlineClass}
      >
        <Link to='/search'>Search Pets</Link>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
