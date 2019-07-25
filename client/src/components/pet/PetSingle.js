import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'react-redux';
import ImageGallery from 'react-image-gallery';

function PetSingle(props) {
  const pet = useSelector(state => state.identity.pets[props.id - 1]);
  const images = pet.images.split(',').map(img => {
    const transformations = 'w_100,h_100';
    const [first, last] = img.split('upload/');
    const thumb = `${first.trim()}/upload/${transformations}/${last.trim()}`;

    return {
      original: img,
      thumbnail: thumb,
    };
  });

  return (
    <div>
      <ImageGallery items={images} autoPlay={true} slideInterval={4000} />
      <Card>{pet.name}</Card>
    </div>
  );
}

export default PetSingle;
