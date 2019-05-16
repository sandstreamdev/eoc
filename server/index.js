const app = require('./app');

const PORT = 80;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.info(`EOC server running on port ${PORT}`));
