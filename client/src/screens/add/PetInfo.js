import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Upload, Icon, Checkbox, Typography, Card, Radio, Tooltip, Row, Col } from 'antd';
import { NextStep } from './StepperButton';
import { dogBreeds, catBreeds } from './breedsData';

const { Option } = Select;

const vGap = { marginBottom: 8 };

function PetInfoForm(props) {
  const { getFieldDecorator, getFieldValue, validateFields } = props.form;

  const [breedRequired, setBreedRequired] = useState(true);
  const [unknownBreedToggled, setUnknownBreedToggled] = useState(false);

  const handleUnknownBreedToggle = () => {
    setBreedRequired(prev => !prev);
    setUnknownBreedToggled(true);
  };

  const normFile = e => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  useEffect(() => {
    if (unknownBreedToggled) {
      validateFields(['nickname'], { force: true });
    }
  }, [validateFields, unknownBreedToggled]);

  return (
    <Card>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Add a pet for adoption
      </Typography.Title>

      <Form layout={'vertical'}>
        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Basic Information
        </Typography.Title>

        <Form.Item style={vGap} label='Name' hasFeedback>
          {getFieldDecorator('name', {
            rules: [{ _required: true, message: 'Please input name' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Name' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Type'>
          {getFieldDecorator('type', {
            rules: [{ _required: true, message: 'Enter animal type' }],
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='cat'>Cat</Radio.Button>
              <Radio.Button value='dog'>Dog</Radio.Button>
              <Radio.Button value='rabbit'>Rabbit</Radio.Button>
              <Radio.Button value='bird'>Bird</Radio.Button>
              <Radio.Button value='fish'>Fish</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item style={vGap} label='Gender'>
          {getFieldDecorator('gender', {
            rules: [{ _required: true, message: 'Enter animal gender' }],
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='male'>male</Radio.Button>
              <Radio.Button value='female'>female</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item style={vGap} label='Age'>
          {getFieldDecorator('age', {
            rules: [{ _required: true, message: 'Enter animal age' }],
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='baby'>baby</Radio.Button>
              <Radio.Button value='young'>young</Radio.Button>
              <Radio.Button value='adult'>adult</Radio.Button>
              <Radio.Button value='senior'>senior</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item style={vGap} label='Species' hasFeedback>
          {getFieldDecorator('species', {
            rules: [{ _required: true, message: 'Please input animal species' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Species' />)}
        </Form.Item>

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Attributes & Environment
        </Typography.Title>

        <Form.Item style={vGap} label='Attributes'>
          {getFieldDecorator('attributes')(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <Checkbox value='declawed'>Declawed</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='house_trained'>House Trained</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='vaccinated'>Vaccinated</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='spayed_neutered'>Spayed/Neutered</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value='special_needs'>Special Needs</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
        </Form.Item>

        <Form.Item label="Doesn't like to be with">
          {getFieldDecorator('environment')(
            <Checkbox.Group>
              <Checkbox value='kids'>Kids</Checkbox>
              <Checkbox value='cats'>Cats</Checkbox>
              <Checkbox value='dogs'>Dogs</Checkbox>
            </Checkbox.Group>
          )}
        </Form.Item>

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Additional details
        </Typography.Title>

        <Form.Item style={vGap} label='Primary Breed' hasFeedback>
          {getFieldDecorator('primaryBreed', {
            rules: [{ _required: breedRequired, message: 'Please input primary breed' }],
          })(
            <Select
              showSearch
              placeholder='Select primary breed'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {getFieldValue('type') === 'dog'
                ? dogBreeds.map(dog => (
                    <Option key={dog} value={dog}>
                      {dog}
                    </Option>
                  ))
                : getFieldValue('type') === 'cat'
                ? catBreeds.map(cat => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))
                : null}
            </Select>
          )}
        </Form.Item>

        <Form.Item style={vGap} label='Secondary Breed' hasFeedback>
          {getFieldDecorator('secondaryBreed', {
            rules: [{ _required: breedRequired, message: 'Please input secondary breed' }],
          })(
            <Select
              showSearch
              placeholder='Select secondary breed'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {getFieldValue('type') === 'dog'
                ? dogBreeds.map(dog => (
                    <Option key={dog} value={dog}>
                      {dog}
                    </Option>
                  ))
                : getFieldValue('type') === 'cat'
                ? catBreeds.map(cat => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))
                : null}
            </Select>
          )}
        </Form.Item>

        <Row>
          <Col span={12}>
            <Form.Item style={vGap}>
              {getFieldDecorator('mixedBreed')(
                <Checkbox.Group>
                  <Checkbox value='mixedBreed'>Mixed Breed</Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item style={vGap}>
              {getFieldDecorator('unknownBreed')(
                <Checkbox.Group>
                  <Checkbox value='unknownBreed' checked={breedRequired} onChange={handleUnknownBreedToggle}>
                    Unknown breed
                  </Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={vGap} label='Coat Length' hasFeedback>
          {getFieldDecorator('coatLength', {
            rules: [{ _required: true, message: 'Enter coat length' }],
          })(
            <Select placeholder='Select coat length'>
              <Option value='hairless'>hairless</Option>
              <Option value='short'>short</Option>
              <Option value='medium'>medium</Option>
              <Option value='long'>long</Option>
              <Option value='wire'>wire</Option>
              <Option value='curly'>curly</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item style={vGap} label='Size when grown' hasFeedback>
          {getFieldDecorator('size', {
            rules: [{ _required: true, message: 'Enter size' }],
          })(
            <Select placeholder='Animal size'>
              <Option value='small'>small</Option>
              <Option value='medium'>medium</Option>
              <Option value='large'>large</Option>
              <Option value='extra_large'>extra large</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item
          style={vGap}
          label={
            <span>
              Animal Color&nbsp;
              <Tooltip title='Pick colors by hierarchy in order: primary -> secondary -> tertiary etc'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('colors', {
            rules: [{ _required: true, message: 'Please select animal colors', type: 'array' }],
          })(
            <Select mode='multiple' placeholder='Select animal colors'>
              <Option value='black'>black</Option>
              <Option value='grey'>grey</Option>
              <Option value='blue'>blue</Option>
              <Option value='brown'>brown</Option>
              <Option value='white'>white</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Has Microchip'>
          {getFieldDecorator('microchip')(
            <Radio.Group>
              <Radio value='yes'>Yes</Radio>
              <Radio value='no'>No</Radio>
            </Radio.Group>
          )}
        </Form.Item>

        {getFieldValue('microchip') === 'yes' ? (
          <>
            <Form.Item style={vGap} label='Chip ID' hasFeedback>
              {getFieldDecorator('chipId', {
                rules: [{ _required: true, message: 'Please input chip ID' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip ID' />)}
            </Form.Item>
            <Form.Item style={vGap} label='Chip Brand' hasFeedback>
              {getFieldDecorator('chipBrand', {
                rules: [{ _required: true, message: 'Please input chip brand' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip Brand' />)}
            </Form.Item>
            <Form.Item style={vGap} label='Chip location' hasFeedback>
              {getFieldDecorator('chipLocation')(
                <Input prefix={<Icon type='fire' />} placeholder='Microchip location' />
              )}
            </Form.Item>
            <Form.Item style={vGap} label='Chip Description' hasFeedback>
              {getFieldDecorator('chipDescription')(
                <Input prefix={<Icon type='fire' />} placeholder='Microchip description' />
              )}
            </Form.Item>
          </>
        ) : null}

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Personal Message & Image
        </Typography.Title>

        <Form.Item style={vGap} label='Description' hasFeedback>
          {getFieldDecorator('description', {
            rules: [{ _required: true, message: 'Please input description' }],
          })(<Input.TextArea rows={4} prefix={<Icon type='fire' />} placeholder='Description' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Add Tags'>
          {getFieldDecorator('tags', {
            rules: [{ _required: true, message: 'Please add animal tags', type: 'array' }],
          })(<Select mode='tags' placeholder='Add tags'></Select>)}
        </Form.Item>

        <Form.Item label='Pet images'>
          <div className='dropbox'>
            {getFieldDecorator('images', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              rules: [
                {
                  required: true,
                  message: 'Please upload picture(s)',
                },
              ],
            })(
              <Upload.Dragger onPreview={() => null} beforeUpload={() => false} multiple={true}>
                <p className='ant-upload-drag-icon'>
                  <Icon type='inbox' />
                </p>
                <p className='ant-upload-text'>Click or drag file to area to upload</p>
                <p className='ant-upload-hint'>Select pet image</p>
              </Upload.Dragger>
            )}
          </div>
        </Form.Item>

        <NextStep current={props.current} onClick={props.nextStep} />
      </Form>
    </Card>
  );
}

const onFieldsChange = (props, changedFields) => {
  props.onChange(changedFields);
};

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

const PetInfo = Form.create({
  name: 'step_1_petinfo',
  onFieldsChange,
  mapPropsToFields,
})(PetInfoForm);

export default PetInfo;
