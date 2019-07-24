import React from 'react';
import { Card, Icon, Avatar } from 'antd';

function PetCard() {
  return (
    <Card
      style={{ width: 300 }}
      cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}
      actions={[<Icon type='setting' />, <Icon type='edit' />, <Icon type='ellipsis' />]}
    >
      <Card.Meta
        avatar={<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />}
        title='Card title'
        description='This is the description'
      />
    </Card>
  );
}

export default PetCard;
