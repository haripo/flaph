import { createElement } from 'react';
import { render } from 'react-dom';
import Flaph, { Props } from './components/Flaph';

export function mount(props: Props, element) {
  render(createElement(Flaph, props), element);
}

export default Flaph;
