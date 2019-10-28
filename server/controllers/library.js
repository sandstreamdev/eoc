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
  const { library } = req.params;

  try {
    const libraries = JSON.parse(JSON.stringify(data));
    const {
      licenses: licenseType,
      licenseText,
      licenseUrl,
      repository
    } = libraries[decodeURIComponent(library)];

    resp.send({ licenseText, licenseType, licenseUrl, repository });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    resp.sendStatus(400);
  }
};

module.exports = { getLibraries, getLicense };
