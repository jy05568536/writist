import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import 'moment/locale/zh-cn'

Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')

// 获取配置
store.dispatch('getSetting')

/**
 * 日期插件
 */
moment.locale('zh-cn')

Vue.filter('dateFormat', (date) => {
  let hours = moment(new Date()).diff(moment(date), 'hours')
  if (hours <= 2) {
    return moment(date).fromNow()
  } else if (moment(new Date()).format('YYYYMMDD') === moment(date).format('YYYYMMDD')) {
    return '今天 ' + moment(date).format('MM-DD HH:mm')
  } else if (moment(new Date()).format('YYYY') === moment(date).format('YYYY')) {
    return moment(date).format('MM-DD HH:mm')
  } else {
    return moment(date).format('YYYY-MM-DD HH:mm')
  }
})
