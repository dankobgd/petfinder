import React from 'react';
import { Button, Form } from 'antd';

function PreviousStep({ current, onClick }) {
  return (
    <>
      {current > 0 && (
        <Button type='primary' onClick={onClick}>
          Previous
        </Button>
      )}
    </>
  );
}

function NextStep({ current, onClick }) {
  return (
    <>
      {current < 2 && (
        <Button type='primary' onClick={onClick}>
          Next
        </Button>
      )}
    </>
  );
}

function SuccessSubmitButton({ onClick }) {
  return (
    <Form>
      <Form.Item>
        <Button type='primary' onClick={onClick}>
          Add pet for adoption
        </Button>
      </Form.Item>
    </Form>
  );
}
export { PreviousStep, NextStep, SuccessSubmitButton };
