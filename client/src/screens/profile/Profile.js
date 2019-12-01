import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { PrivateRoute } from '../../components/route/Auth';
import { Router, Link } from '@reach/router';
import AddPet from '../../screens/add/AddPet';
import EditAccount from './EditAccount';
import ChangePassword from './ChangePassword';
import CreatedPets from './CreatedPets';
import PetPage from './PetPage';
import LikedPets from './LikedPets';
import AdoptedPets from './AdoptedPets';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

function Profile() {
  const user = useSelector(state => state.identity.user);

  return (
    <Layout style={{ minHeight: 'calc(100vh - 78px)' }}>
      <Sider breakpoint='lg' collapsedWidth='0' style={{ background: '#fff' }}>
        <Menu
          mode='inline'
          defaultSelectedKeys={['add']}
          defaultOpenKeys={['pets', 'settings']}
          style={{ height: '100%', borderRight: 0 }}
        >
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
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Typography.Text strong>{user.username}</Typography.Text>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Router>
            <PrivateRoute path='add_pet' component={AddPet} />
            <PrivateRoute path='liked' component={LikedPets} />
            <PrivateRoute path='created' component={CreatedPets} />
            <PrivateRoute path='adopted' component={AdoptedPets} />
            <PrivateRoute path='liked/:id/:name' component={p => <PetPage arr='likedPets' {...p} />} />
            <PrivateRoute path='created/:id/:name' component={p => <PetPage arr='postedPets' {...p} />} />
            <PrivateRoute path='adopted/:id/:name' component={p => <PetPage arr='adoptedPets' {...p} />} />
            <PrivateRoute path='account' component={EditAccount} />
            <PrivateRoute path='change_password' component={ChangePassword} />
          </Router>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Profile;
