const express = require('express');
const backend = require('./src/main');

const app = express();
backend.setup(app);
app.listen(backend.port, () => console.log('listening on port ' + backend.port));
