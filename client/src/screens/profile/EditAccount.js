import React, { useState } from 'react';
import { Form, Icon, Input, Button, Card, Divider, Col, Row, Typography, Modal, Upload } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth';
import { toastActions } from '../../redux/toast';
import getBase64 from '../../utils/getBase64';

function EditAccount(props) {
  const { getFieldDecorator, getFieldValue, validateFieldsAndScroll } = props.form;

  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const [previewImageVisible, setPreviewImageVisible] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formData) => {
      if (!formErrors) {
        try {
          await dispatch(authActions.updateUserAccount(formData));
          dispatch(toastActions.addToast({ type: 'success', msg: 'Account updated successfully' }));
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const normFile = e => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handlePreviewCancel = () => setPreviewImageVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImageSrc(file.url || file.preview);
    setPreviewImageVisible(true);
  };

  return (
    <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
      <Col sm={24} md={20} lg={14} xl={12}>
        <Card>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            Edit Account Details
          </Typography.Title>
          <Divider />

          <Form layout={'vertical'} onSubmit={handleSubmit} className='login-form'>
            <Form.Item label='Username' hasFeedback>
              {getFieldDecorator('username', {
                initialValue: user.username,
                rules: [
                  { required: true, message: 'Please input your username!', whitespace: true },
                  { min: 2, message: 'Minimum 3 characters required' },
                ],
              })(<Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='Username' size='large' />)}
            </Form.Item>

            <Form.Item label='E-mail' hasFeedback>
              {getFieldDecorator('email', {
                initialValue: user.email,
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              })(<Input prefix={<Icon type='mail' style={{ fontSize: 13 }} />} placeholder='Email' size='large' />)}
            </Form.Item>

            <Form.Item label='Upload Avatar'>
              <div className='dropbox'>
                {getFieldDecorator('avatar', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  rules: [
                    {
                      required: true,
                      message: 'Please upload pet profile image',
                    },
                  ],
                })(
                  <Upload
                    accept='.jpg,.jpeg,.png,.bmp,.gif'
                    beforeUpload={() => false}
                    listType='picture-card'
                    showUploadList={true}
                    onPreview={handlePreview}
                  >
                    {getFieldValue('avatar') && getFieldValue('avatar').length ? null : (
                      <div>
                        <Icon type='plus' />
                        <div className='ant-upload-text'>Upload Avatar</div>
                      </div>
                    )}
                  </Upload>
                )}
              </div>
            </Form.Item>

            <Form.Item>
              <Button type='primary' size='large' htmlType='submit'>
                Save Changes
              </Button>
            </Form.Item>

            <Modal visible={previewImageVisible} footer={null} onCancel={handlePreviewCancel}>
              <img alt='example' style={{ width: '100%' }} src={previewImageSrc} />
            </Modal>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Form.create()(EditAccount);
