import { Component, createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Flaph, { Props } from './components/Flaph';

// Wrapper component to keep Flaph props as states, which can be updated via ref
class FlaphClassWrapper extends Component<Props, Props> {
  constructor(props) {
    super(props);
    this.state = props;
  }

  // this method is called via refs
  public updateSource(source: string) {
    this.setState({ source });
  }

  public render() {
    return createElement(Flaph, this.state);
  }
}

export function mount(props: Props, element) {
  render(createElement(FlaphClassWrapper, props), element);
}

export function unmount(element) {
  unmountComponentAtNode(element);
}
