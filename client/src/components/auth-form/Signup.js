import React, { useState, useEffect } from 'react';
import { Link, navigate } from '@reach/router';
import { Form, Input, Tooltip, Icon, Button, Card, Divider, Row, Col, Typography, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth';
import { toastActions } from '../../redux/toast';

function SignupForm(props) {
  const {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    setFields,
    validateFieldsAndScroll,
    validateFields,
  } = props.form;

  const [confirmDirty, setConfirmDirty] = useState(false);
  const [showServerError, setShowServerError] = useState(false);

  const dispatch = useDispatch();
  const authErr = useSelector(state => state.error);

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formData) => {
      if (!formErrors) {
        try {
          await dispatch(authActions.userSignupRequest(formData));
          dispatch(toastActions.addToast({ type: 'success', msg: 'You register successfully' }));
          navigate('/');
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
      } else if (authErr.message.startsWith('Email')) {
        setFields({
          email: {
            value: getFieldValue('email'),
            errors: [new Error(authErr.message)],
          },
        });
      }
    }
  }, [authErr, authErr.status, getFieldValue, getFieldsValue, setFields, showServerError]);

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

  return (
    <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        {showServerError ? (
          <Alert message='Error' description='Authentication Error' type='error' showIcon closable />
        ) : null}

        <Card>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            Signup
          </Typography.Title>
          <Divider />

          <Form layout={'vertical'} onSubmit={handleSubmit} hideRequiredMark={true}>
            <Form.Item
              label={
                <span>
                  Username&nbsp;
                  <Tooltip title='How other users will see you'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              }
              hasFeedback
            >
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!', whitespace: true },
                  { min: 2, message: 'Minimum 3 characters required' },
                ],
              })(<Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='Username' size='large' />)}
            </Form.Item>

            <Form.Item label='E-mail' hasFeedback>
              {getFieldDecorator('email', {
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

            <Form.Item label='Password' hasFeedback>
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

            <Form.Item label='Confirm Password' hasFeedback>
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
                Sign up
              </Button>

              <div style={{ marginTop: '2rem' }}>
                <Typography.Text type='secondary'>
                  Already have an account? <Link to='/login'>Login now</Link>
                </Typography.Text>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Form.create()(SignupForm);
