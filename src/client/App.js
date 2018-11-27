import React from 'react';

import ReactImage from './react.png';
import Header from './components/Header';

const App = () => (
  <div>
    <Header />
    <h1>Hello, world</h1>
    <h2>Loading... please wait!</h2>
    <img src={ReactImage} alt="react" />
  </div>
);

export default App;
