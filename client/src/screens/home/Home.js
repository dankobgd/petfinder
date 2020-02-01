import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';
import { petsActions } from '../../redux/pets';
import PetsList from '../../components/pet/PetsList';

const { Content } = Layout;

function Home() {
  const dispatch = useDispatch();
  const latest = useSelector(state => state.pets.latest);

  useEffect(() => {
    if (!latest || !latest.length) {
      dispatch(petsActions.fetchLatestAnimals());
    }
  }, [dispatch, latest]);

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Content
        style={{
          background: '#fff',
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <h2>latest pets for adoption</h2>
        <div>
          <PetsList pets={latest} linkPrefix='latest/pet/' />
        </div>
      </Content>
    </Layout>
  );
}

export default Home;
