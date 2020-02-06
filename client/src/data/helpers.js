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
      'Small & Furry': smallAndFurry.colors,
      'Aquatic & Reptiles': aquaticAndReptiles.colors,
    }[type]);

  const breedsMap = type =>
    ({
      Dog: dogs.breeds,
      Cat: cats.breeds,
      Rabbit: rabbits.breeds,
      Bird: getBreedsList(birds, petSpecies),
      'Small & Furry': getBreedsList(smallAndFurry, petSpecies),
      'Aquatic & Reptiles': getBreedsList(aquaticAndReptiles, petSpecies),
    }[type]);

  const speciesMap = type =>
    ({
      Bird: getSpeciesList(birds, petSpecies),
      'Small & Furry': getSpeciesList(smallAndFurry, petSpecies),
      'Aquatic & Reptiles': getSpeciesList(aquaticAndReptiles, petSpecies),
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

const isCommonAnimal = t => t && t.match(/Cat|Dog|Rabbit/g);

export { renderAutocompleteOpts, getAutocompleteList, isCommonAnimal };
