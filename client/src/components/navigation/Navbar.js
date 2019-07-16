import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Drawer, Button, Icon } from 'antd';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import s from './styles.module.css';

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
    <nav className={s.navigation}>
      <div className={s.nav_wrapper}>
        <div className={s.logo}>
          <Link to='/'>Petfinder</Link>
        </div>

        <div className={s.menu_outer}>
          <div className={s.left_menu}>
            <LeftMenu mode='horizontal' activeSide={activeSide} setActiveSide={setActiveSide} />
          </div>
          <div className={s.right_menu}>
            <RightMenu mode='horizontal' activeSide={activeSide} setActiveSide={setActiveSide} />
          </div>

          <div className={s.hamburger}>
            <Button onClick={showDrawer}>
              <Icon type='align-right' />
            </Button>
          </div>
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
      </div>
    </nav>
  );
}

export default Navbar;
