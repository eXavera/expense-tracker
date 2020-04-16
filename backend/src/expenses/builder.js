const sqlite = require('sqlite3').verbose();

const Database = require('../database');
const Repository = require('./repository');
const Controller = require('./controller');

module.exports = () => Controller(Repository(Database(sqlite)));
