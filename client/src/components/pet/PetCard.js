import React from 'react';
import { Card } from 'antd';

function PetCard({ pet }) {
  return (
    <Card
      style={{ height: '100%' }}
      cover={<img alt={pet.name} src={pet.imageUrl} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />}
    >
      <Card.Meta title={pet.name} description={pet.primaryBreed} />
      <div style={{ paddingTop: '6px ' }}>
        <span>
          {pet.gender} - {pet.age}
        </span>
      </div>
    </Card>
  );
}

export default PetCard;
