import React from 'react';
import { Button, Icon } from 'antd';

const btnStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const pinLeft = {
  ...btnStyles,
  marginRight: 'auto',
};
const pinRight = {
  ...btnStyles,
  marginLeft: 'auto',
};

function StepperButtons({ current, total, prevStep, nextStep, onSuccess, loading }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '3rem' }}>
      {current > 0 && (
        <Button type='ghost' size='large' style={pinLeft} onClick={prevStep}>
          <Icon type='left-circle' theme='twoTone' style={{ fontSize: 24 }} />
          <span>Back</span>
        </Button>
      )}

      {current < total - 1 && (
        <Button type='ghost' htmlType='submit' size='large' style={pinRight} onClick={nextStep}>
          <span>Next</span>
          <Icon type='right-circle' theme='twoTone' style={{ fontSize: 24 }} />
        </Button>
      )}

      {current === total - 1 && (
        <Button type='primary' htmlType='submit' size='large' style={pinRight} onClick={onSuccess} disabled={loading}>
          Submit for adoption
        </Button>
      )}
    </div>
  );
}

export default StepperButtons;
