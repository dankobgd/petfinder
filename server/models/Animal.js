const createModel = require('../utils/create-model-skeleton');

const name = 'Animal';
const tableName = 'animals';
const selectableProps = [
  'id',
  'user_id',
  'name',
  'type',
  'species',
  'gender',
  'age',
  'coat',
  'size',
  'description',
  'status',
  'imageUrl',
  'updated_at',
  'created_at',
  'deleted_at',
];

module.exports = knex => {
  const base = createModel({
    knex,
    name,
    tableName,
    selectableProps,
  });

  return {
    ...base,
  };
};
