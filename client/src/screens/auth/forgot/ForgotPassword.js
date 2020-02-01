import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { identityActions } from '../../../redux/identity';
import { Form, Icon, Input, Col, Row, Divider, Tooltip, Button, Card, Typography, Alert } from 'antd';

const { Title } = Typography;

function ForgotPasswordForm(props) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFields, getFieldValue } = props.form;

  const [showServerError, setShowServerError] = useState(false);
  const [showEmailSentSuccess, setShowEmailSentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const UIError = useSelector(state => state.error);

  useEffect(() => {
    if (showServerError) {
      if (UIError.status === 422) {
        let errorsMap = {};

        UIError.data.validation.details.forEach(errObj => {
          errorsMap[errObj.context.label] = {
            value: getFieldsValue()[errObj.context.label],
            errors: [new Error(errObj.message)],
          };
        });

        setFields(errorsMap);
      } else if (UIError.status === 400) {
        if (UIError.message.startsWith('No user')) {
          setFields({
            email: {
              value: getFieldValue('email'),
              errors: [new Error(UIError.message)],
            },
          });
        }
      }
    }
  }, [UIError, UIError.status, showServerError, getFieldValue, getFieldsValue, setFields]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll(async (formErrors, formData) => {
      if (!formErrors) {
        try {
          setLoading(true);
          await dispatch(identityActions.forgotPasswordRequest(formData));
          setShowEmailSentSuccess(true);
          setLoading(false);
        } catch (err) {
          setShowServerError(true);
          setLoading(false);
        }
      }
    });
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
            Forgot Password
          </Title>
          <Divider />

          <Form layout='vertical' onSubmit={handleSubmit}>
            <Form.Item
              hasFeedback
              label={
                <span>
                  Email&nbsp;
                  <Tooltip title='Further instructions about password reset will be sent to this Email'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ],
              })(<Input prefix={<Icon type='mail' style={{ fontSize: 13 }} />} placeholder='Email' size='large' />)}
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

export default Form.create({ name: 'ForgotPasswordForm' })(ForgotPasswordForm);
