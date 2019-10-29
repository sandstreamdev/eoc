/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');

const cliArguments = process.argv.slice(2);
const jsonPath = cliArguments[0];
const markdownPath = cliArguments[1];
const licenseCheckerPath = cliArguments[2];
const licenseCrawlerPath = cliArguments[3];
const licensesCheckerData = require(licenseCheckerPath);
const licensesCrawlerData = require(licenseCrawlerPath);
const endOfLineMarker = os.EOL;
const doubleEndOfLineMarker = `${os.EOL}${os.EOL}`;

const disableLink = text => text.replace(/\./g, '<i></i>.');
const prepareDependenciesList = dependencies => {
  const names = Object.keys(dependencies).sort();
  let content = '';

  names.forEach(name => {
    content += `* ${disableLink(name)}${endOfLineMarker}`;
    content += `  - license: [${dependencies[name].licenses}](${
      dependencies[name].licenseUrl
    })${doubleEndOfLineMarker}`;
    content += `  - repository: ${
      dependencies[name].repository
    }${doubleEndOfLineMarker}`;
  });

  return content;
};

if (!licensesCheckerData || !licensesCrawlerData) {
  return console.error('License data files are missing.');
}

try {
  let content = `# Third-party licenses${endOfLineMarker}${doubleEndOfLineMarker}`;

  content += prepareDependenciesList(licensesCrawlerData);
  fs.writeFileSync(markdownPath, content, 'utf8');
  console.info("'LIBRARIES.md' created...");

  const libraries = {};
  const names = Object.keys(licensesCrawlerData).sort();

  names.forEach(name => {
    libraries[name] = {
      ...licensesCrawlerData[name],
      ...licensesCheckerData[name],
      name
    };

    if (licensesCheckerData[name].licenseFile) {
      const license = fs.readFileSync(
        licensesCheckerData[name].licenseFile,
        'utf8'
      );

      libraries[name].licenseText = license;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(libraries), 'utf8');
  console.info("'libraries.json' created...");
  fs.unlinkSync(licenseCheckerPath);
  fs.unlinkSync(licenseCrawlerPath);
  console.info('Temporary files removed...');
  console.info('Creating license files succeed');
} catch (error) {
  console.error(error);
}
