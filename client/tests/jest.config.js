module.exports = {
  name: 'client',
  displayName: 'client',
  testEnvironment: 'jsdom',
  rootDir: '../',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTest.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['../node_modules', '<rootDir>/src', '<rootDir>/tests']
};
