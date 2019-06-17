import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Form, Input, Tooltip, Icon, Button, Card, Divider, Row, Col, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { userSignup } from '../../redux/auth/authActions';

const { Title, Text } = Typography;

function SignupForm(props) {
  const [confirmDirty, setConfirmDirty] = useState(false);
  const { getFieldDecorator, validateFields, getFieldValue, validateFieldsAndScroll } = props.form;

  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        try {
          dispatch(userSignup(values));
        } catch (err) {
          console.error(err);
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
        <Card>
          <Title level={2} style={{ textAlign: 'center' }}>
            Signup
          </Title>
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
                rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
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
                <Text type='secondary'>
                  Already have an account? <Link to='/login'>Login now</Link>
                </Text>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

const Signup = Form.create({ name: 'signup' })(SignupForm);

export default Signup;
