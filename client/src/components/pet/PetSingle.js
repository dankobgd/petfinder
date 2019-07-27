import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'react-redux';
import ImageGallery from 'react-image-gallery';

function getImageThumb(originalUrl) {
  const transformations = 'w_100,h_100';
  const [first, last] = originalUrl.split('upload/');
  const thumb = `${first.trim()}/upload/${transformations}/${last.trim()}`;
  return thumb;
}

function PetSingle(props) {
  const pet = useSelector(state => state.identity.pets[props.id - 1]);
  let galleryImages = [];

  if (!pet.images) {
    galleryImages.push({
      original: pet.imageUrl,
      thumbnail: getImageThumb(pet.imageUrl),
    });
  } else {
    pet.images.split(',').forEach(img => {
      galleryImages.push({
        original: img,
        thumbnail: getImageThumb(img),
      });
    });
  }

  return (
    <div>
      <ImageGallery items={galleryImages} autoPlay={true} slideInterval={4000} />
      <Card>{pet.name}</Card>
    </div>
  );
}

export default PetSingle;
