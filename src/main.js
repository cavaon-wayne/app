import Vue from 'vue';
import lodash from 'lodash';
import VueDraggable from 'vuedraggable';
import VTooltip from 'v-tooltip';
import VueTimeago from 'vue-timeago';
import PortalVue from 'portal-vue';
import axios from 'axios';
import meta from 'vue-meta';
import VueTheMask from 'vue-the-mask';
import VueCompositionAPI from '@vue/composition-api';

import './design/main.scss';
import './globals';
import './helpers/handle-focus';
import './helpers/handle-drag';

import App from './app.vue';
import router from './router';
import { i18n, loadLanguageAsync } from './lang';
import store from './store';
import api from './api';
import helpers from './helpers';
import notify from './notifications';
import events from './events';

import allSettled from 'promise.allsettled';

// This is a polyfill for Promise.allSettled. Can be removed in the future when the browser support
// is there
allSettled.shim();

Vue.config.productionTip = false;

// Make lodash globally available under it's common name `_`
window._ = lodash;

Object.defineProperties(Vue.prototype, {
	$api: { value: api },
	$notify: { value: notify },
	$axios: { value: axios }
});

Vue.directive('focus', {
	inserted(el, binding) {
		if (binding.value === undefined || Boolean(binding.value) !== false) {
			el.focus();
		}
	}
});

Vue.use(VueCompositionAPI);
Vue.use(events);
Vue.use(VTooltip, {
	defaultDelay: {
		show: 500
	},
	defaultOffset: 2,
	defaultBoundariesElement: 'window',
	autoHide: false
});
Vue.use(PortalVue);
Vue.use(VueTimeago, {
	name: 'v-timeago',
	locale: 'en-US'
});
Vue.use(VueTheMask);
Vue.use(meta);

/* eslint-disable no-new */
const app = new Vue({
	render: h => h(App),
	router,
	i18n,
	store,
	api,
	helpers
}).$mount('#app');

store.watch(
	state => state.currentUser.locale,
	locale => loadLanguageAsync(locale)
);
store.watch(
	state => state.currentProjectKey,
	key => (api.config.project = key)
);

export default app;
