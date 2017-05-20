<template>
  <transition name="move">
    <div v-show="showFood" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="name">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now"><span class="icon">￥</span>{{food.price}}</span>
            <span v-show="food.oldPrice" class="old"><span class="icon">￥</span>{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cart-control :food="food" @cart-add="_drop"></cart-control>
          </div>
          <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirstFood">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品详情</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <rating-select :desc="desc" :ratings="food.ratings" @onlyContent-toggle="toggle" @selectType-select="select"></rating-select>
          <div class="ratings-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar"/>
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></i>
                  <span>{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无商品评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import CartControl from '../cartControl/CartControl.vue';
  import Split from '../split/Split.vue';
  import RatingSelect from '../ratingSelect/RatingSelect.vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date.js';

  const ALL = 2;

  export default {
    props: {
      food: Object
    },
    data () {
      return {
        showFood: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      toggle (onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      select (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      show () {
        this.showFood = true;
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide () {
        this.showFood = false;
      },
      needShow (rateType, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === rateType;
        }
      },
      addFirstFood (event) {
        if (!event._constructed) {
          return;
        }
        this.$nextTick(() => {
          this.$parent.$refs.shopCart.drop(event.target);
        });
        Vue.set(this.food, 'count', 1);
      },
      _drop (event) {
        this.$nextTick(() => {
          this.$parent.$refs.shopCart.drop(event);
        });
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      'cart-control': CartControl,
      'split': Split,
      'rating-select': RatingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .food
    position: fixed
    left: 0px
    top: 0px
    bottom: 48px
    width: 100%
    background: #fff
    z-index: 30
    transition: all 0.3s linear
    &.move-leave
      transform: translate3d(0, 0, 0)
    &.move-leave-active
      transform: translate3d(100%, 0, 0)
    &.move-enter
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0px
      padding-bottom: 100%
      img
        position: absolute
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0px
        padding: 10px
        .icon-arrow_lift
          display: block
          font-size: 10px
          color: rgba(7, 17, 27, 0.6)
    .content
      position: relative
      padding: 18px
      .name
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        font-size: 0px
        .sell-count, .rating
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        height: 24px
        line-height: 24px
        font-weight: 700
        font-size: 0
        .now
          font-size: 14px
          color: rgb(240, 40, 40)
          margin-right: 8px
          .icon
            font-weight: normal
            font-size: 10px
            margin-right: 0px
        .old
          font-size: 10px
          color: rgb(147, 153, 159)
          text-decoration: line-through
          .icon
            font-weight: normal
            font-size: 10px
            margin-right: 0px

      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
        width: 96px
        height: 36px
      .buy
        position: absolute
        right: 12px
        bottom: 12px
        width: 86px
        height: 36px
        border-radius: 12px
        color: #fff
        background: rgb(0, 160, 220)
        box-sizing: border-box
        padding: 0 12px
        line-height: 36px
        font-size: 10px
        z-index: 10
    .info
      padding: 18px
      .title
        margin-bottom: 6px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        padding: 0 8px
        line-height: 24px
        font-size: 12px
        color: rgb(77, 85, 93)
    .ratings
      padding-top: 18px
      .title
        margin-left: 18px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .ratings-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0px
            top: 16px
            height: 12px
            line-height: 12px
            font-size: 0px
            .name
              display: inline-block
              vertical-align: top
              margin-right: 6px
              font-size: 10px
              color: rgb(147, 153, 159)
            img
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            font-size: 0px
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              display: inline-block
              vertical-algin: top
              line-height: 24px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
            span
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
        .no-ratings
          padding: 18px
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
