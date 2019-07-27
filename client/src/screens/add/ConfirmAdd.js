import React from 'react';
import { Typography, Result, Icon, Descriptions, Spin, message } from 'antd';
import { navigate } from '@reach/router';
import { PreviousStep, SuccessSubmitButton } from './StepperButton';
import { identityActions } from '../../redux/identity';
import { toastActions } from '../../redux/toast';
import { useSelector, useDispatch } from 'react-redux';

function DetailsList({ data }) {
  const details = data.filter(d => d.name !== 'profileImage' && d.name !== 'galleryImages');
  return (
    <div>
      <Descriptions
        title='Pet Details Information List'
        bordered
        size='small'
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
      >
        {details.map(({ name, value }) =>
          value && value.length ? (
            <Descriptions.Item label={<Typography.Text strong>{name}</Typography.Text>} key={name}>
              <Typography.Text>{value}</Typography.Text>
            </Descriptions.Item>
          ) : null
        )}
      </Descriptions>
    </div>
  );
}

function ConfirmAdd({ formFields, current, prevStep }) {
  const loading = useSelector(state => state.identity.isLoading);
  const dispatch = useDispatch();

  const data = Object.entries(formFields)
    .map(([name, obj]) => ({ name, value: obj.value }))
    .filter(elm => elm.name !== 'onChange');

  const onSubmit = async () => {
    const hideMsgLoading = message.loading('Creating new pet listing', 0);

    try {
      await dispatch(identityActions.createPet(data));
      await dispatch(identityActions.fetchUsersPets());
      hideMsgLoading();
      navigate('./created');
      dispatch(toastActions.addToast({ type: 'success', msg: 'Added new pet for adoption' }));
    } catch (err) {
      console.error(err);
    }
  };

  const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;

  return (
    <div>
      <Result icon={<Icon type='smile' theme='twoTone' />} title='Success, do you wish to add a new pet for adoption' />
      <DetailsList data={data} />

      {loading && <Spin indicator={antIcon} />}

      <PreviousStep current={current} onClick={prevStep} disabled={loading} />
      <SuccessSubmitButton onClick={onSubmit} loading={loading} />
    </div>
  );
}

export default ConfirmAdd;
