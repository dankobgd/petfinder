import React, { useState, useEffect } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Card,
  Divider,
  Col,
  Row,
  Typography,
  Upload,
  Avatar,
  Tooltip,
  Popconfirm,
  Alert,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth';
import { toastActions } from '../../redux/toast';
import getBase64 from '../../utils/getBase64';

function EditAccount(props) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, getFieldsValue, setFields } = props.form;
  const [fileList, setFileList] = useState([]);
  const [avatarImageSource, setAvatarImageSource] = useState('');
  const [showServerError, setShowServerError] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const authErr = useSelector(state => state.error);

  const handleFileChange = info => {
    let fileList = [...info.fileList];
    // show only last file
    fileList = fileList.slice(-1);

    fileList = fileList.map(file => {
      getBase64(file.originFileObj).then(src => setAvatarImageSource(src));

      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileList);
  };

  const normFile = e => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handleSubmitAvatar = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formValues) => {
      if (!formErrors) {
        try {
          await dispatch(authActions.updateUserAvatar(formValues));
          dispatch(toastActions.addToast({ type: 'success', msg: 'Avatar updated successfully' }));
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleSubmitAccount = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formValues) => {
      if (!formErrors) {
        try {
          await dispatch(authActions.updateUserAccount(formValues));
          dispatch(toastActions.addToast({ type: 'success', msg: 'Account updated successfully' }));
          setShowServerError(true);
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleDeleteAvatar = () => {
    dispatch(authActions.deleteUserAvatar(user.avatar));
    dispatch(toastActions.addToast({ type: 'success', msg: 'Avatar deleted successfully' }));
    setAvatarImageSource('');
  };

  useEffect(() => {
    if (user && user.avatar) {
      setAvatarImageSource(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    if (showServerError) {
      if (authErr.status === 422) {
        let errorsMap = {};

        authErr.data.validation.details.forEach(errObj => {
          errorsMap[errObj.context.label] = {
            value: getFieldsValue()[errObj.context.label],
            errors: [new Error(errObj.message)],
          };
        });

        setFields(errorsMap);
      } else if (authErr.message.startsWith('Invalid')) {
        setFields({
          username: {
            value: getFieldValue('username'),
            errors: [new Error(authErr.message)],
          },
        });
      }
    }
  }, [authErr, authErr.status, getFieldValue, getFieldsValue, setFields, showServerError]);

  return (
    <div>
      <Row type='flex' style={{ justifyContent: 'center' }}>
        <Col sm={24} md={20} lg={14} xl={12}>
          {showServerError ? <Alert message='Error' description='Error' type='error' showIcon closable /> : null}

          <Card>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
              Edit User Profile
            </Typography.Title>

            <Divider>
              <Typography.Text>User Avatar</Typography.Text>
            </Divider>

            <Form layout={'vertical'} onSubmit={handleSubmitAvatar}>
              {avatarImageSource ? (
                <div style={{ marginBottom: '1rem' }}>
                  <Avatar shape='square' size={140} src={avatarImageSource} />
                </div>
              ) : (
                <div style={{ marginBottom: '1rem' }}>
                  <Avatar shape='square' size={140} icon='user' />
                </div>
              )}

              {user.avatar ? (
                <Tooltip title='Delete profile image' placement='bottom'>
                  <Popconfirm
                    title='Are you sure？'
                    okText='Yes'
                    icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
                    onConfirm={handleDeleteAvatar}
                  >
                    <Icon
                      type='delete'
                      theme='twoTone'
                      twoToneColor='#eb2f96'
                      style={{ fontSize: 30, cursor: 'pointer' }}
                    />
                  </Popconfirm>
                </Tooltip>
              ) : null}

              <Form.Item>
                <div className='dropbox'>
                  {getFieldDecorator('avatar', {
                    initialValue: fileList,
                    getValueFromEvent: normFile,
                  })(
                    <Upload
                      beforeUpload={() => false}
                      accept='.jpg,.jpeg,.png,.bmp,.gif'
                      listType='text'
                      onChange={handleFileChange}
                      fileList={fileList}
                    >
                      <Button>
                        <Icon type='upload' /> Upload Avatar
                      </Button>
                    </Upload>
                  )}
                </div>
              </Form.Item>

              {getFieldValue('avatar').length ? (
                <Form.Item>
                  <Button type='primary' size='large' htmlType='submit'>
                    Save Avatar
                  </Button>
                </Form.Item>
              ) : null}
            </Form>

            <Divider>
              <Typography.Text>User Info</Typography.Text>
            </Divider>

            <Form layout={'vertical'} onSubmit={handleSubmitAccount}>
              <Form.Item label='Username' hasFeedback>
                {getFieldDecorator('username', {
                  initialValue: user.username,
                  rules: [
                    { required: true, message: 'Please input your username!', whitespace: true },
                    { min: 2, message: 'Minimum 3 characters required' },
                  ],
                })(
                  <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='Username' size='large' />
                )}
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

              <Form.Item>
                <Button type='primary' size='large' htmlType='submit'>
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Form.create()(EditAccount);
