const knex = require('knex');
const { dbFileName, debugDb } = require('../config');

module.exports = knex({
    client: 'sqlite3',
    connection: {
        filename: dbFileName
    },
    useNullAsDefault: true,
    debug: debugDb
});
