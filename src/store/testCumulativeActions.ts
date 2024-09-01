import store from '.';
// Slices:
import { insertCellBefore, updateCell } from './slices';

export default function testCumulativeActions() {
  for (let i = 0; i < 5; i++) {
    store.dispatch(insertCellBefore({ neighborId: null, cellType: 'code' }));
  }

  const ids = [];
  const { order } = store.getState().cells;
  for (const id of order) {
    ids.push(id);
  }

  store.dispatch(
    updateCell({
      id: ids[0],
      content: `
const exp = \`
export something
\`;

document.getElementById('root').innerText = 'fake export';
    `,
    })
  );

  store.dispatch(
    updateCell({
      id: ids[1],
      content: `
    export const a = 'a'.repeat(five());
    document.getElementById('root').innerHTML = a;
    function five(){return 5};
    `,
    })
  );

  store.dispatch(
    updateCell({
      id: ids[2],
      content: `
import ReactDOM from 'react-dom/client';
import React from 'react';
import {a} from '${ids[1]}';
export const App1 = () => {
  return (
    <div style={{ color: 'blue' }}>
      <h1>App1</h1>
      <p>{a}{a}</p>
      {/* <p>comment</p> */}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App1 />);
    `,
    })
  );
  store.dispatch(
    updateCell({
      id: ids[3],
      content: `
import ReactDOM from 'react-dom/client';
import React from 'react';
import {App1} from '${ids[2]}';
const a = 'AAAAAA';
const App = () => {
  return (
    <div style={{ color: 'green' }}>
      <h1>Proof of Life ...</h1>
      {/* <p>comment</p> */}
      {a}
      <App1/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    `,
    })
  );

  store.dispatch(
    updateCell({
      id: ids[4],
      content: `
const imp = \`
import something from 'fake
\`;

document.getElementById('root').innerText = 'fake import';
    `,
    })
  );
  //   console.log('initial slice: ', store.getState().cells);
}
