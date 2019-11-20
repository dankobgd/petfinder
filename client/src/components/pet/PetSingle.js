import React from 'react';
import { Card, Typography, Divider } from 'antd';
import ImageGallery from 'react-image-gallery';
import LeafletMap from './LeafletMap';

const getImageThumb = originalUrl => {
  const transformations = 'w_100,h_100';
  const [first, last] = originalUrl.split('upload/');
  const thumb = `${first.trim()}/upload/${transformations}/${last.trim()}`;
  return thumb;
};

function isCloudinaryImageUrl(url) {
  return url.includes('res.cloudinary');
}

function Txt({ children, style, ...rest }) {
  return (
    <Typography.Text style={{ fontSize: 18, ...style }} {...rest}>
      {children}
    </Typography.Text>
  );
}

function Title({ children, style, ...rest }) {
  return (
    <Typography.Title style={style} {...rest}>
      {children}
    </Typography.Title>
  );
}

function Dot() {
  return <>&bull;</>;
}

function PetSingle({ pet }) {
  let galleryImages = [];

  if (!pet.images) {
    galleryImages.push({
      original: pet.image_url,
      thumbnail: isCloudinaryImageUrl ? getImageThumb(pet.image_url) : pet.image_url,
    });
  } else {
    pet.images.forEach(img => {
      galleryImages.push({
        original: img,
        thumbnail: getImageThumb(img),
      });
    });
  }

  const attributesList = ['House Trained', 'Declawed', 'Spayed/Neutered', 'Special Needs', 'Vaccinated'];
  const goodWithList = ['Other Cats', 'Dogs', 'Kids'];

  const goodWithProvided = [pet.good_with_cats, pet.good_with_dogs, pet.good_with_kids];
  const attributesProvided = [pet.house_trained, pet.declawed, pet.spayed_neutered, pet.special_needs, pet.vaccinated];

  const petGoodWith = goodWithList.filter((elm, idx) => goodWithProvided[idx]);
  const petAttributes = attributesList.filter((elm, idx) => attributesProvided[idx]);

  return (
    <div>
      <ImageGallery
        showPlayButton={galleryImages.length !== 1}
        items={galleryImages}
        autoPlay={true}
        slideInterval={5000}
      />

      <Card style={{ borderRadius: 20, marginTop: '1rem' }}>
        <div>
          <Title level={1}>{pet.name}</Title>
        </div>
        <div>
          {pet.primaryBreed && <Txt strong>{pet.primaryBreed}</Txt>}
          {pet.secondaryBreed && <Txt secondary> &#38; {pet.secondaryBreed}</Txt>}
          {pet.unkownBreed && <Txt secondary>Unkown Breed</Txt>}
        </div>

        <div>
          <Divider />
          <Txt>{pet.age}</Txt> <Dot />
          <Txt>{pet.gender}</Txt> <Dot />
          <Txt>{pet.size}</Txt>
          <Divider />
        </div>

        <div>
          <div style={{ marginBottom: '2rem' }}>
            <Typography.Title level={3}>About</Typography.Title> {'\n'}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Coat Length</Txt> <Txt>{pet.coatLength}</Txt>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Attributes: </Txt>
            {petAttributes.map((item, idx) => (
              <React.Fragment key={item}>
                <Txt>{item}</Txt>{' '}
                {idx !== petAttributes.length - 1 && (
                  <>
                    <Dot />{' '}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Good In Home With: </Txt>
            {petGoodWith.map((item, idx) => (
              <React.Fragment key={item}>
                <Txt>{item}</Txt>{' '}
                {idx !== petGoodWith.length - 1 && (
                  <>
                    <Dot />{' '}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Colors: </Txt> <Txt>{pet.colors}</Txt>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Tags: </Txt> <Txt>{pet.tags}</Txt>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Description</Txt> <Txt>{pet.description}</Txt>
          </div>
        </div>

        <Card>
          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Contact Phone: </Txt> <Txt>{pet.phone}</Txt>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>Country: </Txt> <Txt>{pet.country}</Txt>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Txt strong>City: </Txt> <Txt>{pet.city}</Txt>
          </div>
          <div>
            <Txt strong>Address: </Txt> <Txt>{pet.address}</Txt>
          </div>
        </Card>

        <LeafletMap zoom={16} lat={pet.lat} lng={pet.lng} name={pet.name} />
      </Card>
    </div>
  );
}

export default PetSingle;
