const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const items = require('./routes/items.route');
const item = require('./routes/item.route');

const app = express();

// Set up mongodb connection
const dbUrl = 'mongodb://localhost:27017';
mongoose.connect(dbUrl);

app.use(bodyParser.urlencoded({ extended: false, credentials: true }));
app.use(bodyParser.json());
app.use(cors());

// Endpoint for all operations related with /item
app.use('/item', item);

// Endpoint for all operations with /items
app.use('/items', items);

// Root endpoint
app.get('/', (req, resp) => resp.send('Hello World'));

app.listen(8080, () => console.log('Listening on port 8080!'));
