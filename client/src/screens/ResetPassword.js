import React, { useState, useEffect } from 'react';
import ResetForm from './ResetForm';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../redux/auth';
import { Alert, Row, Col, Spin, Icon } from 'antd';

function ResetPassword({ resetToken }) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const authErr = useSelector(state => state.error);

  useEffect(() => {
    async function validateTokenRequest() {
      await dispatch(authActions.validateResetToken(resetToken));
      setLoading(false);
      setSuccess(true);
      if (authErr.message.startsWith('Password')) {
        setLoading(false);
        setSuccess(false);
      }
    }

    validateTokenRequest();
  }, [authErr.message, dispatch, resetToken]);

  return (
    <div>
      {loading && (
        <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8} style={{ textAlign: 'center ' }}>
            <Spin size='large' />
          </Col>
        </Row>
      )}
      {!loading && !success && (
        <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Alert message='Error' description={authErr.message} type='error' showIcon closable />
          </Col>
        </Row>
      )}
      {!loading && success && <ResetForm resetToken={resetToken} />}
    </div>
  );
}

export default ResetPassword;
