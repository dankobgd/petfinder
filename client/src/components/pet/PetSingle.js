import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Divider, Button, notification, Tooltip, Drawer, Popconfirm, Icon } from 'antd';
import ImageGallery from 'react-image-gallery';
import LeafletMap from './LeafletMap';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';
import { toastActions } from '../../redux/toast';
import { navigate } from '@reach/router';
import EditPetInfoForm from './EditPetInfoForm';
import EditPetContactModal from './EditPetContactModal';
import apiClient from '../../utils/apiClient';

const getProp = (obj, path) => path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

const isCloudinaryImageUrl = url => (url && url.includes('res.cloudinary') ? true : false);

const getImageThumb = originalUrl => {
  const transformations = 'w_100,h_100';
  const [first, last] = originalUrl.split('upload/');
  const thumb = `${first.trim()}/upload/${transformations}/${last.trim()}`;
  return thumb;
};

function PetSingle({ arr, id }) {
  const dispatch = useDispatch();
  const petId = Number.parseInt(id, 10);
  const currentPet = useSelector(state => getProp(state, arr).find(p => p.id === petId));
  const [pet, setPet] = useState(currentPet);
  const editContactRef = useRef(null);

  useEffect(() => {
    async function checkPetCache() {
      if (!pet) {
        try {
          const result = await apiClient.get(`animals/${petId}`);
          setPet(result.animal);
        } catch (err) {
          console.error(err);
        }
      }
    }
    checkPetCache();
  }, [pet, petId]);

  useEffect(() => {
    setPet(currentPet);
  }, [currentPet]);

  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const showEditModal = () => setEditModalVisible(true);
  const closeEditModal = () => setEditModalVisible(false);
  const showEditDrawer = () => setEditDrawerVisible(true);
  const closeEditDrawer = () => setEditDrawerVisible(false);

  const handleEditContactSuccess = () => {
    const editContactForm = editContactRef.current;
    editContactForm.validateFields((err, values) => {
      if (err) return;
      try {
        dispatch(identityActions.updatePetContact(petId, values));
        editContactForm.resetFields();
        setEditModalVisible(false);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleDeletePet = async () => {
    try {
      navigate('/');
      dispatch(toastActions.addToast({ type: 'success', msg: 'Pet deleted' }));
      await dispatch(identityActions.deletePet(pet.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdoptPet = async () => {
    try {
      await dispatch(identityActions.adoptAnimal(pet.id));
      dispatch(identityActions.fetchAdoptedPets());
      navigate('/profile/adopted');
      sendAdoptedPetNotification('success', pet.name);
    } catch (err) {
      sendAlreadyAdoptedError();
    }
  };

  const sendAlreadyAdoptedError = () => {
    notification['error']({
      message: 'Pet already adapted error',
      description: 'Looks like somone was bit faster than you :c try with other fellas',
      duration: 0,
    });
  };

  const sendAdoptedPetNotification = (type, name) => {
    notification[type]({
      message: 'Pet Adopted',
      description: `You adopted ${name} successfully! Enjoy the company of your new friend.`,
    });
  };

  let galleryImages = [];

  if (pet) {
    if (!pet.images) {
      galleryImages.push({
        original: pet.image_url,
        thumbnail: isCloudinaryImageUrl(pet.image_url) ? getImageThumb(pet.image_url) : pet.image_url,
      });
    } else {
      pet.images.forEach(img => {
        galleryImages.push({
          original: img,
          thumbnail: getImageThumb(img),
        });
      });
    }
  }

  const attributesList = ['House Trained', 'Declawed', 'Spayed/Neutered', 'Special Needs', 'Vaccinated'];
  const goodWithList = ['Other Cats', 'Dogs', 'Kids'];

  const goodWithProvided = pet ? [pet.good_with_cats, pet.good_with_dogs, pet.good_with_kids] : [];
  const attributesProvided = pet
    ? [pet.house_trained, pet.declawed, pet.spayed_neutered, pet.special_needs, pet.vaccinated]
    : [];

  const petGoodWith = goodWithList.filter((elm, idx) => goodWithProvided[idx]);
  const petAttributes = attributesList.filter((elm, idx) => attributesProvided[idx]);

  return (
    <>
      {/* EDIT PET INFO DRAWER */}
      <Drawer
        title='Edit Pet Information'
        width={720}
        onClose={closeEditDrawer}
        visible={editDrawerVisible}
        bodyStyle={{ paddingBottom: 40 }}
      >
        <EditPetInfoForm pet={pet} />
      </Drawer>

      {/* EDIT PET CONTACT MODAL */}
      <EditPetContactModal
        ref={editContactRef}
        visible={editModalVisible}
        onCancel={closeEditModal}
        onUpdate={handleEditContactSuccess}
        pet={pet}
      />

      <div>
        {pet && (
          <ImageGallery
            showPlayButton={galleryImages.length !== 1}
            showThumbnails={galleryImages.length !== 1}
            items={galleryImages}
            autoPlay={true}
            slideInterval={5000}
          />
        )}

        {pet && (
          <Card style={{ borderRadius: 20, marginTop: '1rem' }}>
            {pet.mine && (
              <Tooltip title='Edit Pet Info'>
                <Button type='primary' shape='circle' icon='edit' size='large' onClick={showEditDrawer} />
              </Tooltip>
            )}

            {pet.mine && (
              <Tooltip title='Delete pet'>
                <Popconfirm
                  title='Are you sure？'
                  okText='Yes'
                  icon={<Icon type='delete' style={{ color: 'red' }} />}
                  onConfirm={handleDeletePet}
                >
                  <Button type='primary' shape='circle' icon='delete' size='large' />
                </Popconfirm>
              </Tooltip>
            )}

            <div>
              <Title level={1}>{pet.name}</Title>
            </div>
            <div>
              {pet.primary_breed && <Txt strong>{pet.primary_breed}</Txt>}
              {pet.secondary_breed && <Txt type='secondary'> &#38; {pet.secondary_breed}</Txt>}
              {pet.unkown_breed && <Txt type='secondary'>Unkown Breed</Txt>}
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
                <Txt strong>Coat Length</Txt> <Txt>{pet.coat_length}</Txt>
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

              {pet.tags && (
                <Txt style={{ marginBottom: '1rem' }}>
                  <Txt strong>Tags: </Txt> <Txt>{pet.tags}</Txt>
                </Txt>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <Txt strong>Description</Txt> <Txt>{pet.description}</Txt>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Txt strong>Status</Txt> <Txt>{pet.adopted ? 'Adopted' : 'Adoptable'}</Txt>
              </div>
              {!pet.adopted && !pet.mine && (
                <Button onClick={handleAdoptPet} type='primary'>
                  Adopt a pet
                </Button>
              )}
            </div>

            <Card>
              {pet.mine && (
                <Tooltip title='Edit Contact Info'>
                  <Button type='primary' shape='circle' icon='edit' size='large' onClick={showEditModal} />
                </Tooltip>
              )}
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

            {pet && <LeafletMap zoom={16} lat={pet.lat} lng={pet.lng} name={pet.name} />}
          </Card>
        )}
      </div>
    </>
  );
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

export default PetSingle;
