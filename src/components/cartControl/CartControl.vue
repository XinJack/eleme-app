<template>
  <div class="cart-control-wrapper">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-increase icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cart-add', event.target);
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cart-control-wrapper
    width: 100%
    font-size: 0px
    .cart-decrease
      display: inline-block
      vertical-align: top
      width: 36px
      height: 36px
      transition: all 0.4s linear
      &.move-enter-active, &.move-leave
        opacity: 1
        transform: translate3D(0, 0, 0)
        .inner
          transition: all 0.4s linear
          transform: rotate(0)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3D(24px, 0, 0)
        .inner
          transition: all 0.4s linear
          transform: rotate(180deg)
      .inner
        display: inline-block
        width: 24px
        height: 24px
        padding: 6px
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
    .count
      display: inline-block
      vertical-align: top
      width: 24px
      height: 36px
      line-height: 36px
      font-size: 10px
      text-align: center
      color: rgb(147, 153, 159)
    .cart-increase
      width: 24px
      height: 24px
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
      position: absolute
      right: 0px
      bottom: 0px
</style>
