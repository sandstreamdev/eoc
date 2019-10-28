/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');

// eslint-disable-next-line import/no-unresolved
const licensesChecker = require('../licensesChecker.json');
// eslint-disable-next-line import/no-unresolved
const licensesCrawler = require('../licensesCrawler.json');

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

  fs.writeFileSync('libraries.json', JSON.stringify(libraries), 'utf8');
  console.info("'libraries.json' created...");
  fs.unlinkSync('licensesChecker.json');
  console.info("'licensesChecker.json' removed...");
  fs.unlinkSync('licensesCrawler.json');
  console.info("'licensesCrawler.json' removed...");
  console.info('Creating license files succeed');
} catch (error) {
  console.error(error);
}

// crawler.dumpLicenses(crawlerOptions, (error, res) => {
//   if (error) {
//     // eslint-disable-next-line no-console
//     console.error(error);
//   } else {
//     let content = `# Libraries${line}${doubleLine}`;

//     content += prepareDependenciesList(res);
//     checker.init(checkerOption, (err, packages) => {
//       if (err) {
//         // eslint-disable-next-line no-console
//         console.error(error);
//       } else {
//         const libraries = {};
//         const names = Object.keys(packages).sort();

//         names.forEach(name => {
//           libraries[name] = { ...res[name], ...packages[name] };

//           if (packages[name].licenseFile) {
//             const license = fs.readFileSync(packages[name].licenseFile, 'utf8');

//             libraries[name].licenseText = license;
//           }
//         });

//         fs.writeFileSync(librariesPath, JSON.stringify(libraries), 'utf8');
//       }
//     });

//     fs.writeFileSync('LIBRARIES.md', content, 'utf8');
//     fs.unlinkSync('libraries.json');

//     // eslint-disable-next-line no-console
//     console.info('Library list created');
//   }
// });
