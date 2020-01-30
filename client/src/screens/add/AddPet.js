import React, { useState, useRef } from 'react';
import { Steps, Icon, Form, Row, Col } from 'antd';
import PetInfo from './PetInfo';
import ContactInfo from './ContactInfo';
import ConfirmAdd from './ConfirmAdd';
import { initialFormState } from './InitialFormState';

const { Step } = Steps;

function AddPet(props) {
  const [current, setCurrent] = useState(0);
  const [formState, setFormState] = useState(initialFormState);

  const formRef = useRef(null);

  const prevStep = () => setCurrent(cur => cur - 1);

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

  const steps = [
    {
      title: 'Pet Info',
      content: (
        <PetInfo
          {...formState.fields}
          onChange={handleFormChange}
          ref={formRef}
          current={current}
          nextStep={nextStep}
        />
      ),
      icon: <Icon type='solution' />,
    },
    {
      title: 'Contact Info',
      content: (
        <ContactInfo
          {...formState.fields}
          onChange={handleFormChange}
          ref={formRef}
          current={current}
          prevStep={prevStep}
          nextStep={nextStep}
        />
      ),
      icon: <Icon type='user' />,
    },
    {
      title: 'Success',
      content: <ConfirmAdd formFields={formState.fields} current={current} prevStep={prevStep} />,
      icon: <Icon type='check-circle' />,
    },
  ];

  return (
    <div>
      <Row type='flex' style={{ justifyContent: 'center' }}>
        <Col sm={24} md={20} lg={18} xl={16}>
          <Steps size='small' current={current}>
            {steps.map(({ title, icon, content }) => (
              <Step key={title} title={title} icon={icon} />
            ))}
          </Steps>

          <div className='steps-content'>{steps[current].content}</div>
        </Col>
      </Row>
    </div>
  );
}

export default Form.create()(AddPet);
