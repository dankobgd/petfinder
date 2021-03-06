import React from 'react';
import { Link } from '@reach/router';
import { Card, Icon, Tooltip, message, Skeleton } from 'antd';
import LazyLoad from 'react-lazyload';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';

message.config({ maxCount: 1 });

const placeholder = (
  <Skeleton className='pet-card-skeleton' active avatar={{ shape: 'square' }} paragraph={{ rows: 4 }} />
);

function PetCard({ pet, linkPrefix }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.identity.isAuthenticated);
  const user = useSelector(state => state.identity.user);

  const handleLikePet = () => {
    dispatch(identityActions.likeAnimal({ animalId: pet.id, user }));
  };
  const handleUnlikePet = () => {
    dispatch(identityActions.unlikeAnimal({ animalId: pet.id, user }));
  };

  return (
    <LazyLoad key={pet.id} height={'100%'} offset={100} placeholder={placeholder} throttle={500}>
      <Card
        style={{ height: '100%', borderRadius: 20 }}
        cover={
          <Link key={pet.id} to={`${linkPrefix && linkPrefix}${pet.id}/${pet.name}`}>
            <img
              alt={pet.name}
              src={pet.image_url}
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }}
            />
          </Link>
        }
      >
        <Card.Meta title={pet.name} description={pet.primary_breed} />
        <div style={{ paddingTop: '6px ', position: 'relative' }}>
          <span>
            {pet.gender} - {pet.age}
          </span>

          {!!pet.likes_count && (
            <span style={{ position: 'absolute', top: 0, right: 0 }}>
              likes: <strong>{pet.likes_count}</strong>
            </span>
          )}

          {isAuthenticated ? (
            pet.liked ? (
              <Tooltip title='unlike pet'>
                <Icon
                  type='heart'
                  theme='twoTone'
                  twoToneColor='#eb2f96'
                  style={{ position: 'absolute', bottom: '100%', right: 0, fontSize: '24px' }}
                  onClick={handleUnlikePet}
                />
              </Tooltip>
            ) : (
              <Tooltip title='like pet'>
                <Icon
                  type='heart'
                  style={{ position: 'absolute', bottom: '100%', right: 0, fontSize: '24px' }}
                  onClick={handleLikePet}
                />
              </Tooltip>
            )
          ) : (
            <Tooltip title='like pet'>
              <Icon
                type='heart'
                style={{ position: 'absolute', bottom: '100%', right: 0, fontSize: '24px' }}
                onClick={() => message.warn('Please login to like a pet')}
              />
            </Tooltip>
          )}
        </div>
      </Card>
    </LazyLoad>
  );
}

export default PetCard;
