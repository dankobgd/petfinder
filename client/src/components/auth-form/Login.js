import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Form, Icon, Input, Button, Card, Divider, Col, Row, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth';

const { Title, Text } = Typography;

function LoginForm(props) {
  const dispatch = useDispatch();
  const [clearServerError, setClearServerError] = useState(false);
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFields } = props.form;
  const authErr = useSelector(state => state.error);

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        dispatch(authActions.userLoginRequest(values));
        setClearServerError(true);
      }
    });
  };

  useEffect(() => {
    if (clearServerError) {
      if (authErr.status === 422) {
        let errorsMap = {};

        authErr.data.validation.details.forEach(errObj => {
          errorsMap[errObj.context.label] = {
            value: getFieldValue([errObj.context.label]),
            errors: [new Error(errObj.message)],
          };
        });

        setFields(errorsMap);
      } else if (authErr.status === 400) {
        if (authErr.message.startsWith('User')) {
          setFields({
            email: {
              value: getFieldValue('email'),
              errors: [new Error(authErr.message)],
            },
          });
        } else {
          setFields({
            password: {
              value: getFieldValue('password'),
              errors: [new Error(authErr.message)],
            },
          });
        }
      }
    }
  }, [authErr, authErr.status, clearServerError, getFieldValue, setFields]);

  return (
    <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>
            Login
          </Title>
          <Divider />

          <Form layout={'vertical'} onSubmit={handleSubmit} hideRequiredMark={true} className='login-form'>
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
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
                  type='password'
                  placeholder='Password'
                  size='large'
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button type='primary' size='large' htmlType='submit' className='login-form-button'>
                Log in
              </Button>

              <div style={{ marginTop: '2rem' }}>
                <Text type='secondary'>
                  Don't have an account? <Link to='/signup'>Create one now</Link>
                </Text>
              </div>

              <Text type='secondary'>
                Forgot password? <Link to='/password-forgot'>Reser your password</Link>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

const Login = Form.create({ name: 'login' })(LoginForm);

export default Login;
