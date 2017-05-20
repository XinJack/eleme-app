<template>
  <div>
    <div class="shopping-cart">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'high-light': totalCount>0}">
            <i class="icon-shopping_cart" :class="{'high-light': totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'high-light': totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
      </div>
      <div class="balls-container">
        <div v-for="ball in balls">
          <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
            <div class="ball"  v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shoppingcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectedFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span class="icon">￥</span><span class="num">{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food" @cart-add="drop"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fold">
      <div class="background" v-show="listShow" @click.stop.prevent="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import CartControl from '../cartControl/CartControl.vue';
  import BScroll from 'better-scroll';

  export default {
    components: {
      'cart-control': CartControl
    },
    props: {
      selectedFoods: {
        type: Array,
        default () {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        isFold: true
      };
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectedFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectedFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'no-enough';
        } else {
          return 'enough';
        }
      },
      listShow () {
        if (!this.totalPrice) {
          return false;
        }
        let show = !this.isFold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; ++i) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.display = 'none';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.tranform = `translate3d(0,${y}px,0)`;
            let innerEl = el.getElementsByClassName('inner-hook')[0];
            innerEl.style.webkitTransform = `translate3d(${x}px,0,0)`;
            innerEl.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate(0,0,0)';
          let innerEl = el.getElementsByClassName('inner-hook')[0];
          innerEl.style.webkitTransform = 'translate3d(0,0,0)';
          innerEl.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList () {
        if (!this.totalPrice) {
          return;
        }
        this.isFold = !this.isFold;
      },
      hideList () {
        this.isFold = true;
      },
      empty () {
        this.selectedFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        this.isFold = true;
        alert(`需支付${this.totalPrice}元`);
        this.empty();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .shopping-cart
    position: fixed
    left: 0px
    bottom: 0px
    width: 100%
    height: 48px
    z-index: 50
    display: flex
    background: #141d27
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      font-size: 0
      .logo-wrapper
        display: inline-block
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        width: 56px
        height: 56px
        background: #141d27
        box-sizing: border-box
        border-radius: 50%
        .logo
          width: 100%
          height: 100%
          background: #2b343c
          border-radius: 50%
          text-align: center
          vertical-align: top
          &.high-light
            background: rgb(0, 160, 220)
          .icon-shopping_cart
            display: inline-block
            line-height: 44px
            font-size: 24px
            color: #80858a
            &.high-light
              color: #fff
        .num
          position: fixed
          left: 44px
          bottom: 42px
          width: 24px
          height: 16px
          line-height: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          text-align: center
          background: rgb(240, 20, 20)
          border-radius: 8px
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display: inline-block
        vertical-align: top
        height: 24px
        padding-right: 12px
        margin: 12px 0
        box-sizing: border-box
        line-height: 24px
        font-size: 16px
        font-weight: 700
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        &.high-light
          color: #fff
      .desc
        display: inline-block
        margin: 12px 0 12px 12px
        padding-right: 12px
        vertical-align: top
        height: 24px
        line-height: 24px
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        // padding: 0 12px
        line-height: 48px
        font-size: 12px
        text-align: center
        &.no-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff

    .balls-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        z-index: 200
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 200)
          transition: all 0.6s linear
    .fold-enter, &.fold-leave-active
      bottom: 0px
      transform: translate3d(0, 0, 0)
    .shoppingcart-list
      z-index: -1
      position: absolute
      left: 0px
      // top: 0px
      width: 100%
      transition: all 0.5s
      transform: translate3d(0, -100%, 0)
      .list-header
        height: 40px
        padding: 0 18px
        line-height: 40px
        background: #f3f5f7
        border-bottom: 2px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          font-weight: 200
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        max-height: 217px
        padding: 0 18px
        background: #fff
        overflow: hidden
        .food
          height: 48px
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right:  96px
            bottom: 12px
            line-height: 24px
            color: rgb(240, 20, 20)
            .icon
              font-size: 10px
              font-weight: normal
            .num
              font-size: 14px
              font-weight: 700
          .cartcontrol-wrapper
            position: absolute
            right: 0px
            bottom: 6px
            width: 96px
  .background
    position: fixed
    left: 0px
    top: 0px
    width: 100%
    height: 100%
    background: rgba(7, 17, 27, 0.6)
    z-index: 40
    transition: all 0.6s
    &.fold-leave, &.fold-enter-active
      opacity: 1
    &.fold-enter, &.fold-leave-active
      opacity: 0
</style>
