import React, { useEffect } from 'react';
import PetsList from '../../../components/pet/PetsList';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../../redux/identity';

function LikedPets() {
  const dispatch = useDispatch();
  const pets = useSelector(state => state.identity.likedPets);

  useEffect(() => {
    if (!pets.length) {
      dispatch(identityActions.fetchLikedPets());
    }
  }, [dispatch, pets.length]);

  return (
    <div>
      <PetsList pets={pets} />
    </div>
  );
}

export default LikedPets;
