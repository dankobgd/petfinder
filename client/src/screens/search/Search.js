import React, { useState } from 'react';
import { Row, Col, Form, Input, Select, Button, Icon, Layout, message } from 'antd';
import { cats } from '../../data/pets';
import { navigate } from '@reach/router';
import initialFormState from './initialFormState';
import apiClient from '../../utils/apiClient';

const { Option } = Select;
const { Search } = Input;

const updateFilterUrlQuery = (key, values) => {
  const { search, pathname } = window.location;
  const urlParams = new URLSearchParams(search);
  const urlContainsKey = search.includes(key);

  if (urlContainsKey) {
    urlParams.delete(key);
    values.forEach(v => urlParams.append(key, v));
  } else {
    values.forEach(v => urlParams.append(key, v));
  }

  const queryStr = urlParams.toString();
  const URI = queryStr.length ? `${pathname}?${queryStr}` : pathname;

  navigate(URI);
};

function SearchPage() {
  const [topFilterFilled, setTopFilterFilled] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);

  const handleToggleFilters = () => {
    setMoreFiltersOpen(flt => !flt);
  };

  const handleChange = name => e => {
    if (name === 'cityOrZip') {
      e.persist();
      setFormState(state => ({ ...state, [name]: e.target.value }));
    } else {
      setFormState(state => ({ ...state, [name]: e }));
    }
  };

  const searchPets = () => {
    const { type, distance, cityOrZip } = formState;
    const isEmpty = elm => elm === undefined || elm === '';
    const { search, pathname } = window.location;
    const urlParams = new URLSearchParams(search);

    const updateQueryParam = name => {
      if (search.includes(name)) {
        urlParams.delete(name);
        urlParams.append(name, formState[name]);
      } else {
        urlParams.append(name, formState[name]);
      }
    };

    if (isEmpty(type)) {
      message.warn('Enter pet type');
    } else if (isEmpty(distance)) {
      message.warn('Enter distance');
    } else if (isEmpty(cityOrZip)) {
      message.warn('Need valid ZIP to start');
    } else {
      setTopFilterFilled(true);
      updateQueryParam('type');
      updateQueryParam('distance');
      updateQueryParam('cityOrZip');

      const queryStr = urlParams.toString();
      navigate(pathname + '?' + queryStr);
    }
  };

  const handleMultiSelect = name => valsArr => {
    setFormState(state => ({ ...state, [name]: valsArr }));
    updateFilterUrlQuery(name, valsArr);
    apiClient.get(`animals${window.location.search}`);
  };

  const resetFilters = () => {
    const { type, distance, cityOrZip, ...rest } = initialFormState;
    setFormState(state => ({ ...state, ...rest }));
    const { search, pathname } = window.location;
    const urlParams = new URLSearchParams(search);
    const p = new URLSearchParams();
    p.append('type', urlParams.get('type'));
    p.append('distance', urlParams.get('distance'));
    p.append('cityOrZip', urlParams.get('cityOrZip'));

    const queryStr = p.toString();

    navigate(pathname + '?' + queryStr);
  };

  const onNameSearch = val => {
    const { search, pathname } = window.location;
    const urlParams = new URLSearchParams(search);
    const key = 'name';

    if (val.length) {
      if (search.includes(key)) {
        urlParams.delete(key);
        urlParams.append(key, val);
      } else {
        urlParams.append(key, val);
      }
      const queryStr = urlParams.toString();
      const URI = queryStr.length ? `${pathname}?${queryStr}` : pathname;
      navigate(URI);
    } else {
      urlParams.delete(key);
      const queryStr = urlParams.toString();
      const URI = queryStr.length ? `${pathname}?${queryStr}` : pathname;
      navigate(URI);
    }
  };

  return (
    <Layout style={{ padding: '0 24px' }}>
      <Layout.Content style={{ padding: 24, margin: 0 }}>
        <Row gutter={20}>
          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder='Type'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChange('type')}
              value={formState['type']}
              size='large'
            >
              {['Cat', 'Dog', 'Rabbit', 'Fish', 'Bird'].map(opt => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder='Distance'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={handleChange('distance')}
              value={formState['distance']}
              size='large'
            >
              {['10km', '25km', '50km', '100km', 'Anywhere'].map(opt => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
            <Input
              prefix={<Icon type='search' />}
              size='large'
              placeholder='City or ZIP'
              onChange={handleChange('cityOrZip')}
              value={formState['cityOrZip'] || ''}
            />
          </Col>
          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
            <Button type='primary' size='large' onClick={searchPets}>
              Search
            </Button>
          </Col>
        </Row>

        {topFilterFilled && (
          <>
            <Row gutter={20} style={{ marginTop: '2.5rem' }}>
              <Col xs={12} sm={12} md={4} lg={4} xl={4} offset={20}>
                <Button icon='close' onClick={resetFilters}>
                  Reset Filters
                </Button>
              </Col>
            </Row>

            <Row gutter={20} style={{ marginTop: '2.5rem' }}>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <label htmlFor='breed'>Breed</label>
                <MultiSelect formState={formState} field='breed' onChange={handleMultiSelect} options={cats.breeds} />
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <label htmlFor='age'>Age</label>
                <MultiSelect
                  formState={formState}
                  field='age'
                  onChange={handleMultiSelect}
                  options={['Baby', 'Young', 'Adult', 'Senior']}
                />
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <label htmlFor='size'>Size</label>
                <MultiSelect
                  formState={formState}
                  field='size'
                  onChange={handleMultiSelect}
                  options={['Small', 'Medium', 'Large', 'XL']}
                />
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <label htmlFor='gender'>Gender</label>
                <MultiSelect
                  formState={formState}
                  field='gender'
                  onChange={handleMultiSelect}
                  options={['Male', 'Female']}
                />
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <label htmlFor='goodWith'>Good With</label>
                <MultiSelect
                  formState={formState}
                  field='goodWith'
                  onChange={handleMultiSelect}
                  options={['Cats', 'Dogs', 'Kids']}
                />
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                {moreFiltersOpen ? (
                  <Button style={{ marginTop: 20 }} onClick={handleToggleFilters} icon='minus'>
                    Less Filters
                  </Button>
                ) : (
                  <Button style={{ marginTop: 20 }} onClick={handleToggleFilters} icon='plus'>
                    More Filters
                  </Button>
                )}
              </Col>
            </Row>

            {moreFiltersOpen && (
              <Row gutter={20} style={{ marginTop: '1.5rem' }}>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <label htmlFor='care'>Care & Behaviour</label>
                  <MultiSelect
                    formState={formState}
                    field='care'
                    onChange={handleMultiSelect}
                    options={['House Trained', 'Declawed', 'Special Needs', 'Vaccinated', 'Spayed/Neutered']}
                  />
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <label htmlFor='coat'>Coat</label>
                  <MultiSelect
                    formState={formState}
                    field='coat'
                    onChange={handleMultiSelect}
                    options={['Hairless', 'Medium', 'Short', 'Long']}
                  />
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <label htmlFor='color'>Color</label>
                  <MultiSelect formState={formState} field='color' onChange={handleMultiSelect} options={cats.colors} />
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <label htmlFor='days'>Days on Petfinder</label>
                  <MultiSelect
                    formState={formState}
                    field='days'
                    onChange={handleMultiSelect}
                    options={['1', '7', '14', '30+']}
                  />
                </Col>

                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <label htmlFor='name'>Pet Name</label>
                  <Search placeholder='Pet Name' onSearch={onNameSearch} enterButton />
                </Col>
              </Row>
            )}
          </>
        )}
      </Layout.Content>
    </Layout>
  );
}

function MultiSelect({ field, onChange, options, formState }) {
  return (
    <Select
      style={{ width: '100%' }}
      mode='multiple'
      showSearch
      placeholder='Any'
      optionFilterProp='children'
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={onChange(field)}
      value={formState[field]}
    >
      {options.map(opt => (
        <Option key={opt} value={opt}>
          {opt}
        </Option>
      ))}
    </Select>
  );
}

export default Form.create()(SearchPage);
