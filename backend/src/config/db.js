const knex = require('knex');
const knexConfig = require('../../knexfile');
const vars = require('./vars');

const config = knexConfig[vars.env] || knexConfig.development;

module.exports = knex(config);
