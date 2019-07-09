import React from 'react';
import { Typography, List } from 'antd';
import { PreviousStep, SuccessSubmitButton } from './StepperButton';
import apiClient from '../../utils/apiClient';

function ConfirmAdd({ formFields, current, prevStep }) {
  const data = Object.entries(formFields)
    .map(([name, obj]) => ({
      name,
      value: obj.value,
    }))
    .filter(elm => elm.name !== 'onChange' && elm.name !== 'profileImage' && elm.name !== 'galleryImages');

  const formData = new FormData();

  data.forEach(elm => formData.append(`${elm.name}`, elm.value));
  formData.append('profileImage', formFields.profileImage.value[0].originFileObj);
  formFields.galleryImages.value.map(val => formData.append('galleryImages', val.originFileObj));

  const onSubmit = () => {
    apiClient
      .post('animals/create', { data: formData })
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <div>Success, do you wish to add a new pet for adoption</div>

      <List
        size='small'
        bordered
        dataSource={data}
        renderItem={item => (
          <>
            {item.value && item.value.length && (
              <List.Item>
                <Typography.Text strong>{item.name} - </Typography.Text>
                <Typography.Text>{item.value}</Typography.Text>
              </List.Item>
            )}
          </>
        )}
      />

      <PreviousStep current={current} onClick={prevStep} />
      <SuccessSubmitButton onClick={() => onSubmit()} />
    </div>
  );
}

export default ConfirmAdd;
