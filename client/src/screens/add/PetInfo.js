import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Input, Upload, Icon, Checkbox, Typography, Card, Radio, Tooltip, Row, Col } from 'antd';

const { Option } = Select;

const vGap = { marginBottom: 8 };

function PetInfo(props) {
  const { getFieldDecorator, getFieldValue, validateFields } = props.form;

  const [breedRequired, setBreedRequired] = useState(true);
  const [unknownBreedToggled, setUnknownBreedToggled] = useState(false);

  const handleChange = () => {
    setBreedRequired(prev => !prev);
    setUnknownBreedToggled(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
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

      <Form layout={'vertical'} onSubmit={handleSubmit}>
        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Basic Information
        </Typography.Title>

        <Form.Item style={vGap} label='Name' hasFeedback>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input name' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Name' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Type'>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: 'Enter animal type' }],
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='cat'>Cat</Radio.Button>
              <Radio.Button value='dog'>Dog</Radio.Button>
              <Radio.Button value='rabbit'>Rabbit</Radio.Button>
              <Radio.Button value='bird'>Bird</Radio.Button>
              <Radio.Button value='fish'>Fish</Radio.Button>
              <Radio.Button value='small_furry'>Small & Furry</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item style={vGap} label='Species' hasFeedback>
          {getFieldDecorator('species', {
            rules: [{ required: true, message: 'Please input animal species' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Species' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Gender' hasFeedback>
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Enter coat length' }],
          })(
            <Select placeholder='Select gender'>
              <Option value='male'>male</Option>
              <Option value='female'>female</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Age' hasFeedback>
          {getFieldDecorator('age', {
            rules: [{ required: true, message: 'Enter age' }],
          })(
            <Select placeholder='Animal age'>
              <Option value='baby'>baby</Option>
              <Option value='young'>young</Option>
              <Option value='adult'>adult</Option>
              <Option value='senior'>senior</Option>
            </Select>
          )}
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
            rules: [{ required: breedRequired, message: 'Please input primary breed' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Primary breed' />)}
        </Form.Item>
        <Form.Item style={vGap} label='Secondary Breed' hasFeedback>
          {getFieldDecorator('secondaryBreed')(<Input prefix={<Icon type='fire' />} placeholder='Secondary breed' />)}
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
                  <Checkbox value='unknownBreed' checked={breedRequired} onChange={handleChange}>
                    Unknown breed
                  </Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={vGap} label='Coat Length' hasFeedback>
          {getFieldDecorator('coatLength', {
            rules: [{ required: true, message: 'Enter coat length' }],
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
            rules: [{ required: true, message: 'Enter size' }],
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
            rules: [{ required: true, message: 'Please select animal colors', type: 'array' }],
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
              {getFieldDecorator('microchipId', {
                rules: [{ required: true, message: 'Please input chip ID' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip ID' />)}
            </Form.Item>
            <Form.Item style={vGap} label='Chip Brand' hasFeedback>
              {getFieldDecorator('microchipBrand', {
                rules: [{ required: true, message: 'Please input chip brand' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip Brand' />)}
            </Form.Item>
            <Form.Item style={vGap} label='Chip location' hasFeedback>
              {getFieldDecorator('microchipLocation', {
                rules: [{ required: true, message: 'Please input chip location' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip location' />)}
            </Form.Item>
            <Form.Item style={vGap} label='Chip Description' hasFeedback>
              {getFieldDecorator('microchipDescription', {
                rules: [{ required: true, message: 'Please input chip description' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip description' />)}
            </Form.Item>
          </>
        ) : null}

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Personal Message & Image
        </Typography.Title>

        <Form.Item style={vGap} label='Description' hasFeedback>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input description' }],
          })(<Input.TextArea rows={4} prefix={<Icon type='fire' />} placeholder='Description' />)}
        </Form.Item>

        <Form.Item style={vGap} label='Add Tags'>
          {getFieldDecorator('tags', {
            rules: [{ required: true, message: 'Please add animal tags', type: 'array' }],
          })(<Select mode='tags' placeholder='Add tags'></Select>)}
        </Form.Item>

        <Form.Item label='Pet image'>
          <div className='dropbox'>
            {getFieldDecorator('imageUrl', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            })(
              <Upload.Dragger name='files' action='/animals/create'>
                <p className='ant-upload-drag-icon'>
                  <Icon type='inbox' />
                </p>
                <p className='ant-upload-text'>Click or drag file to area to upload</p>
                <p className='ant-upload-hint'>Select pet image</p>
              </Upload.Dragger>
            )}
          </div>
        </Form.Item>

        {props.current < 2 && (
          <Button style={{ float: 'right' }} type='primary' onClick={() => props.nextStep()}>
            Next
            <Icon type='right' />
          </Button>
        )}
      </Form>
    </Card>
  );
}

export default Form.create({ name: 'PetInfo' })(PetInfo);
