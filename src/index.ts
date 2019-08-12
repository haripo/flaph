import { createElement } from 'react';
import { render } from 'react-dom';
import Main from './components/Main';

const domContainer = document.querySelector('#app');
render(createElement(Main), domContainer);
