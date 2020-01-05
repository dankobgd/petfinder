import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Icon, Checkbox, Typography, Radio, Tooltip, Row, Col, Button } from 'antd';
import { cats, dogs } from '../../data/pets';
import { useDispatch } from 'react-redux';
import { identityActions } from '../../redux/identity';

const { Option } = Select;
const verticalGap = { marginBottom: 8 };

function EditPetInfoForm(props) {
  const dispatch = useDispatch();

  const { getFieldDecorator, getFieldValue, validateFields, setFieldsValue } = props.form;
  const { pet } = props;
  const [breedRequired, setBreedRequired] = useState(true);
  const [unknownBreedToggled, setUnknownBreedToggled] = useState(false);

  const handleUnknownBreedToggle = () => {
    setBreedRequired(prev => !prev);
    setUnknownBreedToggled(true);
  };

  const attrs = ['declawed', 'house_trained', 'special_needs', 'vaccinated', 'spayed_neutered'];
  const envs = ['good_with_kids', 'good_with_cats', 'good_with_dogs'];
  const petAttrs = [pet.declawed, pet.house_trained, pet.special_needs, pet.vaccinated];
  const petEnvs = [pet.good_with_kids, pet.good_with_cats, pet.good_with_dogs];
  const defaultAttrs = attrs.filter((elm, idx) => petAttrs[idx] && elm);
  const defaultEnvs = envs.filter((elm, idx) => petEnvs[idx] && elm);

  useEffect(() => {
    setFieldsValue({
      name: pet.name,
      type: pet.type,
      species: pet.species,
      gender: pet.gender,
      age: pet.age,
      primaryBreed: pet.primary_breed,
      secondaryBreed: pet.secondary_breed || undefined,
      coatLength: pet.coat_length,
      size: pet.size,
      description: pet.description,

      mixedBreed: pet.mixed_breed ? ['mixedBreed'] : [],
      unknownBreed: pet.unknown_breed ? ['unknown_breed'] : [],
      attributes: defaultAttrs,
      environment: defaultEnvs,

      colors: pet.colors ? pet.colors : [],
      tags: pet.tags ? pet.tags : [],

      // microchip: pet.microchip,
      // chipId: pet.chipId,
      // chipBrand: pet.chip_brand,
      // chipLocation: pet.chip_location,
      // chipDescription: pet.chip_description,
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
      if (!err) {
        dispatch(identityActions.updatePet(pet.id, values));
      }
    });
  };

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

      <Form.Item style={verticalGap} label='Type' hasFeedback className='custom-feedback'>
        {getFieldDecorator('type', {
          rules: [{ required: true, message: 'Please select animal type' }],
        })(
          <Radio.Group buttonStyle='solid'>
            <Radio.Button value='Cat'>Cat</Radio.Button>
            <Radio.Button value='Dog'>Dog</Radio.Button>
            <Radio.Button value='Rabbit'>Rabbit</Radio.Button>
            <Radio.Button value='Bird'>Bird</Radio.Button>
            <Radio.Button value='Fish'>Fish</Radio.Button>
          </Radio.Group>
        )}
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

      <Form.Item label='Species' hasFeedback>
        {getFieldDecorator('species', {
          rules: [{ required: true, message: 'Please input animal species' }],
        })(<Input prefix={<Icon type='fire' />} placeholder='Species' />)}
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
            {getFieldValue('type') === 'Dog'
              ? dogs.breeds.map(dog => (
                  <Option key={dog} value={dog}>
                    {dog}
                  </Option>
                ))
              : getFieldValue('type') === 'Cat'
              ? cats.breeds.map(cat => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))
              : null}
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
            {getFieldValue('type') === 'Dog'
              ? dogs.breeds.map(dog => (
                  <Option key={dog} value={dog}>
                    {dog}
                  </Option>
                ))
              : getFieldValue('type') === 'Cat'
              ? cats.breeds.map(cat => (
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
            {getFieldValue('type') === 'Dog'
              ? dogs.colors.map(dog => (
                  <Option key={dog} value={dog}>
                    {dog}
                  </Option>
                ))
              : getFieldValue('type') === 'Cat'
              ? cats.colors.map(cat => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))
              : null}
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

      {/* {getFieldValue('attributes').includes('microchip') ? (
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
      ) : null} */}

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
