import React, { useEffect } from 'react';
import PetsList from '../../components/pet/PetsList';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';

function AdoptedPets() {
  const dispatch = useDispatch();
  const pets = useSelector(state => state.identity.adoptedPets);

  useEffect(() => {
    if (!pets.length) {
      dispatch(identityActions.fetchAdoptedPets());
    }
  }, [dispatch, pets.length]);

  return (
    <div>
      <PetsList pets={pets} />
    </div>
  );
}

export default AdoptedPets;
