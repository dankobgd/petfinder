import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Drawer, Button, Icon } from 'antd';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import './navbar.css';

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSide, setActiveSide] = useState('left');

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav className='menu' style={{ overflow: 'hidden' }}>
      <div className='menu__logo'>
        <Link to='/'>Petfinder</Link>
      </div>
      <div className='menu__container'>
        <div className='menu_left'>
          <LeftMenu mode='horizontal' activeSide={activeSide} setActiveSide={setActiveSide} />
        </div>
        <div className='menu_rigth'>
          <RightMenu mode='horizontal' activeSide={activeSide} setActiveSide={setActiveSide} />
        </div>
        <Button className='menu__mobile-button' type='primary' onClick={showDrawer}>
          <Icon type='align-right' />
        </Button>
        <Drawer
          title='Menu'
          placement='right'
          className='menu_drawer'
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode='inline' />
          <RightMenu mode='inline' />
        </Drawer>
      </div>
    </nav>
  );
}

export default Navbar;
