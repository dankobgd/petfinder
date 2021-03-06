import React, { useEffect } from 'react';
import { Row, Col, Form, Input, Select, Button, Icon, Layout, message, Alert, Pagination, Tag, Tooltip } from 'antd';
import { cats } from '../../data/pets';
import { navigate } from '@reach/router';
import initialFormState from './initialFormState';
import apiClient from '../../utils/apiClient';
import { petsActions } from '../../redux/pets';
import { uiActions } from '../../redux/ui';
import { useSelector, useDispatch } from 'react-redux';
import PetsList from '../../components/pet/PetsList';

import { renderAutocompleteOpts, getAutocompleteList, isCommonAnimal } from '../../data/helpers';
import { errorActions } from '../../redux/error';

const { Option } = Select;
const { Search } = Input;

const getQueryString = () => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  return params.toString();
};

const buildURI = params => {
  const { pathname } = window.location;
  const queryStr = params.toString();
  const URI = queryStr.length ? `${pathname}?${queryStr}` : pathname;
  return URI;
};

const updateSearchFilterURI = (key, val, dispatch) => {
  const { search } = window.location;
  const urlParams = new URLSearchParams(search);
  const urlContainsKey = search.includes(key);
  if (urlContainsKey) {
    urlParams.delete(key);
  }
  if (Array.isArray(val)) {
    val.forEach(v => urlParams.append(key, v));
  } else {
    urlParams.append(key, val);
  }
  const URI = buildURI(urlParams);
  navigate(URI);
  dispatch(uiActions.persistQueryString(URI));
};

const resetSearchFilterURI = () => {
  const { search } = window.location;
  const oldParams = new URLSearchParams(search);
  const newParams = new URLSearchParams();
  newParams.append('type', oldParams.get('type'));
  newParams.append('distance', oldParams.get('distance'));
  newParams.append('zip', oldParams.get('zip'));
  if (oldParams.get('countryCode')) {
    newParams.append('countryCode', oldParams.get('countryCode'));
  }
  const URI = buildURI(newParams);
  navigate(URI);
};

