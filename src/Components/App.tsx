// React:
// import { useState } from 'react';

// Components:
import CellsList from './CellsList';

// RTK:
import { Provider } from 'react-redux';
// Store:
import store from '../store';

// CSS:
import './App.css';
// import 'bulmaswatch/sandstone/bulmaswatch.min.css';
import 'bulmaswatch/darkly/bulmaswatch.min.css';

// Types, interfaces and enumns:
import { FC } from 'react';

// Component:
const App: FC = () => {
  // JSX:
  return (
    <Provider store={store}>
      <div>
        <CellsList />
      </div>
    </Provider>
  );
};

export default App;

// import createDOM from '../dependencies/createDOM';
// const stringDOM = JSON.stringify(createDOM('some_id'));
// console.log('createDOM:', JSON.parse(stringDOM));
// console.log(JSON.stringify(globalThis.document));
