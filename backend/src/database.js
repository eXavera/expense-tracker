const util = require('util');
const { dbFileName } = require('../config');
const log = require('./log');

function Database(sqlite) {
    function open() {
        const db = new sqlite.Database(dbFileName, sqlite.OPEN_READWRITE);
        db.on('error', err => {
            log.error(err);
            throw err;
        });

        return {
            selectAsync: util.promisify(db.all).bind(db),
            execAsync: function(sql, params) {
                return new Promise((resolve, reject) => {
                    db.run(sql, params, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    });
                });
            },
            closeAsync: util.promisify(db.close).bind(db)
        };
    }

    return {
        open
    };
}

module.exports = Database;
