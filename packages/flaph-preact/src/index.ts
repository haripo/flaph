import { mount, unmount } from 'flaph';
// @ts-ignore
import { createElement } from 'preact';
// @ts-ignore
import { useEffect, useRef } from 'preact/compat';

type Props = {
  source: string
  onChange: (e: { source: string }) => void
  style: { [key: string]: string | number }
};

export default function Flaph(props: Props) {
  const element = useRef<HTMLDivElement>(null);
  const reactRef = useRef(null);

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
