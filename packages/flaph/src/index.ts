import { Component, createElement, Ref } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Flaph, { Props as FlaphProps } from './components/Flaph';

interface Props extends FlaphProps {
  ref?: Ref<FlaphClassWrapper>;
}

// Wrapper component to keep Flaph props as own states, which can be updated via ref
export class FlaphClassWrapper extends Component<Props, FlaphProps> {
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
