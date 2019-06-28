import React, { useState } from 'react';
import { Steps, Icon, Form, Row, Col } from 'antd';
import PetInfo from './PetInfo';
import ContactInfo from './ContactInfo';
import ConfirmAdd from './ConfirmAdd';

const { Step } = Steps;

function AddPet(props) {
  const [current, setCurrent] = useState(0);

  const nextStep = () => setCurrent(cur => cur + 1);
  const prevStep = () => setCurrent(cur => cur - 1);

  const steps = [
    {
      title: 'Pet Info',
      content: <PetInfo form={props.form} prevStep={prevStep} nextStep={nextStep} current={current} />,
      icon: <Icon type='solution' />,
    },
    {
      title: 'Contact Info',
      content: <ContactInfo form={props.form} prevStep={prevStep} nextStep={nextStep} current={current} />,
      icon: <Icon type='user' />,
    },
    {
      title: 'Success',
      content: <ConfirmAdd prevStep={prevStep} nextStep={nextStep} current={current} />,
      icon: <Icon type='smile-o' />,
    },
  ];

  return (
    <div>
      <Row type='flex' style={{ justifyContent: 'center', marginTop: '4rem' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Steps size='small' current={current}>
            {steps.map(s => (
              <Step key={s.title} title={s.title} icon={s.icon}>
                {s.content}
              </Step>
            ))}
          </Steps>

          <div className='steps-content'>{steps[current].content}</div>
        </Col>
      </Row>
    </div>
  );
}

export default Form.create()(AddPet);
