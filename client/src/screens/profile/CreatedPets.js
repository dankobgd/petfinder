import React, { useEffect } from 'react';
import PetsList from '../../components/pet/PetsList';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';
import { Tabs, Icon } from 'antd';

function CreatedPets() {
  const dispatch = useDispatch();
  const pets = useSelector(state => state.identity.pets);
  const adopted = pets.filter(p => p.status === 'Adopted');
  const adoptable = pets.filter(p => p.status === 'Adoptable');

  useEffect(() => {
    if (!pets.length) {
      dispatch(identityActions.fetchUsersPets());
    }
  }, [dispatch, pets.length]);

  return (
    <div>
      <Tabs defaultActiveKey='all'>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type='fire' />
              All
            </span>
          }
          key='all'
        >
          <PetsList pets={pets} />
        </Tabs.TabPane>
        <Tabs.TabPane
          disabled={!adopted.length}
          tab={
            <span>
              <Icon type='fire' />
              Adopted
            </span>
          }
          key='adopted'
        >
          <PetsList pets={adopted} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <Icon type='fire' />
              Adoptable
            </span>
          }
          key='adoptable'
        >
          <PetsList pets={adoptable} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default CreatedPets;
