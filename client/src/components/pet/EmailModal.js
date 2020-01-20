import React, { useEffect } from 'react';
import { Modal, Form, Input, Icon, Button } from 'antd';
import { useSelector } from 'react-redux';

const vGap = { marginBottom: 8 };

function EmailModal(props) {
  const { visible, onCancel, onOk, form, pet, isAuthenticated, sendingEmail } = props;
  const { getFieldDecorator, setFieldsValue } = form;

  const user = useSelector(state => state.identity.user);

  useEffect(() => {
    if (isAuthenticated) {
      setFieldsValue({
        email: user.email,
      });
    }
  }, [isAuthenticated, pet, setFieldsValue, user]);

  return (
    <Modal
      visible={visible}
      title='Send Contact Email'
      okText='Send'
      onCancel={onCancel}
      onOk={onOk}
      footer={[
        <Button key='back' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' loading={sendingEmail} onClick={onOk}>
          Send
        </Button>,
      ]}
    >
      {pet && (
        <Form ayout={'vertical'}>
          <Form.Item style={vGap} label='Email' hasFeedback>
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: 'invalid email' },
                { required: true, message: 'Please input email' },
              ],
            })(<Input prefix={<Icon type='mail' />} placeholder='Email' />)}
          </Form.Item>

          <Form.Item style={vGap} label='Message' hasFeedback>
            {getFieldDecorator('message', {
              rules: [{ required: true, message: 'Please input message' }],
            })(
              <Input.TextArea
                rows={6}
                prefix={<Icon type='mail' />}
                placeholder={`I am wondering if ${pet.name} is...`}
              />
            )}
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default Form.create({ name: 'send_email_contact' })(EmailModal);
