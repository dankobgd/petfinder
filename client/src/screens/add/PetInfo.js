import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Upload, Icon, Checkbox, Typography, Card, Radio, Modal, Tooltip, Row, Col } from 'antd';
import { NextStep } from './StepperButton';
import getBase64 from '../../utils/getBase64';
import { renderAutocompleteOpts } from '../../data/helpers';

const verticalGap = { marginBottom: 8 };

function PetInfoForm(props) {
  const { getFieldDecorator, getFieldValue, validateFields, setFieldsValue } = props.form;
  const [breedRequired, setBreedRequired] = useState(true);
  const [unknownBreedToggled, setUnknownBreedToggled] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const [previewImageVisible, setPreviewImageVisible] = useState(false);

  const renderOpts = renderAutocompleteOpts(getFieldValue('type'), getFieldValue('species'));

  const handleUnknownBreedToggle = () => {
    setBreedRequired(prev => !prev);
    setUnknownBreedToggled(true);
  };

  const normFile = e => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handlePreviewCancel = () => setPreviewImageVisible(false);

  const handlePreviewGallery = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImageSrc(file.url || file.preview);
    setPreviewImageVisible(true);
  };

  useEffect(() => {
    if (unknownBreedToggled) {
      validateFields(['primaryBreed'], { force: true });
    }
  }, [unknownBreedToggled, validateFields]);

  const clearNonexistingFields = () => {
    setFieldsValue({
      primaryBreed: undefined,
      secondaryBreed: undefined,
      colors: undefined,
      species: undefined,
    });
  };

  return (
    <Card>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Add a pet for adoption
      </Typography.Title>

      <Form layout={'vertical'}>
        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Basic Information
        </Typography.Title>

        <Form.Item style={verticalGap} label='Name' hasFeedback>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input animal name' }],
          })(<Input prefix={<Icon type='fire' />} placeholder='Name' />)}
        </Form.Item>

        <Form.Item style={verticalGap} label='Type' hasFeedback className='custom-feedback'>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please select animal type' }],
          })(
            <Radio.Group buttonStyle='solid' onChange={clearNonexistingFields}>
              <Radio.Button value='Cat'>Cat</Radio.Button>
              <Radio.Button value='Dog'>Dog</Radio.Button>
              <Radio.Button value='Rabbit'>Rabbit</Radio.Button>
              <Radio.Button value='Bird'>Bird</Radio.Button>
              <Radio.Button value='SmallAndFurry'>Small & Furry</Radio.Button>
              <Radio.Button value='AquaticAndReptiles'>Aquatic & Reptiles</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        {getFieldValue('type') && !getFieldValue('type').match(/Cat|Dog|Rabbit/g) ? (
          <Form.Item style={verticalGap} label='Species' hasFeedback>
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
        ) : null}

        <Form.Item style={verticalGap} label='Gender' hasFeedback className='custom-feedback'>
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: 'Please select animal gender' }],
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='Male'>Male</Radio.Button>
              <Radio.Button value='Female'>Female</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item style={verticalGap} label='Age' hasFeedback className='custom-feedback'>
          {getFieldDecorator('age', {
            rules: [{ required: true, message: 'Please select animal age' }],
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='Baby'>Baby</Radio.Button>
              <Radio.Button value='Young'>Young</Radio.Button>
              <Radio.Button value='Adult'>Adult</Radio.Button>
              <Radio.Button value='Senior'>Senior</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Additional details
        </Typography.Title>

        <Form.Item style={verticalGap} label='Primary Breed' hasFeedback>
          {getFieldDecorator('primaryBreed', {
            rules: [{ required: breedRequired, message: 'Please select primary breed' }],
          })(
            <Select
              showSearch
              placeholder='Select primary breed'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {renderOpts('breeds')}
            </Select>
          )}
        </Form.Item>

        <Form.Item style={verticalGap} label='Secondary Breed' hasFeedback>
          {getFieldDecorator('secondaryBreed')(
            <Select
              showSearch
              placeholder='Select secondary breed'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {renderOpts('breeds')}
            </Select>
          )}
        </Form.Item>

        <Row>
          <Col span={12}>
            <Form.Item style={verticalGap}>
              {getFieldDecorator('mixedBreed')(
                <Checkbox.Group>
                  <Checkbox value='mixedBreed'>Mixed Breed</Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item style={verticalGap}>
              {getFieldDecorator('unknownBreed')(
                <Checkbox.Group>
                  <Checkbox value='unknownBreed' checked={breedRequired} onChange={handleUnknownBreedToggle}>
                    Unknown Breed
                  </Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={verticalGap} label='Coat Length' hasFeedback className='custom-feedback'>
          {getFieldDecorator('coatLength', {
            rules: [{ required: true, message: 'Please select animal coat length' }],
          })(
            <Radio.Group placeholder='Select coat length' buttonStyle='solid'>
              <Radio.Button value='Hairless'>Hairless</Radio.Button>
              <Radio.Button value='Short'>Short</Radio.Button>
              <Radio.Button value='Medium'>Medium</Radio.Button>
              <Radio.Button value='Long'>Long</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item style={verticalGap} label='Size when grown' hasFeedback className='custom-feedback'>
          {getFieldDecorator('size', {
            rules: [{ required: true, message: 'Please select animal size' }],
          })(
            <Radio.Group placeholder='Animal size' buttonStyle='solid'>
              <Radio.Button value='Small'>Small</Radio.Button>
              <Radio.Button value='Medium'>Medium</Radio.Button>
              <Radio.Button value='Large'>Large</Radio.Button>
              <Radio.Button value='XL'>Extra Large</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item
          label={
            <span>
              Animal Color&nbsp;
              <Tooltip title='select colors by hierarchy in order: primary -> secondary -> tertiary etc'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }
          hasFeedback
        >
          {getFieldDecorator('colors', {
            rules: [{ required: true, message: 'Please select animal colors', type: 'array' }],
          })(
            <Select
              mode='multiple'
              showSearch
              placeholder='Select animal colors'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {renderOpts('colors')}
            </Select>
          )}
        </Form.Item>

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Attributes & Environment
        </Typography.Title>

        <Form.Item style={verticalGap} label='Attributes'>
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
                <Col span={8}>
                  <Checkbox value='microchip'>Has Microchip</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          )}
        </Form.Item>

        <Form.Item label="Doesn't like to be with">
          {getFieldDecorator('environment')(
            <Checkbox.Group>
              <Checkbox value='good_with_kids'>Kids</Checkbox>
              <Checkbox value='good_with_cats'>Cats</Checkbox>
              <Checkbox value='good_with_dogs'>Dogs</Checkbox>
            </Checkbox.Group>
          )}
        </Form.Item>

        {getFieldValue('attributes').includes('microchip') ? (
          <>
            <Form.Item style={verticalGap} label='Chip ID' hasFeedback>
              {getFieldDecorator('chipId', {
                rules: [{ required: true, message: 'Please input chip ID' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip ID' />)}
            </Form.Item>
            <Form.Item style={verticalGap} label='Chip Brand' hasFeedback>
              {getFieldDecorator('chipBrand', {
                rules: [{ required: true, message: 'Please input chip brand' }],
              })(<Input prefix={<Icon type='fire' />} placeholder='Microchip Brand' />)}
            </Form.Item>
            <Form.Item style={verticalGap} label='Chip location' hasFeedback>
              {getFieldDecorator('chipLocation')(
                <Input prefix={<Icon type='fire' />} placeholder='Microchip location' />
              )}
            </Form.Item>
            <Form.Item label='Chip Description' hasFeedback>
              {getFieldDecorator('chipDescription')(
                <Input prefix={<Icon type='fire' />} placeholder='Microchip description' />
              )}
            </Form.Item>
          </>
        ) : null}

        <Typography.Title level={4} style={{ marginTop: '2rem' }}>
          Personal Message & Image
        </Typography.Title>

        <Form.Item style={verticalGap} label='Description' hasFeedback>
          {getFieldDecorator('description')(
            <Input.TextArea rows={4} prefix={<Icon type='fire' />} placeholder='Description' />
          )}
        </Form.Item>

        <Form.Item style={verticalGap} label='Add Tags'>
          {getFieldDecorator('tags')(<Select mode='tags' placeholder='Add tags'></Select>)}
        </Form.Item>

        <Form.Item style={verticalGap} label='Choose pet profile image'>
          <div className='dropbox'>
            {getFieldDecorator('profileImage', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              rules: [
                {
                  required: true,
                  message: 'Please upload pet profile image',
                },
              ],
            })(
              <Upload
                accept='.jpg,.jpeg,.png,.bmp,.gif'
                beforeUpload={() => false}
                listType='picture-card'
                showUploadList={true}
                onPreview={handlePreviewGallery}
              >
                {!props.profileImage.value.length && (
                  <div>
                    <Icon type='plus' />
                    <div className='ant-upload-text'>Upload</div>
                  </div>
                )}
              </Upload>
            )}
          </div>
        </Form.Item>

        <Form.Item
          style={verticalGap}
          _label='Select pet gallery images'
          label={
            <span>
              Select pet gallery images&nbsp;
              <Tooltip title='They describe your pet better and are seen in details page. You you can always add them later.'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }
        >
          <div className='dropbox'>
            {getFieldDecorator('galleryImages', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            })(
              <Upload.Dragger
                accept='.jpg,.jpeg,.png,.bmp,.gif'
                multiple={true}
                beforeUpload={() => false}
                listType='picture-card'
                showUploadList={true}
                onPreview={handlePreviewGallery}
              >
                <p className='ant-upload-drag-icon'>
                  <Icon type='inbox' />
                </p>
                <p className='ant-upload-text'>Click or drag file to area to upload</p>
                <p className='ant-upload-hint'>Select pet image</p>
              </Upload.Dragger>
            )}
          </div>
        </Form.Item>

        <Modal visible={previewImageVisible} footer={null} onCancel={handlePreviewCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImageSrc} />
        </Modal>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <NextStep current={props.current} onClick={props.nextStep} />
        </div>
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
