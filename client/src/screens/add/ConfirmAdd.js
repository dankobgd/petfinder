import React from 'react';
import { Typography, Result, Icon, Descriptions, Spin, message, Tag } from 'antd';
import { navigate } from '@reach/router';
import { PreviousStep, SuccessSubmitButton } from './StepperButton';
import { identityActions } from '../../redux/identity';
import { petsActions } from '../../redux/pets';
import { toastActions } from '../../redux/toast';
import { useSelector, useDispatch } from 'react-redux';

const printGoodWith = provided => {
  const source = ['good_with_cats', 'good_with_dogs', 'good_with_kids'];
  const words = ['Good with Cats', 'Good With Dogs', 'Good With Kids'];
  const filtered = source.filter(x => !provided.includes(x));
  const tmp = source.map(x => filtered.indexOf(x));
  const a = words.filter((_, idx) => idx === tmp[idx]);

  return a.map(val => (
    <div key={val}>
      <Tag color='purple' style={{ marginBottom: 6 }}>
        <Typography.Text>{val}</Typography.Text>
      </Tag>
      <br />
    </div>
  ));
};

function renderElements(items) {
  return items.map(({ name, value }) => {
    if (name === 'environment') {
      return (
        <Descriptions.Item label={<Typography.Text strong>Environment</Typography.Text>} key={value}>
          {printGoodWith(value)}
        </Descriptions.Item>
      );
    } else {
      if (value && value.length) {
        return (
          <Descriptions.Item label={<Typography.Text strong>{name}</Typography.Text>} key={name}>
            {Array.isArray(value) ? (
              value.map(val => (
                <div key={val}>
                  <Tag color='purple' style={{ marginBottom: 6 }}>
                    <Typography.Text>{val}</Typography.Text>
                  </Tag>
                  <br />
                </div>
              ))
            ) : (
              <Typography.Text>{value}</Typography.Text>
            )}
          </Descriptions.Item>
        );
      } else {
        return null;
      }
    }
  });
}

function DetailsList({ data }) {
  const f1 = ['profileImage', 'galleryImages', 'description'];
  const f2 = ['attributes', 'environment', 'colors', 'tags'];
  const details = data.filter(x => !f1.includes(x.name));

  const info = details.filter(x => !f2.includes(x.name)).slice(0, -5);
  const multi = details.filter(x => f2.includes(x.name));
  const contacts = details.slice(Math.max(details.length - 5, 1));

  return (
    <div>
      <Descriptions
        title='Pet Details'
        bordered
        layout='vertical'
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
      >
        {renderElements(info)}
      </Descriptions>

      <Descriptions bordered layout='vertical' column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}>
        {renderElements(multi)}
      </Descriptions>

      {data
        .filter(x => x.name === 'description')
        .map(
          elm =>
            elm.value && (
              <Descriptions bordered layout='vertical' key={elm}>
                <Descriptions.Item label={<Typography.Text strong>{elm.name}</Typography.Text>} key={elm.value}>
                  <Typography.Text>{elm.value}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>
            )
        )}

      <Descriptions bordered layout='vertical' column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}>
        {renderElements(contacts)}
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
      await dispatch(petsActions.fetchLatestAnimals());
      hideMsgLoading();
      navigate('./created');
      dispatch(toastActions.addToast({ type: 'success', msg: 'Added new pet for adoption' }));
    } catch (err) {
      console.error(err);
    }
  };

  const spinner = <Icon type='loading' style={{ fontSize: 24 }} spin />;

  return (
    <div>
      <Result
        icon={<Icon type='check-circle' theme='twoTone' />}
        title='Success, do you wish to add a new pet for adoption'
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading && <Spin indicator={spinner} />}
      </div>
      <DetailsList data={data} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2rem' }}>
        <PreviousStep current={current} onClick={prevStep} disabled={loading} />
        <SuccessSubmitButton onClick={onSubmit} loading={loading} style={{ marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

export default ConfirmAdd;
