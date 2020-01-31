import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Typography,
  Divider,
  Button,
  notification,
  Tooltip,
  Drawer,
  Popover,
  Popconfirm,
  Icon,
  Layout,
  Tag,
  Row,
  Col,
  message,
} from 'antd';
import ImageGallery from 'react-image-gallery';
import LeafletMap from './LeafletMap';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';
import { toastActions } from '../../redux/toast';
import { navigate } from '@reach/router';
import EditPetInfoForm from './EditPetInfoForm';
import EditPetContactModal from './EditPetContactModal';
import EmailModal from './EmailModal';
import apiClient from '../../utils/apiClient';
message.config({ maxCount: 1 });

const { Content } = Layout;

const getProp = (obj, path) => path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

const isCloudinaryImageUrl = url => (url && url.includes('res.cloudinary') ? true : false);

const getImageThumb = originalUrl => {
  const transformations = 'w_100,h_100';
  const [first, last] = originalUrl.split('upload/');
  const thumb = `${first.trim()}/upload/${transformations}/${last.trim()}`;
  return thumb;
};

function LikedByUsersList({ users }) {
  const listStyle = {
    listStyleType: 'none',
    marginBottom: '2px',
  };
  const itemStyle = {
    fontSize: '16px',
  };

  return (
    <ul style={listStyle}>
      {users
        ? users.map(({ id, username }) => (
            <li style={itemStyle} key={id}>
              <Icon type='user' style={{ marginRight: '4px' }} />
              <span>{username}</span>
            </li>
          ))
        : null}
    </ul>
  );
}

