import component from './flaph';

interface InstallFunction {
  (Vue: any): void;
  installed?: boolean;
}

// Declare install function executed by Vue.use()
export let install: InstallFunction = function(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('Flaph', component);
};

// Create module definition for Vue.use()
const plugin = {
  install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  // @ts-ignore
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  // @ts-ignore
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// To allow use as module (npm/webpack/etc.) export component
export default component;