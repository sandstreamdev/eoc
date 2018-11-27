# EOC - End Of Coffee App

This is an app made by Sandstream Development to track all the office inventory that is running out.

## Technological Stack

Client:

- React.js,
- Redux

Server:

- Node.js,
- Express.js

Database:

- MongoDB

Tools:

- Webpack,
- Eslint (custom rules extends Airbnb),
- Prettier,
- Husky (pre-commits hooks).
- Docker

### Webpack Development mode

In the development mode, we will have 2 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Webpack Production mode

In the production mode, we will have only 1 server running. All the client side code will be bundled into static files using webpack and it will be served by the Node.js/Express application.

## Quick Start

```bash
# Clone the repository
git clone <this.repo/>

# Go inside the directory
cd [project-folder]

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Avalible scripts:

- "build" -> Builds static assets in production mode.
- "docker:build:client": "docker build src/client",
- "docker:build:server": "docker build src/server",
- "start" -> Runs "build" script and serves static files from server directory
- "client" -> Runs Client layer of application at given port.
- "server" -> Runs Server layer of application at given port.
- "dev": -> Runs Client and Server layers at once.
- "lint": -> Lints all the js, json files inside src directory.
- "prettier": -> Prettifies all the .js, .scss files inside src directory.

## Documentation

### Folder Structure

All the source code will be inside **src** directory. Inside src, there is client and server directory. All the frontend code (react, scss, js and any other assets) will be in client directory. Backend Node.js/Express code will be in the server directory.

### Babel

[Babel](https://babeljs.io/) helps us to write code in the latest version of JavaScript. If an environment does not support certain features natively, Babel will help us to compile those features down to a supported version. It also helps us to convert JSX to Javascript.

### ESLint

This project uses custom Eslint rules that extends default Airbnb rules.

### Webpack

[Webpack](https://webpack.js.org/) is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser.

[webpack.config.js](https://webpack.js.org/configuration/) file is used to describe the configurations required for webpack. Below is the webpack.config.js file which I am using.

### Nodemon

Nodemon is a utility that will monitor for any changes in the server source code and it automatically restart the server. This is used in development only.

nodemon.json file is used to describe the configurations for Nodemon. Below is the nodemon.json file which I am using.

```javascript
{
  "watch": ["src/server/"]
}
```

Here, we tell nodemon to watch the files in the directory src/server where out server side code resides. Nodemon will restart the node server whenever a file under src/server directory is modified.

### Express

Express is a web application framework for Node.js. It is used to build our backend API's.
src/server/index.js is the entry point to the server application.

### Concurrently

[Concurrently](https://github.com/kimmobrunfeldt/concurrently) is used to run multiple commands concurrently. I am using it to run the webpack dev server and the backend node server concurrently in the development environment. Below are the npm/yarn script commands used.

```javascript
"client": "webpack-dev-server --mode development --devtool inline-source-map --hot",
"server": "nodemon src/server/index.js",
"dev": "concurrently \"npm run server\" \"npm run client\"",
```

### ESLint + Prettier + Husky

[ESLint](https://eslint.org/) takes care of the code-quality. [Prettier](https://prettier.io/) takes care of all the formatting. [Husky](https://github.com/typicode/husky) takes care of running linting rules before we commit or push the code.
