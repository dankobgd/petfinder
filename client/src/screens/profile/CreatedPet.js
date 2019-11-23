import React from 'react';
import { useSelector } from 'react-redux';
import PetSingle from '../../components/pet/PetSingle';

function CreatedPet(props) {
  const pet = useSelector(state => state.identity.postedPets.find(p => p.id === Number.parseInt(props.id, 10)));

  return (
    <div>
      <PetSingle pet={pet} />
    </div>
  );
}

export default CreatedPet;
