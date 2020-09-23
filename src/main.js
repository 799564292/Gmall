import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
Vue.use(VueLazyload,{
  preLoad: 1,
  loading: require('../src/assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
