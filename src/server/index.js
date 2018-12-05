const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const item = require('./routes/item');
const items = require('./routes/items');
const DB_URL = require('./common/variables');

const app = express();

// Set up mongodb connection
const dbUrl = DB_URL;
mongoose.connect(dbUrl);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint for all operations related with /item
app.use('/item', item);

// Endpoint for all operations with /items
app.use('/items', items);

// Root endpoint
app.get('/', (req, resp) => resp.status(200).send('Hello World'));

app.listen(8080, () => console.info('Listening on port 8080!'));
