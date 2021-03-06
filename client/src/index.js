import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'leaflet/dist/leaflet.css';
import './index.css';
import * as serviceWorker from './serviceWorker';

import removeWarn from './utils/removeAsyncValidatorWarning.js';

removeWarn();
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
