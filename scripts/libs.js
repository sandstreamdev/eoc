/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */

const fs = require('fs');
const os = require('os');

const args = process.argv.slice(2);
const targetPath = args[0];
const licenseCheckerName = args[1];
const licenseCrawlerName = args[2];
const pathToLicenseChecker = `${__dirname}/${licenseCheckerName}`;
const pathToLicenseCrawler = `${__dirname}/${licenseCrawlerName}`;
const licensesChecker = require(pathToLicenseChecker);
const licensesCrawler = require(pathToLicenseCrawler);
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

if (!licensesChecker || !licensesCrawler) {
  return console.error('License data files are missing.');
}

try {
  let content = `# Third-party licenses${line}${doubleLine}`;

  content += prepareDependenciesList(licensesCrawler);
  fs.writeFileSync('LIBRARIES.md', content, 'utf8');
  console.info("'LIBRARIES.md' created...");

  const libraries = {};
  const names = Object.keys(licensesCrawler).sort();

  names.forEach(name => {
    libraries[name] = {
      ...licensesCrawler[name],
      ...licensesChecker[name],
      name
    };

    if (licensesChecker[name].licenseFile) {
      const license = fs.readFileSync(
        licensesChecker[name].licenseFile,
        'utf8'
      );

      libraries[name].licenseText = license;
    }
  });

  fs.writeFileSync(
    `${targetPath}libraries.json`,
    JSON.stringify(libraries),
    'utf8'
  );
  console.info("'libraries.json' created...");
  fs.unlinkSync(pathToLicenseChecker);
  fs.unlinkSync(pathToLicenseCrawler);
  console.info('Temporary files removed...');
  console.info('Creating license files succeed');
} catch (error) {
  console.error(error);
}
