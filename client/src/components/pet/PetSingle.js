import React from 'react';
import { Card } from 'antd';

function PetSingle(props) {
  return (
    <Card>
      ANIMAL - id: {props.id} name: {props.name}
    </Card>
  );
}

export default PetSingle;
