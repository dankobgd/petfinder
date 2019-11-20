import React from 'react';
import { Link } from '@reach/router';
import { Card } from 'antd';

function PetCard({ pet, linkPrefix }) {
  return (
    <Link key={pet.id} to={`${linkPrefix && linkPrefix}${pet.id}/${pet.name}`}>
      <Card
        style={{ height: '100%', borderRadius: 20 }}
        cover={
          <img
            alt={pet.name}
            src={pet.image_url}
            style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }}
          />
        }
      >
        <Card.Meta title={pet.name} description={pet.primary_breed} />
        <div style={{ paddingTop: '6px ' }}>
          <span>
            {pet.gender} - {pet.age}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default PetCard;