function PetSingle({ arr, id }) {
  const dispatch = useDispatch();
  const petId = Number.parseInt(id, 10);
  const currentPet = useSelector(state => getProp(state, arr).find(p => p.id === petId));
  const isAuthenticated = useSelector(state => state.identity.isAuthenticated);
  const user = useSelector(state => state.identity.user);
  const sendingEmail = useSelector(state => state.identity.sendingEmail);
  const [pet, setPet] = useState(currentPet);
  const editContactRef = useRef(null);
  const emailModalRef = useRef(null);

  const handleLikePet = () => {
    dispatch(identityActions.likeAnimal({ animalId: pet.id, user }));
  };
  const handleUnlikePet = () => {
    dispatch(identityActions.unlikeAnimal({ animalId: pet.id, user }));
  };

  useEffect(() => {
    let isMounted = true;

    async function checkPetCache() {
      if (!pet) {
        try {
          const result = await apiClient.get(`animals/${petId}`);
          if (isMounted) {
            setPet(result.animal);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }

    checkPetCache();

    return () => {
      isMounted = false;
    };
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

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const showEmailModal = () => setEmailModalVisible(true);
  const closeEmailModal = () => setEmailModalVisible(false);

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

  const handleSendEmailSuccess = () => {
    const emailModalForm = emailModalRef.current;
    emailModalForm.validateFields(async (err, values) => {
      if (err) return;
      try {
        const obj = { ...values, to: pet.email };
        await dispatch(identityActions.sendContactEmail(obj));
        setEmailModalVisible(false);
        dispatch(toastActions.addToast({ type: 'success', msg: 'Contact Email Sent' }));
        emailModalForm.resetFields();
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
  const goodWithList = ['Cats', 'Dogs', 'Kids'];

  const goodWithProvided = pet ? [pet.good_with_cats, pet.good_with_dogs, pet.good_with_kids] : [];
  const attributesProvided = pet
    ? [pet.house_trained, pet.declawed, pet.spayed_neutered, pet.special_needs, pet.vaccinated]
    : [];

  const petGoodWith = goodWithList.filter((elm, idx) => goodWithProvided[idx] && elm);
  const petAttributes = attributesList.filter((elm, idx) => attributesProvided[idx] && elm);

  return (
    <>
      <Drawer
        title='Edit Pet Information'
        width={720}
        onClose={closeEditDrawer}
        visible={editDrawerVisible}
        bodyStyle={{ paddingBottom: 40 }}
      >
        <EditPetInfoForm pet={pet} />
      </Drawer>

      <EditPetContactModal
        ref={editContactRef}
        visible={editModalVisible}
        onCancel={closeEditModal}
        onOk={handleEditContactSuccess}
        pet={pet}
      />

      <EmailModal
        ref={emailModalRef}
        visible={emailModalVisible}
        onCancel={closeEmailModal}
        onOk={handleSendEmailSuccess}
        pet={pet}
        sendingEmail={sendingEmail}
        isAuthenticated={isAuthenticated}
      />

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
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
              <Row>
                <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                  <Card style={{ borderRadius: 20, marginTop: '1rem', position: 'relative' }}>
                    {pet.mine && (
                      <Tooltip title='Edit Pet Info'>
                        <Button
                          type='primary'
                          icon='edit'
                          size='large'
                          onClick={showEditDrawer}
                          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                    )}

                    {isAuthenticated ? (
                      pet.liked ? (
                        <Tooltip title='unlike pet'>
                          <Button
                            type='danger'
                            shape='circle'
                            size='large'
                            style={{ marginBottom: '8px', marginRight: '8px' }}
                            onClick={handleUnlikePet}
                          >
                            <Icon type='heart' theme='twoTone' twoToneColor='#eb2f96' style={{ fontSize: 20 }} />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title='like pet'>
                          <Button
                            type='danger'
                            ghost
                            shape='circle'
                            size='large'
                            style={{ marginBottom: '8px', marginRight: '8px' }}
                            onClick={handleLikePet}
                          >
                            <Icon type='heart' style={{ fontSize: 20 }} />
                          </Button>
                        </Tooltip>
                      )
                    ) : (
                      <Tooltip title='like pet'>
                        <Button
                          type='danger'
                          ghost
                          shape='circle'
                          size='large'
                          style={{ marginBottom: '8px', marginRight: '8px' }}
                          onClick={() => message.warn('Please login to like a pet')}
                        >
                          <Icon type='heart' style={{ fontSize: 20 }} />
                        </Button>
                      </Tooltip>
                    )}

                    {!!pet.likes_count && (
                      <Popover content={<LikedByUsersList users={pet.liked_by} />} title='Liked By'>
                        <span
                          style={{
                            backgroundColor: '#f8f8f8',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '18px',
                          }}
                        >
                          likes: <strong>{pet.likes_count}</strong>
                        </span>
                      </Popover>
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
                      <Txt>{pet.age}</Txt> <Dot /> <Txt>{pet.gender}</Txt> <Dot /> <Txt>{pet.size}</Txt>
                      <Divider />
                    </div>

                    <div>
                      <div style={{ marginBottom: '2rem' }}>
                        <Title level={3}>About</Title>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <Txt strong>Coat Length: </Txt> <Txt>{pet.coat_length}</Txt>
                      </div>

                      {petAttributes && petAttributes.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt strong>Attributes: </Txt>
                          {petAttributes.map((item, idx) => (
                            <span key={item}>
                              <Txt>{item}</Txt> {idx < petAttributes.length - 1 && <Dot />}
                            </span>
                          ))}
                        </div>
                      )}

                      {petGoodWith && petGoodWith.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt strong>Good In Home With: </Txt>
                          {petGoodWith.map((item, idx) => (
                            <span key={item}>
                              <Txt>{item}</Txt> {idx < petGoodWith.length - 1 && <Dot />}
                            </span>
                          ))}
                        </div>
                      )}

                      {pet.colors && pet.colors.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt style={{ marginBottom: '1rem' }}>
                            <Txt strong>Colors: </Txt>
                            {pet.colors.map(c => (
                              <span key={c}>{c}</span>
                            ))}
                          </Txt>
                        </div>
                      )}

                      {pet.tags && pet.tags.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt style={{ marginBottom: '1rem' }}>
                            <Txt strong>Tags: </Txt>
                            {pet.tags.map(t => (
                              <Tag key={t} color='purple'>
                                {t}
                              </Tag>
                            ))}
                          </Txt>
                        </div>
                      )}

                      {pet.description && (
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt strong>Description: </Txt> <Txt>{pet.description}</Txt>
                        </div>
                      )}

                      <div style={{ marginBottom: '1rem' }}>
                        <Txt strong>Status: </Txt>
                        <Tag color={pet.adopted ? 'Adopted' : 'green'}>{pet.adopted ? 'Adopted' : 'Adoptable'}</Tag>
                      </div>

                      {pet && pet.mine && (
                        <Tooltip title='Delete pet' placement='bottom'>
                          <Popconfirm
                            title='Are you sure？'
                            okText='Yes'
                            icon={<Icon type='warning' style={{ color: 'red' }} />}
                            onConfirm={handleDeletePet}
                          >
                            <Button
                              type='danger'
                              icon='delete'
                              size='large'
                              style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        </Tooltip>
                      )}

                      {!pet.adopted && !pet.mine && (
                        <Button onClick={handleAdoptPet} type='primary' size='large'>
                          Adopt a pet
                        </Button>
                      )}
                    </div>

                    {pet.chip_id && (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt strong>Microchip ID: </Txt> <Txt>{pet.chip_id}</Txt>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <Txt strong>Microchip Brand: </Txt> <Txt>{pet.chip_brand}</Txt>
                        </div>
                        {pet.chip_location && (
                          <div style={{ marginBottom: '1rem' }}>
                            <Txt strong>Microchip Location: </Txt> <Txt>{pet.chip_location}</Txt>
                          </div>
                        )}
                        {pet.chip_description && (
                          <div style={{ marginBottom: '1rem' }}>
                            <Txt strong>Microchip Description: </Txt> <Txt>{pet.chip_description}</Txt>
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                </Col>

                {pet && (
                  <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                    <Card className='contact-card' title={`Ask about ${pet.name}`}>
                      <Button
                        type='primary'
                        size='large'
                        style={{ borderRadius: 20, width: '100%' }}
                        onClick={showEmailModal}
                      >
                        Email the owner
                      </Button>
                    </Card>
                  </Col>
                )}

                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Card className='contact-card' title='Adoption Contact Information'>
                    {pet && pet.mine && (
                      <Tooltip title='Edit Contact Info'>
                        <Button
                          type='primary'
                          shape='circle'
                          ghost
                          icon='edit'
                          size='large'
                          onClick={showEditModal}
                          style={{ position: 'absolute', top: '0.5rem', right: '1rem' }}
                        />
                      </Tooltip>
                    )}

                    {pet && (
                      <div>
                        <div style={{ marginBottom: '1rem' }}>
                          <span>
                            <Icon
                              type='phone'
                              theme='twoTone'
                              twoToneColor='green'
                              style={{ fontSize: '24px', marginRight: '6px' }}
                            />
                            <Txt strong>Contact Phone: </Txt> <Txt>{pet.phone}</Txt>
                          </span>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <span>
                            <Icon
                              type='mail'
                              theme='twoTone'
                              twoToneColor='red'
                              style={{ fontSize: '24px', marginRight: '6px' }}
                            />
                            <Txt strong>E-Mail: </Txt> <Txt>{pet.email}</Txt>
                          </span>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <span>
                            <Icon
                              type='bank'
                              theme='twoTone'
                              twoToneColor='purple'
                              style={{ fontSize: '24px', marginRight: '6px' }}
                            />
                            <Txt strong>Country: </Txt> <Txt>{pet.country}</Txt>
                          </span>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <span>
                            <Icon
                              type='home'
                              theme='twoTone'
                              twoToneColor='orange'
                              style={{ fontSize: '24px', marginRight: '6px' }}
                            />
                            <Txt strong>City: </Txt> <Txt>{pet.city}</Txt>
                          </span>
                        </div>
                        <div>
                          <span>
                            <Icon
                              type='environment'
                              theme='twoTone'
                              twoToneColor='blue'
                              style={{ fontSize: '24px', marginRight: '6px' }}
                            />
                            <Txt strong>Address: </Txt> <Txt>{pet.address}</Txt>
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            )}

            <Row>
              <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                {pet && <LeafletMap zoom={16} lat={pet.lat} lng={pet.lng} name={pet.name} />}
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
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
  return <span style={{ fontSize: 20, display: 'inline-flex', margin: '0px 6px' }}>&bull;</span>;
}

export default PetSingle;
