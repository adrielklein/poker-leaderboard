import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import * as serviceWorker from './serviceWorker';

let rootEl = document.getElementById('root');
ReactDOM.render(<App />, rootEl);

serviceWorker.unregister();

if (module.hot) {
    module.hot.accept('./components/App', () => {
        const NextApp = require('./components/App').default
        ReactDOM.render(
            <NextApp />,
            rootEl
        )
    })
}
