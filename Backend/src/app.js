const fs = require('fs');
const path = require('path');
const morgan = require('morgan');


var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));