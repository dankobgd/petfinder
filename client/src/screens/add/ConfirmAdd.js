import React from 'react';
import { Button, Icon, message } from 'antd';

function ConfirmAdd(props) {
  return (
    <div>
      <div>Success, do you wish to add a new pet for adoption</div>
      <div>
        {props.current === 2 && (
          <Button style={{ float: 'right' }} type='primary' onClick={() => message.success('Processing complete!')}>
            Add pet for adoption
          </Button>
        )}
        {props.current > 0 && (
          <Button style={{ float: 'left' }} onClick={() => props.prevStep()}>
            <Icon type='left' />
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}

export default ConfirmAdd;
