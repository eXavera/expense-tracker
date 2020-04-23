const express = require('express');
const backend = require('./src/main');
const log = require('./src/log');

const app = express();
backend.setup(app);
app.listen(backend.port, () => log.info('app started, listening on port ' + backend.port));
