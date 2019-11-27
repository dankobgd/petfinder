import React from 'react';
import { Link, navigate } from '@reach/router';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';

function LeftMenu({ mode }) {
  const qs = useSelector(state => state.ui.qs);

  const navigateLink = () => {
    const navigateToPath = qs ? qs : '/search';
    navigate(navigateToPath);
  };

  return (
    <Menu mode={mode}>
      <Menu.Item key='home'>
        <Link to='/'>Home</Link>
      </Menu.Item>
      <Menu.Item key='search' onClick={navigateLink}>
        <span>Search Pets</span>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
