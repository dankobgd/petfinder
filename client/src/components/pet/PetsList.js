import React from 'react';
import { Link } from '@reach/router';
import { Row, Col, Empty, Typography } from 'antd';
import PetCard from './PetCard';

function PetsList({ pets }) {
  return (
    <Row gutter={16} type='flex'>
      {pets.length ? (
        pets.map(pet => (
          <Col key={pet.id} xs={24} sm={12} md={8} lg={8} xl={6} style={{ height: '100%' }}>
            <Link key={pet.id} to={`${pet.id}/${pet.name}`}>
              <PetCard pet={pet} />
            </Link>
          </Col>
        ))
      ) : (
        <Col span={24}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Typography.Text strong>No Pets Found</Typography.Text>}
          />
        </Col>
      )}
    </Row>
  );
}

export default PetsList;
