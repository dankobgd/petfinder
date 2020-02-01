import React from 'react';
import { Form, Radio, Typography, Row, Col, Select } from 'antd';

import { renderAutocompleteOpts } from '../../../../data/helpers';

function PetKindForm(props) {
  const { getFieldDecorator, getFieldValue } = props.form;
  const renderOpts = renderAutocompleteOpts(getFieldValue('type'), getFieldValue('species'));
  const shouldShowSpecies = getFieldValue('type') && !getFieldValue('type').match(/Cat|Dog|Rabbit/g);

  return (
    <div>
      <Typography.Title level={4} style={{ textAlign: 'center' }}>
        Choose Pet Type
      </Typography.Title>

      <Form layout='vertical'>
        <Form.Item>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please select animal type' }],
          })(
            <Radio.Group buttonStyle='solid' className='big-radio'>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={20} md={8} lg={8} xl={8}>
                  <Radio.Button value='Cat'>
                    <p>Cat</p>
                  </Radio.Button>
                </Col>
                <Col xs={24} sm={20} md={8} lg={8} xl={8}>
                  <Radio.Button value='Dog'>
                    <p>Dog</p>
                  </Radio.Button>
                </Col>
                <Col xs={24} sm={20} md={8} lg={8} xl={8}>
                  <Radio.Button value='Rabbit'>
                    <p>Rabbit</p>
                  </Radio.Button>
                </Col>
              </Row>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={20} md={8} lg={8} xl={8}>
                  <Radio.Button value='Bird'>
                    <p>Bird</p>
                  </Radio.Button>
                </Col>
                <Col xs={24} sm={20} md={8} lg={8} xl={8}>
                  <Radio.Button value='SmallAndFurry'>
                    <p>Small & Furry </p>
                  </Radio.Button>
                </Col>
                <Col xs={24} sm={20} md={8} lg={8} xl={8}>
                  <Radio.Button value='AquaticAndReptiles'>
                    <p>Aquatic & Reptiles</p>
                  </Radio.Button>
                </Col>
              </Row>
            </Radio.Group>
          )}
        </Form.Item>

        {shouldShowSpecies && (
          <Form.Item label='Species' hasFeedback>
            {getFieldDecorator('species', {
              rules: [{ required: true, message: 'Please select species' }],
            })(
              <Select
                showSearch
                placeholder='Select species'
                optionFilterProp='children'
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {renderOpts('species')}
              </Select>
            )}
          </Form.Item>
        )}
      </Form>
    </div>
  );
}

const mapPropsToFields = props => {
  let fields = {};
  Object.keys(props).forEach(key => {
    fields[key] = Form.createFormField({
      ...props[key],
      value: props[key].value,
    });
  });
  return fields;
};

const onFieldsChange = (props, changedFields) => {
  props.onChange(changedFields);
};

const PetKind = Form.create({
  onFieldsChange,
  mapPropsToFields,
})(PetKindForm);

export default PetKind;
