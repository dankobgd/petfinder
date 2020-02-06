import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Icon, Checkbox, Typography, Radio, Row, Col, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';
import { renderAutocompleteOpts, isCommonAnimal } from '../../data/helpers';

const verticalGap = { marginBottom: 8 };

function EditPetInfoForm(props) {
  const dispatch = useDispatch();
  const { getFieldDecorator, getFieldValue, validateFields, setFieldsValue } = props.form;
  const { pet } = props;
  const [breedRequired, setBreedRequired] = useState(true);
  const [unknownBreedToggled, setUnknownBreedToggled] = useState(false);

  const renderOpts = renderAutocompleteOpts(pet.type, pet.species);

  const handleUnknownBreedToggle = () => {
    setBreedRequired(prev => !prev);
    setUnknownBreedToggled(true);
  };

  const attrs = ['declawed', 'house_trained', 'special_needs', 'vaccinated', 'spayed_neutered'];
  const envs = ['good_with_kids', 'good_with_cats', 'good_with_dogs'];
  const petAttrs = [pet.declawed, pet.house_trained, pet.special_needs, pet.vaccinated, pet.spayed_neutered];
  const petEnvs = [pet.good_with_kids, pet.good_with_cats, pet.good_with_dogs];
  const defaultAttrs = attrs.filter((elm, idx) => petAttrs[idx] && elm);
  const defaultEnvs = envs.filter((elm, idx) => !petEnvs[idx] && elm);

  if (pet.chip_id) {
    defaultAttrs.push('microchip');
  }

  useEffect(() => {
    setFieldsValue({
      name: pet.name,
      gender: pet.gender,
      age: pet.age,
      primaryBreed: pet.primary_breed,
      secondaryBreed: pet.secondary_breed || undefined,
      coatLength: pet.coat_length,
      size: pet.size,
      description: pet.description,
      unknownBreed: pet.unknown_breed,
      attributes: defaultAttrs,
      environment: defaultEnvs,
      colors: pet.colors ? pet.colors : [],
      tags: pet.tags ? pet.tags : [],
    });

    // eslint-disable-next-line
  }, [pet, setFieldsValue]);

  useEffect(() => {
    if (unknownBreedToggled) {
      validateFields(['primaryBreed'], { force: true });
    }
  }, [unknownBreedToggled, validateFields]);

  const handleFormSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) return;
      dispatch(identityActions.updatePet(pet.id, values));
    });
  };

  const isCommonPet = isCommonAnimal(pet.type);

  return (
    <Form layout={'vertical'} onSubmit={handleFormSubmit}>
      <Typography.Title level={4} style={{ marginTop: '2rem' }}>
        Basic Information
      </Typography.Title>

      <Form.Item style={verticalGap} label='Name' hasFeedback>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please input animal name' }],
        })(<Input prefix={<Icon type='fire' />} placeholder='Name' />)}
      </Form.Item>

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

      <Form.Item>
        {getFieldDecorator('unknownBreed', {
          valuePropName: 'checked',
          initialValue: false,
        })(<Checkbox onChange={handleUnknownBreedToggle}>Unknown breed</Checkbox>)}
      </Form.Item>

      {isCommonPet && (
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
      )}

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

      <Form.Item label='select colors' hasFeedback>
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
              {isCommonPet && (
                <Col span={8}>
                  <Checkbox value='declawed'>Declawed</Checkbox>
                </Col>
              )}
              {isCommonPet && (
                <Col span={8}>
                  <Checkbox value='house_trained'>House Trained</Checkbox>
                </Col>
              )}
              {isCommonPet && (
                <Col span={8}>
                  <Checkbox value='spayed_neutered'>Spayed/Neutered</Checkbox>
                </Col>
              )}
              <Col span={8}>
                <Checkbox value='vaccinated'>Vaccinated</Checkbox>
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

      {isCommonPet && (
        <Form.Item label="Doesn't like to be with">
          {getFieldDecorator('environment')(
            <Checkbox.Group>
              <Checkbox value='good_with_kids'>Kids</Checkbox>
              <Checkbox value='good_with_cats'>Cats</Checkbox>
              <Checkbox value='good_with_dogs'>Dogs</Checkbox>
            </Checkbox.Group>
          )}
        </Form.Item>
      )}

      {getFieldValue('attributes') && getFieldValue('attributes').includes('microchip') ? (
        <>
          <Form.Item style={verticalGap} label='Chip ID' hasFeedback>
            {getFieldDecorator('chipId', {
              rules: [{ required: true, message: 'Please input chip ID' }],
              initialValue: pet.chip_id,
            })(<Input prefix={<Icon type='fire' />} placeholder='Microchip ID' />)}
          </Form.Item>
          <Form.Item style={verticalGap} label='Chip Brand' hasFeedback>
            {getFieldDecorator('chipBrand', {
              rules: [{ required: true, message: 'Please input chip brand' }],
              initialValue: pet.chip_brand,
            })(<Input prefix={<Icon type='fire' />} placeholder='Microchip Brand' />)}
          </Form.Item>
          <Form.Item style={verticalGap} label='Chip location' hasFeedback>
            {getFieldDecorator('chipLocation', {
              initialValue: pet.chip_location,
            })(<Input prefix={<Icon type='fire' />} placeholder='Microchip location' />)}
          </Form.Item>
          <Form.Item label='Chip Description' hasFeedback>
            {getFieldDecorator('chipDescription', {
              initialValue: pet.chip_description,
            })(<Input prefix={<Icon type='fire' />} placeholder='Microchip description' />)}
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

      <Form.Item style={verticalGap} label='Add Tags'>
        <Button onClick={handleFormSubmit} type='primary'>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create()(EditPetInfoForm);
