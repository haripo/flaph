import { FlaphClassWrapper, mount, unmount } from 'flaph';
import { createElement, CSSProperties, useEffect, useRef } from 'react';

interface Props {
  source: string;
  onChange: (e: { source: string }) => void;
  style?: CSSProperties;
}

export default function Flaph(props: Props) {
  const element = useRef<HTMLDivElement>(null);
  const reactRef = useRef<FlaphClassWrapper>(null);

  useEffect(() => {
    mount({ ...props, ref: reactRef }, element.current);
    return () => unmount(element.current);
  }, []);

  if (reactRef.current !== null) {
    reactRef.current.updateSource(props.source);
  }

  return createElement('div', {
    id: 'flaph-preact-root',
    ref: element,
    style: props.style
  });
}
