import React from 'react';
import { Select } from 'antd';
import { cats, dogs, rabbits, birds, aquaticAndReptiles, smallAndFurry } from './pets';

const getBreedsList = (petType, petSpecies) => {
  if (!petSpecies) return [];
  const elm = petType.collection.find(x => x.species === petSpecies);
  if (!elm) return [];
  return elm.breed;
};

const getSpeciesList = petType => petType.collection.map(x => x.species);

const getAutocompleteList = (petType, petSpecies) => field => {
  const colorsMap = type =>
    ({
      Dog: dogs.colors,
      Cat: cats.colors,
      Rabbit: rabbits.colors,
      Bird: birds.colors,
      SmallAndFurry: smallAndFurry.colors,
      AquaticAndReptiles: aquaticAndReptiles.colors,
    }[type]);

  const breedsMap = type =>
    ({
      Dog: dogs.breeds,
      Cat: cats.breeds,
      Rabbit: rabbits.breeds,
      Bird: getBreedsList(birds, petSpecies),
      SmallAndFurry: getBreedsList(smallAndFurry, petSpecies),
      AquaticAndReptiles: getBreedsList(aquaticAndReptiles, petSpecies),
    }[type]);

  const speciesMap = type =>
    ({
      Bird: getSpeciesList(birds, petSpecies),
      SmallAndFurry: getSpeciesList(smallAndFurry, petSpecies),
      AquaticAndReptiles: getSpeciesList(aquaticAndReptiles, petSpecies),
    }[type]);

  let list;
  if (field === 'colors') list = colorsMap;
  if (field === 'breeds') list = breedsMap;
  if (field === 'species') list = speciesMap;

  return list(petType);
};

const renderAutocompleteOpts = (petType, petSpecies) => field => {
  const list = getAutocompleteList(petType, petSpecies)(field);

  return list
    ? list.map(item => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))
    : null;
};

export { renderAutocompleteOpts, getAutocompleteList };
