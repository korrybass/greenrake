import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DebtVisualizer from './DebtVisualizer';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<DebtVisualizer />, document.getElementById('root'));
registerServiceWorker();
