import { mount, unmount } from 'flaph';

export default {
  props: ['value'],
  mounted() {
    const props = {
      source: this.$props.value,
      onChange: (e) => this.$emit('input', e.source),
      ref: (ref) => this.reactRef = ref
    };
    mount(props, this.$refs.el);
  },
  beforeDestroy() {
    unmount(this.$refs.el);
  },
  watch: {
    value(newValue) {
      this.reactRef.updateSource(newValue);
    }
  },
  render(createElement) {
    return createElement('div', { ref: 'el' });
  }
};
