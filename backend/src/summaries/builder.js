const Repository = require('./repository');
const Controller = require('./controller');
const database = require('../database.knex');

module.exports = () => Controller(Repository(database));
