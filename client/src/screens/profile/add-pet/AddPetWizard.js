import React, { useState, useRef } from 'react';
import { Steps, Icon, Form, Row, Col, message } from 'antd';
import { navigate } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import { identityActions } from '../../../redux/identity';
import { toastActions } from '../../../redux/toast';
import { petsActions } from '../../../redux/pets';
import { PetKind, PetInfo, ContactInfo, ConfirmAdd } from './step-forms';
import { initialFormState, StepperButtons } from './wizard';

function AddPetWizard() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.identity.isLoading);
  const [current, setCurrent] = useState(0);
  const [formState, setFormState] = useState(initialFormState);
  const formRef = useRef(null);

  const prevStep = () => {
    setCurrent(cur => cur - 1);
  };

  const nextStep = e => {
    e.preventDefault();
    formRef.current.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setCurrent(cur => cur + 1);
      }
    });
  };

  const handleFormChange = changedFields => {
    setFormState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  const handleSuccess = async () => {
    const data = Object.entries(formState.fields)
      .map(([name, obj]) => ({ name, value: obj.value }))
      .filter(elm => elm.name !== 'onChange');

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

  const steps = [
    {
      title: 'Pet Kind',
      content: <PetKind {...formState.fields} onChange={handleFormChange} ref={formRef} />,
      icon: <Icon type='select' />,
    },
    {
      title: 'Pet Info',
      content: <PetInfo {...formState.fields} onChange={handleFormChange} ref={formRef} />,
      icon: <Icon type='solution' />,
    },
    {
      title: 'Contact Info',
      content: <ContactInfo {...formState.fields} onChange={handleFormChange} ref={formRef} />,
      icon: <Icon type='user' />,
    },
    {
      title: 'Success',
      content: <ConfirmAdd formFields={formState.fields} loading={loading} />,
      icon: <Icon type='check-circle' />,
    },
  ];

  return (
    <div>
      <Row type='flex' style={{ justifyContent: 'center' }}>
        <Col sm={24} md={20} lg={16} xl={14}>
          <Steps size='small' current={current}>
            {steps.map(({ title, icon, content }) => (
              <Steps.Step key={title} title={title} icon={icon} />
            ))}
          </Steps>

          <div className='steps-content'>{steps[current].content}</div>

          <StepperButtons
            current={current}
            total={steps.length}
            prevStep={prevStep}
            nextStep={nextStep}
            onSuccess={handleSuccess}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Form.create()(AddPetWizard);
