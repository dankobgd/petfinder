import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../redux/auth';
import { Form, Icon, Input, Col, Row, Divider, Tooltip, Button, Card, Typography } from 'antd';

const { Title } = Typography;

function ForgotPasswordForm(props) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFields, getFieldValue } = props.form;

  const [showServerError, setShowServerError] = useState(false);

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
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(authActions.forgotPasswordRequest(values));
        setShowServerError(true);
        props.setSuccess(true);
      }
    });
  };

  return (
    <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>
            Forgot Password
          </Title>
          <Divider />

          <Form layout='vertical' onSubmit={handleSubmit} hideRequiredMark={true}>
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
              <Button type='primary' htmlType='submit'>
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
