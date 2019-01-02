const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const item = require('./routes/item');
const items = require('./routes/items');
const DB_URL = require('./common/variables');

const app = express();

// Set up mongodb connection
const dbUrl = DB_URL;
mongoose.connect(dbUrl);

app.use(bodyParser.urlencoded({ extended: false, credentials: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('../../dist'));

// Endpoint for all operations related with /item
app.use('/item', item);

// Endpoint for all operations with /items
app.use('/items', items);

// Root endpoint
app.get('/', (req, resp) => resp.status(200).send('Hello World'));

app.listen(8080, () => console.info('Listening on port 8080!'));
