import { createElement } from 'react';
import { render } from 'react-dom';
import Main from './Main';

const domContainer = document.querySelector('#app');
render(createElement(Main), domContainer);