function SearchPage() {
  const dispatch = useDispatch();
  const formState = useSelector(state => state.ui.searchForm);
  const searchResults = useSelector(state => state.pets.searchResults);
  const searchMeta = useSelector(state => state.pets.meta);
  const searchError = useSelector(state => state.error.message);
  const topSearchFilterCompleted = useSelector(state => state.ui.topSearchFilterCompleted);
  const searchForm = useSelector(state => state.ui.searchForm);

  const speciesRef = React.useRef(null);

  const handleNameChange = e => {
    dispatch(uiActions.persistSearchForm({ name: e.target.value }));
  };

  const handleChange = name => e => {
    if (name === 'type') {
      dispatch(uiActions.persistSearchForm({ species: undefined, breed: undefined }));
    }
    if (name === 'days') {
      updateSearchFilterURI('days', e, dispatch);
      const queryStr = getQueryString();
      dispatch(petsActions.searchPetsByFilter(queryStr));
    }
    if (name === 'species') {
      updateSearchFilterURI('species', e, dispatch);
      const queryStr = getQueryString();
      dispatch(petsActions.searchPetsByFilter(queryStr));
      dispatch(uiActions.persistSearchForm({ breed: undefined }));
    }
    if (name === 'zip') {
      e.persist();
      dispatch(uiActions.persistSearchForm({ [name]: e.target.value }));
    } else {
      dispatch(uiActions.persistSearchForm({ [name]: e }));
    }
  };

  const searchPets = async () => {
    const { type, distance, zip, countryCode } = formState;
    const isEmpty = elm => elm === undefined || elm === '';

    if (!speciesRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete('species');
      urlParams.delete('breed');
      const URI = buildURI(urlParams);
      navigate(URI);
      dispatch(uiActions.persistQueryString(URI));
    }

    if (isEmpty(type)) {
      message.warn('Enter pet type');
    } else if (isEmpty(distance)) {
      message.warn('Enter distance');
    } else if (isEmpty(zip)) {
      message.warn('Need valid ZIP to start');
    } else {
      updateSearchFilterURI('type', type, dispatch);
      updateSearchFilterURI('distance', distance, dispatch);
      updateSearchFilterURI('zip', zip, dispatch);
      if (countryCode) {
        updateSearchFilterURI('countryCode', countryCode, dispatch);
      }
      try {
        const queryStr = getQueryString();
        await dispatch(petsActions.searchPetsByFilter(queryStr));
        dispatch(uiActions.toggleSearchFilter(true));
        dispatch(errorActions.clearErrors());
      } catch (err) {
        dispatch(uiActions.toggleSearchFilter(false));
        dispatch(petsActions.clearSearch());
      }
    }
  };

  const handleMultiSelect = name => valsArr => {
    dispatch(uiActions.persistSearchForm({ [name]: valsArr }));
    updateSearchFilterURI(name, valsArr, dispatch);
    dispatch(petsActions.searchPetsByFilter(getQueryString()));
  };

  const resetFilters = () => {
    const { type, distance, zip, countryCode, ...rest } = initialFormState;
    dispatch(uiActions.persistSearchForm({ ...rest }));
    resetSearchFilterURI();
    dispatch(petsActions.searchPetsByFilter(getQueryString()));
  };

  const onNameSearch = val => {
    if (val.length) {
      updateSearchFilterURI('name', val, dispatch);
      dispatch(uiActions.persistSearchForm({ name: val }));
      dispatch(petsActions.searchPetsByFilter(getQueryString()));
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete('name');
      const URI = buildURI(urlParams);
      navigate(URI);
      dispatch(petsActions.searchPetsByFilter(getQueryString()));
      dispatch(uiActions.persistQueryString(URI));
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
          dispatch(uiActions.persistSearchForm({ countryCode: cc.toUpperCase() }));
        });
      }
    }
    getCountryCode();
  }, [dispatch]);

  const onPaginationLimitChange = (_, limit) => {
    updateSearchFilterURI('limit', limit, dispatch);
    dispatch(petsActions.searchPetsByFilter(getQueryString()));
  };

  const onPaginationChange = page => {
    updateSearchFilterURI('page', page, dispatch);
    dispatch(petsActions.searchPetsByFilter(getQueryString()));
  };

  const pickedType = formState['type'] || '';
  const pickedSpecies = formState['species'] || '';
  const renderOpts = renderAutocompleteOpts(pickedType, pickedSpecies);
  const getAutocompList = getAutocompleteList(pickedType, pickedSpecies);

  const removeSingleFilter = (key, val) => {
    dispatch(uiActions.removeFromSearchForm(key, val));
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(key);
    const URI = buildURI(urlParams);
    navigate(URI);
    dispatch(petsActions.searchPetsByFilter(getQueryString()));
    dispatch(uiActions.persistQueryString(URI));
  };

  const isCommonPet = isCommonAnimal(formState['type']);

  return (
    <>
      <Layout style={{ padding: '0 24px' }}>
        <Layout.Content style={{ padding: 24, margin: 0 }}>
          <Row type='flex' gutter={20} style={{ justifyContent: 'center' }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ margin: '1rem 0' }}>
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
                {['Cat', 'Dog', 'Rabbit', 'Bird', 'Small & Furry', 'Aquatic & Reptiles'].map(opt => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ margin: '1rem 0' }}>
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
            <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ margin: '1rem 0' }}>
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
                    dispatch(uiActions.persistSearchForm({ countryCode: e.target.value }));
                  }}
                  value={formState['countryCode']}
                  style={{ width: '30%' }}
                />
              </Input.Group>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ margin: '1rem 0' }}>
              <Button type='primary' size='large' onClick={searchPets}>
                Search
              </Button>
            </Col>
          </Row>

          {topSearchFilterCompleted && (
            <>
              <Row type='flex' gutter={20} style={{ marginTop: '2.5rem', justifyContent: 'flex-start' }}>
                {formState['type'] && !formState['type'].match(/Cat|Dog|Rabbit/g) && (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                    <label htmlFor='species'>Species</label>
                    <Select
                      ref={speciesRef}
                      style={{ width: '100%' }}
                      showSearch
                      placeholder='Species'
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={handleChange('species')}
                      value={formState['species']}
                      size='large'
                    >
                      {renderOpts('species')}
                    </Select>
                  </Col>
                )}

                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='breed'>Breed</label>
                  <MultiSelect
                    formState={formState}
                    field='breed'
                    onChange={handleMultiSelect}
                    options={getAutocompList('breeds')}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='age'>Age</label>
                  <MultiSelect
                    formState={formState}
                    field='age'
                    onChange={handleMultiSelect}
                    options={['Baby', 'Young', 'Adult', 'Senior']}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='size'>Size</label>
                  <MultiSelect
                    formState={formState}
                    field='size'
                    onChange={handleMultiSelect}
                    options={['Small', 'Medium', 'Large', 'XL']}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='gender'>Gender</label>
                  <MultiSelect
                    formState={formState}
                    field='gender'
                    onChange={handleMultiSelect}
                    options={['Male', 'Female']}
                  />
                </Col>
                {isCommonPet && (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                    <label htmlFor='goodWith'>Good With</label>
                    <MultiSelect
                      formState={formState}
                      field='goodWith'
                      onChange={handleMultiSelect}
                      options={['Cats', 'Dogs', 'Kids']}
                    />
                  </Col>
                )}
              </Row>
              <Row gutter={20} style={{ marginTop: '1.5rem' }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='care'>Care & Behaviour</label>
                  <MultiSelect
                    formState={formState}
                    field='care'
                    onChange={handleMultiSelect}
                    options={
                      isCommonPet
                        ? ['House Trained', 'Declawed', 'Special Needs', 'Vaccinated', 'Spayed/Neutered']
                        : ['Vaccinated', 'Special Needs', 'Spayed/Neutered']
                    }
                  />
                </Col>
                {isCommonPet && (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                    <label htmlFor='coatLength'>Coat Length</label>
                    <MultiSelect
                      formState={formState}
                      field='coatLength'
                      onChange={handleMultiSelect}
                      options={['Hairless', 'Short', 'Medium', 'Long']}
                    />
                  </Col>
                )}
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='color'>Color</label>
                  <MultiSelect formState={formState} field='color' onChange={handleMultiSelect} options={cats.colors} />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='days'>Days on Petfinder</label>
                  <Select
                    style={{ width: '100%' }}
                    showSearch
                    placeholder='Any'
                    optionFilterProp='children'
                    size='large'
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

                <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                  <label htmlFor='name'>Pet Name</label>
                  <Search
                    size='large'
                    placeholder='Pet Name'
                    value={formState['name']}
                    onChange={handleNameChange}
                    onSearch={onNameSearch}
                    enterButton
                  />
                </Col>

                <Col xs={24} sm={12} md={8} lg={6} xl={4} style={{ marginTop: 20 }}>
                  <Button type='danger' icon='close' onClick={resetFilters} size='large'>
                    Reset Filters
                  </Button>
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
        {searchMeta && (
          <span
            style={{
              padding: '8px 12px',
              marginBottom: '1rem',
              fontSize: 18,
              background: '#f8f8f8',
              borderRadius: 6,
              border: '1px solid #c4c4c4',
            }}
          >
            {getTotalResultsFound(formState['type'], searchMeta.totalRecords)}
          </span>
        )}

        {topSearchFilterCompleted && searchForm && Object.keys(searchError.length) && (
          <div style={{ border: '1px solid #e6daff', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
            {Object.entries(searchForm).map(([key, val]) =>
              Array.isArray(val)
                ? val.length > 0 &&
                  val.map(v => (
                    <Tooltip title={key} key={v}>
                      <Tag
                        color={!key.match(/type|distance|zip|countryCode/g) ? 'purple' : 'green'}
                        className='search-filter-tag'
                        closable={!key.match(/type|distance|zip|countryCode/g)}
                        onClose={() => removeSingleFilter(key, v)}
                      >
                        {v}
                      </Tag>
                    </Tooltip>
                  ))
                : val && (
                    <Tooltip title={key} key={val}>
                      <Tag
                        color={!key.match(/type|distance|zip|countryCode/g) ? 'purple' : 'green'}
                        className='search-filter-tag'
                        closable={!key.match(/type|distance|zip|countryCode/g)}
                        onClose={() => removeSingleFilter(key, val)}
                      >
                        {val}
                      </Tag>
                    </Tooltip>
                  )
            )}
          </div>
        )}

        <PetsList pets={searchResults} linkPrefix='../pet/' />

        {!!searchResults.length && searchMeta && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <Pagination
              showSizeChanger
              showQuickJumper
              hideOnSinglePage={true}
              defaultCurrent={1}
              defaultPageSize={32}
              pageSizeOptions={['12', '24', '32', '48']}
              current={searchMeta.currentPage}
              total={searchMeta.totalRecords}
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

function getTotalResultsFound(word, count) {
  if (word.match(/Cat|Dog|Rabbit|Bird/g)) {
    if (count === 0) return `No ${word}s found`;
    if (count === 1) return `${count} ${word} found`;
    if (count > 1) return `${count} ${word}s found`;
  } else if (word === 'Aquatic & Reptiles') {
    if (count === 0) return `No Aquatic & Reptiles found`;
    if (count === 1) return `${count} Aquatic & Reptiles found`;
    if (count > 1) return `${count} Aquatic & Reptiles found`;
  } else if (word === 'Small & Furry') {
    if (count === 0) return `No Small & Furry animals found`;
    if (count === 1) return `${count} Small & Furry animal found`;
    if (count > 1) return `${count} Small & Furry animals found`;
  }
}

export default Form.create()(SearchPage);
