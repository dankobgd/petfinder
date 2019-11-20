import React from 'react';
import { Row, Col, Empty, Typography } from 'antd';
import PetCard from './PetCard';

function PetsList({ pets, linkPrefix = '' }) {
  return (
    <Row gutter={16} type='flex'>
      {pets.length ? (
        pets.map(pet => (
          <Col key={pet.id} xs={24} sm={12} md={8} lg={8} xl={6} style={{ height: '100%' }}>
            <PetCard pet={pet} linkPrefix={linkPrefix} />
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
