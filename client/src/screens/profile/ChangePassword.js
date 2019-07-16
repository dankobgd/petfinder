import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Card, Divider, Col, Row, Typography, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth';
import { toastActions } from '../../redux/toast';

function ChangePassword(props) {
  const {
    getFieldDecorator,
    getFieldValue,
    validateFields,
    validateFieldsAndScroll,
    getFieldsValue,
    setFields,
  } = props.form;

  const [confirmDirty, setConfirmDirty] = useState(false);
  const [showServerError, setShowServerError] = useState(false);

  const dispatch = useDispatch();
  const authErr = useSelector(state => state.error);

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (rule, value, cb) => {
    if (value && value !== getFieldValue('password')) {
      cb('Two passwords that you enter is inconsistent!');
    } else {
      cb();
    }
  };

  const validateToNextPassword = (rule, value, cb) => {
    if (value && confirmDirty) {
      validateFields(['confirmPassword'], { force: true });
    }
    cb();
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formData) => {
      if (!formErrors) {
        try {
          await dispatch(authActions.changeUserPassword(formData));
          dispatch(toastActions.addToast({ type: 'success', msg: 'Password updated successfully' }));
        } catch (err) {
          setShowServerError(true);
        }
      }
    });
  };

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
          oldPassword: {
            value: getFieldValue('oldPassword'),
            errors: [new Error(authErr.message)],
          },
        });
      }
    }
  }, [authErr, authErr.status, getFieldValue, getFieldsValue, setFields, showServerError]);

  return (
    <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
      <Col sm={24} md={20} lg={14} xl={12}>
        {showServerError ? <Alert message='Error' description='Password Error' type='error' showIcon closable /> : null}

        <Card>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            Change Password
          </Typography.Title>
          <Divider />

          <Form layout={'vertical'} onSubmit={handleSubmit}>
            <Form.Item label='Old Password' hasFeedback>
              {getFieldDecorator('oldPassword', {
                rules: [{ required: true, message: 'Please input your old password!' }],
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                  type='password'
                  placeholder='Password'
                  size='large'
                />
              )}
            </Form.Item>

            <Form.Item label='New Password' hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                  type='password'
                  placeholder='Password'
                  size='large'
                />
              )}
            </Form.Item>

            <Form.Item label='Retype New Password' hasFeedback>
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                  type='password'
                  placeholder='Confirm Password'
                  size='large'
                  onBlur={handleConfirmBlur}
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button type='primary' size='large' htmlType='submit'>
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Form.create()(ChangePassword);
