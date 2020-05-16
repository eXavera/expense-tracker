const Router = require('express').Router;
const database = require('../database.knex');
const DataAccess = require('./dataAccess');
const Service = require('./service');
const routerSetup = require('./routerSetup');

module.exports = () => routerSetup(new Router(), Service(DataAccess(database)));
