import React from 'react';
import { useSelector } from 'react-redux';
import PetSingle from '../../components/pet/PetSingle';

function PetPage(props) {
  const pet = useSelector(state => state.identity[props.arr].find(p => p.id === Number.parseInt(props.id, 10)));

  return (
    <div>
      <PetSingle pet={pet} />
    </div>
  );
}

export default PetPage;
