import React, { useState, useEffect } from 'react';
import { Alert, Row, Col, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import ResetForm from './ResetForm';
import { identityActions } from '../../../redux/identity';

function ResetPassword({ resetToken }) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const UIError = useSelector(state => state.error);

  useEffect(() => {
    async function validateTokenRequest() {
      await dispatch(identityActions.validateResetToken(resetToken));
      setLoading(false);
      setSuccess(true);
      if (UIError.message.startsWith('Password')) {
        setLoading(false);
        setSuccess(false);
      }
    }

    validateTokenRequest();
  }, [UIError.message, dispatch, resetToken]);

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
            <Alert message='Error' description={UIError.message} type='error' showIcon closable />
          </Col>
        </Row>
      )}
      {!loading && success && <ResetForm resetToken={resetToken} />}
    </div>
  );
}

export default ResetPassword;
