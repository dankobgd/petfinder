import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from '@reach/router';
import ProfileRoutes from './ProfileRoutes';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

const generateBreadCrumbs = pathString => {
  const parts = pathString.split('/');
  parts.shift();
  return parts.map(p => <Breadcrumb.Item key={p}>{p}</Breadcrumb.Item>);
};

function Profile() {
  const user = useSelector(state => state.identity.user);

  return (
    <Layout style={{ minHeight: 'calc(100vh - 78px)' }}>
      <Sider breakpoint='lg' collapsedWidth='0' style={{ background: '#fff' }}>
        <Menu mode='inline' style={{ height: '100%', borderRight: 0 }} defaultSelectedKeys={['profile']}>
          <Menu.Item key='profile'>
            <Link to='.'>
              <span>
                <Icon type='profile' />
                Profile
              </span>
            </Link>
          </Menu.Item>
          <SubMenu
            key='pets'
            title={
              <span>
                <Icon type='laptop' />
                Pets Listing
              </span>
            }
          >
            <Menu.Item key='add'>
              <Link to='add_pet'>Add Pet</Link>
            </Menu.Item>
            <Menu.Item key='created'>
              <Link to='created'>Posted pets</Link>
            </Menu.Item>
            <Menu.Item key='liked'>
              <Link to='liked'>Liked Pets</Link>
            </Menu.Item>
            <Menu.Item key='adopted'>
              <Link to='adopted'>Adopted Pets</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key='settings'
            title={
              <span>
                <Icon type='setting' />
                Settings
              </span>
            }
          >
            <Menu.Item key='account'>
              <Link to='account'>Account</Link>
            </Menu.Item>
            <Menu.Item key='password'>
              <Link to='change_password'>Change Password</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <Typography.Text strong>{user.username}</Typography.Text>
          </Breadcrumb.Item>
          {generateBreadCrumbs(window.location.pathname)}
        </Breadcrumb>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <ProfileRoutes />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Profile;
