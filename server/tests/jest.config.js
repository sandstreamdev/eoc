module.exports = {
  name: 'server',
  displayName: 'server',
  testEnvironment: 'node',
  rootDir: '../',
  moduleNameMapper: {},
  setupFilesAfterEnv: ['<rootDir>/tests/setupTest.js'],
  moduleFileExtensions: ['js', 'json'],
  moduleDirectories: ['../node_modules', '<rootDir>/tests']
};
