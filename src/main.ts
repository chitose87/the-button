import Vue from 'vue'
import App from './App.vue'
import {FBC} from "@/FBC";

Vue.config.productionTip = false;

FBC.init();
new Vue({
  render: h => h(App),
}).$mount('#app');
