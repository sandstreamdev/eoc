const data = require('../data/libraries.json');

const getLibraries = (req, resp) => {
  try {
    const libraries = JSON.parse(JSON.stringify(data));
    const libs = {};

    Object.keys(libraries).forEach(name => {
      libs[name] = { name };
    });

    resp.send(libs);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    resp.sendStatus(400);
  }
};

const getLicense = (req, resp) => {
  const { name } = req.params;

  try {
    const libraries = JSON.parse(JSON.stringify(data));
    const {
      licenses: type,
      licenseText: text,
      licenseUrl: url,
      repository
    } = libraries[decodeURIComponent(name)];

    resp.send({ text, type, repository, url });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    resp.sendStatus(400);
  }
};

module.exports = { getLibraries, getLicense };
