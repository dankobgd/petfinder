import React from 'react';
import { Button } from 'antd';

function PreviousStep({ current, onClick, ...rest }) {
  return (
    <>
      {current > 0 && (
        <Button type='primary' onClick={onClick} {...rest}>
          Previous
        </Button>
      )}
    </>
  );
}

function NextStep({ current, onClick, ...rest }) {
  return (
    <>
      {current < 2 && (
        <Button type='primary' onClick={onClick} {...rest}>
          Next
        </Button>
      )}
    </>
  );
}

function SuccessSubmitButton({ onClick, ...rest }) {
  return (
    <Button type='primary' onClick={onClick} {...rest}>
      Add pet for adoption
    </Button>
  );
}
export { PreviousStep, NextStep, SuccessSubmitButton };
