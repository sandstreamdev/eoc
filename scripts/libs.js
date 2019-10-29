/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');

const args = process.argv.slice(2);
const jsonPath = args[0];
const mdPath = args[1];
const licenseCheckerPath = args[2];
const licenseCrawlerPath = args[3];
const licensesCheckerData = require(licenseCheckerPath);
const licensesCrawlerData = require(licenseCrawlerPath);
const line = os.EOL;
const doubleLine = `${os.EOL}${os.EOL}`;

const disableLink = text => text.replace(/\./g, '<i></i>.');
const prepareDependenciesList = dependencies => {
  const names = Object.keys(dependencies).sort();
  let content = '';

  names.forEach(name => {
    content += `* ${disableLink(name)}${line}`;
    content += `  - license: [${dependencies[name].licenses}](${
      dependencies[name].licenseUrl
    })${line}`;
    content += `  - repository: ${dependencies[name].repository}${doubleLine}`;
  });

  return content;
};

if (!licensesCheckerData || !licensesCrawlerData) {
  return console.error('License data files are missing.');
}

try {
  let content = `# Third-party licenses${line}${doubleLine}`;

  content += prepareDependenciesList(licensesCrawlerData);
  fs.writeFileSync(mdPath, content, 'utf8');
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
