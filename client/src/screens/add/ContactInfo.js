import React from 'react';
import { Form, Button, Input, Icon, Typography, Card } from 'antd';

const vGap = { marginBottom: 8 };

function ContactInfo(props) {
  const { getFieldDecorator } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Card>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Pet adoption contact information
      </Typography.Title>

      <Form ayout={'vertical'} onSubmit={handleSubmit}>
        <Form.Item style={vGap} label='Phone' hasFeedback>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input phone' }],
          })(<Input prefix={<Icon type='phone' />} placeholder='Phone' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Email' hasFeedback>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: 'invalid email' }, { required: true, message: 'Please input email' }],
          })(<Input prefix={<Icon type='mail' />} placeholder='Email' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Country' hasFeedback>
          {getFieldDecorator('country', {
            rules: [{ required: true, message: 'Please input country' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Country' />)}
        </Form.Item>

        <Form.Item style={vGap} label='City' hasFeedback>
          {getFieldDecorator('city', {
            rules: [{ required: true, message: 'Please input city' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='City' />)}
        </Form.Item>

        <Form.Item label='Address' hasFeedback>
          {getFieldDecorator('address', {
            rules: [{ required: true, message: 'Please input address' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Address' />)}
        </Form.Item>

        {props.current > 0 && (
          <Button style={{ float: 'left' }} onClick={() => props.prevStep()}>
            <Icon type='left' />
            Previous
          </Button>
        )}
        {props.current < 2 && (
          <Button style={{ float: 'right' }} type='primary' onClick={() => props.nextStep()}>
            Next
            <Icon type='right' />
          </Button>
        )}
      </Form>
    </Card>
  );
}

export default Form.create({ name: 'ContactInfo' })(ContactInfo);
