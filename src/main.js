import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'

// import TreeTable from 'vue-table-tree-grid's
// 将axios挂载到Vue
Vue.prototype.$http = axios
// 配置基本默认地址，后面请求地址时，自动拼接这一部分
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置拦截器，向请求信息中添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios的配置在挂载之前配置好,开发模式
Vue.config.productionTip = false
// Vue.component('tree-table', TreeTable)
// 定义全局过滤器
Vue.filter('dateFormate', function(val) {
  const dt = new Date(val)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
