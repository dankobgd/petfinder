import React from 'react';
import { Button, Icon } from 'antd';

const btnStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

function PreviousStep({ current, onClick, style, ...rest }) {
  return (
    <>
      {current > 0 && (
        <Button type='ghost' size='large' style={(btnStyles, { ...style })} onClick={onClick} {...rest}>
          <Icon type='left-circle' theme='twoTone' style={{ fontSize: 24 }} />
          <span>Back</span>
        </Button>
      )}
    </>
  );
}

function NextStep({ current, onClick, style, ...rest }) {
  return (
    <>
      {current < 2 && (
        <Button type='ghost' size='large' onClick={onClick} style={(btnStyles, { ...style })} {...rest}>
          <span>Next</span>
          <Icon type='right-circle' theme='twoTone' style={{ fontSize: 24 }} />
        </Button>
      )}
    </>
  );
}

function SuccessSubmitButton({ onClick, style, ...rest }) {
  return (
    <Button type='primary' size='large' onClick={onClick} style={(btnStyles, { ...style })} {...rest}>
      Submit for adoption
    </Button>
  );
}
export { PreviousStep, NextStep, SuccessSubmitButton };
