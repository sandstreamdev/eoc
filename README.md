# EOC - End Of Coffee App

An app made by Sandstream Development team, to track office inventory, groceries, and even your daily tasks!

![Eoc custom badge](https://img.shields.io/badge/EOC-App-orange)
![main language](https://img.shields.io/github/languages/top/sandstreamdev/eoc)
![dependencies status](https://img.shields.io/david/sandstreamdev/eoc)
![repository size](https://img.shields.io/github/repo-size/sandstreamdev/eoc)
![last commit](https://img.shields.io/github/last-commit/sandstreamdev/eoc)

## Main application tech stack

App uses WebSockets technology via `Socket.io` library to provide a better user experience.

Client:

- React.js,
- Redux

Server:

- Node,
- Express.js

Database:

- MongoDB

## Installation

Please remember first to create .env file in the root directory of the project and add necessary .env keys that you can find in the .env-example file.

#### 1. Clone the repository

```
git clone https://github.com/sandstreamdev/eoc.git
```

#### 2. Go inside the directory

```
cd eoc
```

#### 3. Install dependencies

```
npm install
```

#### 4. Run database

```
monogod
```

#### 5. Start the development server

```
npm run dev
```

## Build for production

```
npm run build
```

## Seeding database for development

At first run of the app, log in and check your user id in the database under eoc/users directory. Put that user ID, generated by mongo to .env file under USER_ID variable and save the file. Then simply run npm run seed.

#### Seeding is not working?

Probably USER_ID in your database is not matching with USER_ID in your .env file. Be aware that if you clean up the whole database with users collection, your USER_ID delivered by mongo will be different compared to the previous session.

#### Tip:

When playing with data via MongoDB Compass, always clean all the collections omitting users collection, so you don't have to deal with USER_ID configuration over and over again.

## Available scripts

```
 "check": - runs lint, format and stylelint scripts together,
 "clear-demo": - clears demo data from the database,
 "build:dev": - builds for development,
 "build:prod": - builds for production,
 "dev": - runs development server,
 "format": - formats all the files using Prettier,
 "format:fix": - formats and fix all the files using Prettier,
 "lint": - lint all the files using eslint,
 "lint:fix": - lint and fix all files using eslint,
 "migrate": - runs migration script,
 "migrate:up":  - migrate database up,
 "migrate:down":  - migrate database down,
 "seed": - seed database with demo data,
 "start:client:dev": - start client dev server,
 "start:server:dev": - start dev server,
 "start:server:prod": - start production server,
 "stylelint": - stylelint all style files,
 "stylelint:fix": - stylelint and fix all style files,
 "test": - run tests
```

## Database migrations

To perform DB migrations we use `migrate-mongo` tool. To config `migrate-mongo` edit `migrate-mongo-config.js` file. To create migration file run `npm run migrate create <version>` in your terminal. Migration file will be created at server/migrations directory. To run all new migrations run `npm run migrate:up` or `npm run migrate up` in your terminal. To rollback, last migration run `npm run migrate:down` or `npm run migrate down` in your terminal. To see migrations status run `npm run migrate status` in your terminal.

## Third-party licenses

To generate json and markdown files containing third-party licenses you need to
 install globally: [license-checker](https://github.com/davglass/license-checker#readme) and [npm-license-crawler](https://github.com/mwittig/npm-license-crawler):

 #### 1. Install global packages

```
npm i license-checker npm-license-crawler -g
```

#### 2. Go inside the directory

```
cd eoc
```

#### 3. Run libs script
```
npm run libs -j path/to/json/file [-m path/to/md/file]
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License and trademarks info

- FontAwesome Free. Check [Font Awesome license](https://fontawesome.com/license) ,
- Google [Trademark Logo](https://www.google.com/permissions/logos-trademarks) : ©2018 Google LLC All rights reserved. Google and the Google logo are registered trademarks of Google LLC.
- [Pravatar API](https://pravatar.cc/). It is published under [CC0 license](https://creativecommons.org/share-your-work/public-domain/cc0/). Pravatar uses photos from [Pexels](https://www.pexels.com/).
