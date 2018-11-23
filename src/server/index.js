const express = require('express');
const os = require('os');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connectedto the db');
});

const app = express();

app.use(express.static('dist'));

// Index endpoint
app.get('/', (req, resp) => resp.send('Hello World'));

// Example endpoint
app.get('/api/getUsername', (req, res) =>
  res.send({ username: os.userInfo().username })
);

app.listen(8080, () => console.log('Listening on port 8080!'));

   