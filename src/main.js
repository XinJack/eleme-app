// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入第三方组件
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

// 注册第三方组件
Vue.use(VueRouter);
Vue.use(VueResource);

import App from './App.vue';
import Seller from 'components/seller/seller.vue';
import Ratings from 'components/ratings/Ratings.vue';
import Goods from 'components/goods/Goods.vue';

// 引入样式
import 'common/stylus/index.styl';

// 定义常量
const ERR_OK = 0;

let routes = [
  {path: '/seller', component: Seller},
  {path: '/goods', component: Goods},
  {path: '/ratings', component: Ratings}
];

let router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router: router,
  data () {
    return {
      seller: {}
    };
  },
  created () {
    this.$http.get('/api/seller').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.seller = response.data;
      }
    });
  },
  components: {
    App
  },
  template: '<App :seller="seller"></App>'
}).$mount('#app');

// 页面默认显示goods页面
router.push('/goods');
