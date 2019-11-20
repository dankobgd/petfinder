import React from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import PetSingle from '../components/pet/PetSingle';

function Pet(props) {
  const pet = useSelector(state => state.pets.list.find(p => p.id === Number.parseInt(props.id, 10)));

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Layout.Content
        style={{
          background: '#fff',
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <PetSingle pet={pet} />
      </Layout.Content>
    </Layout>
  );
}

export default Pet;
