import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font/iconfont.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible/index.min.js'
// import dayjs from 'dayjs'
// console.log(dayjs().format('YYYY/MM/DD HH:mm:ss'))
import mavonEditor from 'mavon-editor' // 引入mavon-editor 就是上面所安装的
import 'github-markdown-css/github-markdown.css'
Vue.use(mavonEditor)

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
