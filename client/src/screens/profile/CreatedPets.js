import React from 'react';
import { Link } from '@reach/router';
import PetCard from '../../components/pet/PetCard';

function CreatedPets() {
  const pets = [{ id: 1, name: 'aaa' }, { id: 2, name: 'bbb' }, { id: 3, name: 'ccc' }, { id: 4, name: 'ddd' }];

  return (
    <div>
      {pets.map(pet => (
        <Link to={`${pet.id}/${pet.name}`}>
          <PetCard />
        </Link>
      ))}
    </div>
  );
}

export default CreatedPets;
