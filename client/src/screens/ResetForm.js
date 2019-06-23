import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { authActions } from '../redux/auth';
import { toastActions } from '../redux/toast';
import { Form, Icon, Input, Col, Row, Divider, Tooltip, Button, Card, Typography, Alert } from 'antd';

const { Title } = Typography;

function ResetPasswordForm(props) {
  const {
    getFieldDecorator,
    validateFields,
    validateFieldsAndScroll,
    getFieldsValue,
    setFields,
    getFieldValue,
  } = props.form;

  const { resetToken } = props;

  const [showEmailSentSuccess, setShowEmailSentSuccess] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const authErr = useSelector(state => state.error);

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
      } else if (authErr.status === 400) {
        if (authErr.message.startsWith('No user')) {
          setFields({
            email: {
              value: getFieldValue('email'),
              errors: [new Error(authErr.message)],
            },
          });
        }
      }
    }
  }, [authErr, authErr.status, showServerError, getFieldValue, getFieldsValue, setFields]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formData) => {
      if (!formErrors) {
        try {
          setLoading(true);
          await dispatch(authActions.resetPasswordRequest({ ...formData, resetToken }));
          dispatch(toastActions.addToast({ type: 'success', msg: 'Your password has been changed' }));
          setShowEmailSentSuccess(true);
          navigate('/login');
          setLoading(false);
        } catch (err) {
          setShowServerError(true);
          setLoading(false);
        }
      }
    });
  };

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
        {showEmailSentSuccess ? (
          <Alert message='Success' description='Email has been sent' type='success' showIcon closable />
        ) : null}
        {showServerError ? <Alert message='Error' description='Email not sent' type='error' showIcon closable /> : null}

        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>
            Reset Password
          </Title>
          <Divider />

          <Form layout='vertical' onSubmit={handleSubmit} hideRequiredMark={true}>
            <Form.Item
              label={
                <span>
                  Password&nbsp;
                  <Tooltip title='Your new password'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              }
              hasFeedback
            >
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
              <Button type='primary' htmlType='submit' loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Form.create({ name: 'ResetPasswordForm' })(ResetPasswordForm);
