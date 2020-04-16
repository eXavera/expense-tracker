const backend = require('../backend/src/main');

module.exports = {
    devServer: {
        before: backend.setup,
        disableHostCheck: true,
        port: backend.port
    }
};
