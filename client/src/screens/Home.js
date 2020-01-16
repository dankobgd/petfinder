import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { petsActions } from '../redux/pets';
import PetsList from '../components/pet/PetsList';

function Home() {
  const dispatch = useDispatch();
  const latest = useSelector(state => state.pets.latest);

  useEffect(() => {
    if (!latest || !latest.length) {
      dispatch(petsActions.fetchLatestAnimals());
    }
  }, [dispatch, latest]);

  return (
    <div>
      <h2>latest pets for adoption</h2>
      <div>
        <PetsList pets={latest} linkPrefix='latest/pet/' />
      </div>
    </div>
  );
}

export default Home;
