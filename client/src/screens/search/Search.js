import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Button, Icon, Layout, message, Alert, Pagination } from 'antd';
import { cats } from '../../data/pets';
import { navigate } from '@reach/router';
import initialFormState from './initialFormState';
import apiClient from '../../utils/apiClient';
import { petsActions } from '../../redux/pets';
import { useSelector, useDispatch } from 'react-redux';
import PetsList from '../../components/pet/PetsList';

const { Option } = Select;
const { Search } = Input;

const updateFilterUrlQuery = (key, val) => {
  const { search, pathname } = window.location;
  const urlParams = new URLSearchParams(search);
  const urlContainsKey = search.includes(key);

  if (urlContainsKey) {
    urlParams.delete(key);
    if (Array.isArray(val)) {
      val.forEach(v => urlParams.append(key, v));
    } else {
      urlParams.append(key, val);
    }
  } else {
    if (Array.isArray(val)) {
      val.forEach(v => urlParams.append(key, v));
    } else {
      urlParams.append(key, val);
    }
  }

  const queryStr = urlParams.toString();
  const URI = queryStr.length ? `${pathname}?${queryStr}` : pathname;
  navigate(URI);
};

function SearchPage() {
  const dispatch = useDispatch();
  const petsSearchResults = useSelector(state => state.pets.list);
  const petsSearchMeta = useSelector(state => state.pets.meta);
  const searchError = useSelector(state => state.error.message);

  const [topFilterFilled, setTopFilterFilled] = useState(false);
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = name => e => {
    if (name === 'days') {
      const { search, pathname } = window.location;
      const urlParams = new URLSearchParams(search);

      const doSearch = () => {
        urlParams.append(name, e);
        const queryStr = urlParams.toString();
        navigate(pathname + '?' + queryStr);
        dispatch(petsActions.searchPetsByFilter(`animals?${queryStr}`));
      };

      if (search.includes('days')) {
        urlParams.delete('days');
        doSearch();
      } else {
        doSearch();
      }
    }

    if (name === 'zip') {
      e.persist();
      setFormState(state => ({ ...state, [name]: e.target.value }));
    } else {
      setFormState(state => ({ ...state, [name]: e }));
    }
  };

  const searchPets = async () => {
    const { type, distance, zip } = formState;
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
    } else if (isEmpty(zip)) {
      message.warn('Need valid ZIP to start');
    } else {
      updateQueryParam('type');
      updateQueryParam('distance');
      updateQueryParam('zip');

      if (formState['countryCode']) {
        updateQueryParam('countryCode');
      }

      const queryStr = urlParams.toString();
      navigate(pathname + '?' + queryStr);

      try {
        await dispatch(petsActions.searchPetsByFilter(`animals?${queryStr}`));
        setTopFilterFilled(true);
      } catch (err) {
        setTopFilterFilled(false);
        dispatch(petsActions.clearSearch());
      }
    }
  };

  const handleMultiSelect = name => valsArr => {
    setFormState(state => ({ ...state, [name]: valsArr }));
    updateFilterUrlQuery(name, valsArr);
    dispatch(petsActions.searchPetsByFilter(`animals${window.location.search}`));
  };

  const resetFilters = () => {
    const { type, distance, zip, ...rest } = initialFormState;
    setFormState(state => ({ ...state, ...rest }));
    const { search, pathname } = window.location;
    const urlParams = new URLSearchParams(search);
    const p = new URLSearchParams();
    p.append('type', urlParams.get('type'));
    p.append('distance', urlParams.get('distance'));
    p.append('zip', urlParams.get('zip'));

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
      dispatch(petsActions.searchPetsByFilter(`animals${window.location.search}`));
    } else {
      urlParams.delete(key);
      const queryStr = urlParams.toString();
      const URI = queryStr.length ? `${pathname}?${queryStr}` : pathname;
      navigate(URI);
      dispatch(petsActions.searchPetsByFilter(`animals${window.location.search}`));
    }
  };

  useEffect(() => {
    async function getCountryCode() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async pos => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          const cc = await apiClient.post('animals/countrycode', { data: { loc } });
          setFormState({ countryCode: cc.toUpperCase() });
        });
      }
    }

    getCountryCode();
  }, []);

  const onPaginationLimitChange = (_, limit) => {
    updateFilterUrlQuery('limit', limit);
    dispatch(petsActions.searchPetsByFilter(`animals${window.location.search}`));
  };

  const onPaginationChange = page => {
    updateFilterUrlQuery('page', page);
    dispatch(petsActions.searchPetsByFilter(`animals${window.location.search}`));
  };

  return (
    <>
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
              <Input.Group compact>
                <Input
                  prefix={<Icon type='search' />}
                  size='large'
                  placeholder='ZIP Code'
                  onChange={handleChange('zip')}
                  value={formState['zip']}
                  style={{ width: '70%' }}
                />
                <Input
                  size='large'
                  placeholder='CC'
                  onChange={e => {
                    e.persist();
                    setFormState(st => ({ ...st, countryCode: e.target.value }));
                  }}
                  value={formState['countryCode']}
                  style={{ width: '30%' }}
                />
              </Input.Group>
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
              </Row>
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
                  <label htmlFor='coatLength'>Coat Length</label>
                  <MultiSelect
                    formState={formState}
                    field='coatLength'
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
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    placeholder='Any'
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleChange('days')}
                    value={formState['days']}
                  >
                    {[1, 7, 14, 30].map(opt => (
                      <Option key={opt} value={opt}>
                        {opt === 30 ? '30+' : opt}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <label htmlFor='name'>Pet Name</label>
                  <Search placeholder='Pet Name' onSearch={onNameSearch} enterButton />
                </Col>
              </Row>
            </>
          )}
        </Layout.Content>
      </Layout>

      {searchError && (
        <Row gutter={20} style={{ marginTop: '2.5rem' }}>
          <div style={{ margin: '3rem' }}>
            <Alert message='Search Error' description={searchError} type='error' closable />
          </div>
        </Row>
      )}

      <div style={{ padding: '3rem' }}>
        <PetsList pets={petsSearchResults} linkPrefix='../pet/' />

        {!!petsSearchResults.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <Pagination
              showSizeChanger
              showQuickJumper
              hideOnSinglePage={true}
              defaultCurrent={1}
              defaultPageSize={32}
              pageSizeOptions={['12', '24', '32', '48']}
              current={petsSearchMeta.currentPage}
              total={petsSearchMeta.totalRecords}
              onShowSizeChange={onPaginationLimitChange}
              onChange={onPaginationChange}
              showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
            />
          </div>
        )}
      </div>
    </>
  );
}

function MultiSelect({ field, onChange, options, formState }) {
  return (
    <Select
      style={{ width: '100%' }}
      mode='multiple'
      showArrow
      allowClear
      showSearch
      placeholder='Any'
      optionFilterProp='children'
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={onChange(field)}
      value={formState[field]}
      size='large'
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
