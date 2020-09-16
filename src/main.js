import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'
// 将axios挂载到Vue
Vue.prototype.$http = axios
// 配置基本默认地址，后面请求地址时，自动拼接这一部分
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置拦截器，向请求信息中添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios的配置在挂载之前配置好
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
