// @ts-ignore
import { createElement } from 'preact';
// @ts-ignore
import { useEffect, useRef } from 'preact/compat';

import { mount } from 'flaph';
import { CSSProperties } from 'react';

type Props = {
  source: string
  onChange: (e: { source: string }) => void
  style: CSSProperties
};

export default function Flaph(props: Props) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mount(props, element.current);
  });

  return createElement('div', {
    id: 'flaph-preact-root',
    ref: element,
    style: props.style
  });
}
