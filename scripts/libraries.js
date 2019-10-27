const fs = require('fs');
const os = require('os');
const crawler = require('npm-license-crawler');
const checker = require('license-checker');

const newLine = os.EOL;
const doubleLines = `${os.EOL}${os.EOL}`;
const librariesPath = './client/src/modules/libraries/libraries.json';
const crawlerOptions = {
  json: 'libraries.json',
  start: ['.']
};
const checkerOption = {
  json: librariesPath,
  start: './.'
};

const disableLink = text => text.replace(/\./g, '<i></i>.');

const prepareDependenciesList = dependencies => {
  const names = Object.keys(dependencies).sort();
  let content = '';

  names.forEach(name => {
    content += `* ${disableLink(name)}${newLine}`;
    content += `  - license: [${dependencies[name].licenses}](${
      dependencies[name].licenseUrl
    })${newLine}`;
    content += `  - repository: ${dependencies[name].repository}${doubleLines}`;
  });

  return content;
};

crawler.dumpLicenses(crawlerOptions, (error, res) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    let content = `# Libraries${doubleLines}${doubleLines}`;

    content += prepareDependenciesList(res);
    checker.init(checkerOption, (err, packages) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(error);
      } else {
        const libraries = {};
        const names = Object.keys(packages).sort();

        names.forEach(name => {
          libraries[name] = { ...res[name], ...packages[name] };

          if (packages[name].licenseFile) {
            const license = fs.readFileSync(packages[name].licenseFile, 'utf8');

            libraries[name].licenseText = license;
          }
        });

        fs.writeFileSync(librariesPath, JSON.stringify(libraries), 'utf8');
      }
    });

    fs.writeFileSync('LIBRARIES.md', content, 'utf8');
    fs.unlinkSync('libraries.json');

    // eslint-disable-next-line no-console
    console.info('Library list created');
  }
});
