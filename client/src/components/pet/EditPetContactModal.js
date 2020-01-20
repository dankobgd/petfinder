import React, { useEffect } from 'react';
import { Modal, Form, Input, Icon } from 'antd';

const vGap = { marginBottom: 8 };

function EditPetContactModal(props) {
  const { visible, onCancel, onOk, form, pet } = props;
  const { getFieldDecorator, setFieldsValue } = form;

  useEffect(() => {
    if (pet) {
      setFieldsValue({
        phone: pet.phone,
        email: pet.email,
        country: pet.country,
        city: pet.city,
        address: pet.address,
      });
    }
  }, [pet, setFieldsValue]);

  return (
    <Modal visible={visible} title='Update Contact Info' okText='Update' onCancel={onCancel} onOk={onOk}>
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
      </Form>
    </Modal>
  );
}

export default Form.create({ name: 'edit_pet_contact' })(EditPetContactModal);
