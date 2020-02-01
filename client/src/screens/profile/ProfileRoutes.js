import React from 'react';
import { Router } from '@reach/router';

import { PrivateRoute } from '../../components/authorization';
import PetSingle from '../../components/pet/PetSingle';
import AddPet from './add-pet';
import { EditAccount, ChangePassword } from './settings';
import { CreatedPets, LikedPets, AdoptedPets } from './pet-listing';
import ProfileInfo from './dashboard';

function ProfileRoutes() {
  return (
    <Router>
      <PrivateRoute path='/' component={ProfileInfo} />
      <PrivateRoute path='add_pet' component={AddPet} />
      <PrivateRoute path='liked' component={LikedPets} />
      <PrivateRoute path='created' component={CreatedPets} />
      <PrivateRoute path='adopted' component={AdoptedPets} />
      <PrivateRoute path='liked/:id/:name' component={p => <PetSingle arr='identity.likedPets' {...p} />} />
      <PrivateRoute path='created/:id/:name' component={p => <PetSingle arr='identity.postedPets' {...p} />} />
      <PrivateRoute path='adopted/:id/:name' component={p => <PetSingle arr='identity.adoptedPets' {...p} />} />
      <PrivateRoute path='account' component={EditAccount} />
      <PrivateRoute path='change_password' component={ChangePassword} />
    </Router>
  );
}

export default ProfileRoutes;
