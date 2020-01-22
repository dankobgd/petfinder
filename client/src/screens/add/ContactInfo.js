import React from 'react';
import { Form, Input, Icon, Typography, Card } from 'antd';
import { PreviousStep, NextStep } from './StepperButton';

const vGap = { marginBottom: 8 };

function ContactInfoForm(props) {
  const { getFieldDecorator } = props.form;

  return (
    <Card>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Pet adoption contact information
      </Typography.Title>

      <Form ayout={'vertical'}>
        <Form.Item style={vGap} label='Phone' hasFeedback>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input phone' }],
          })(<Input prefix={<Icon type='phone' />} placeholder='Phone' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Email' hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              { type: 'email', message: 'invalid email' },
              { required: true, message: 'Please input email' },
            ],
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

        <PreviousStep />

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
          <PreviousStep current={props.current} onClick={props.prevStep} />
          <NextStep current={props.current} onClick={props.nextStep} style={{ marginLeft: 'auto' }} />
        </div>
      </Form>
    </Card>
  );
}

const mapPropsToFields = props => {
  let fields = {};
  Object.keys(props).forEach(key => {
    fields[key] = Form.createFormField({
      ...props[key],
      value: props[key].value,
    });
  });
  return fields;
};

const onFieldsChange = (props, changedFields) => {
  props.onChange(changedFields);
};

const ContactInfo = Form.create({
  name: 'step_2_contact',
  onFieldsChange,
  mapPropsToFields,
})(ContactInfoForm);

export default ContactInfo;
