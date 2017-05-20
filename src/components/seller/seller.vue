<template>
  <div class="seller-wrapper" ref="seller">
    <div>
      <div class="seller-header">
        <div class="header-top">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="36" :score="seller.score"></star>
          </div>
          <span class="sell-count">月售{{seller.sellCount}}单</span>
          <div class="collection">
            <i class="icon-favorite" @click="toggle" :class="{'favirite': favirite}"></i>
            <span class="text" v-show="favirite">已收藏</span>
          </div>
        </div>
        <div class="header-bottom">
          <div class="min-price">
            <span class="text">起送价</span>
            <span class="price">{{seller.minPrice}}<span class="unit">元</span></span>
          </div>
          <div class="delivery-price">
            <span class="text">配送费</span>
            <span class="price">{{seller.deliveryPrice}}<span class="unit">元</span></span>
          </div>
          <div class="delivery-time">
            <span class="text">平均配送时间</span>
            <span class="price">{{seller.deliveryTime}}<span class="unit">分钟</span></span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="bulletin-supports-wrapper">
        <h1 class="title">公告与活动</h1>
        <p class="bulletin">{{seller.bulletin}}</p>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="item in seller.supports">
            <span class="icon" :class="iconClass[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-view">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="pictures">
          <ul class="pic-list" v-show="seller.pics">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-infos" v-show="seller.infos">
        <h1 class="title">商家信息</h1>
        <ul>
          <li v-for="info in seller.infos" class="info">{{info}}</li>
        </ul>
      </div>
    </div>
    <div class="shopping-cart-wrapper">
      <shopping-cart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopping-cart>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../../components/star/star.vue';
  import Split from '../../components/split/Split.vue';
  import ShoppingCart from '../shoppingCart/ShoppingCart.vue';
  import BScroll from 'better-scroll';

  export default {
    props: {
      seller: {
        type: Object,
        default () {
          return {};
        }
      }
    },
    data () {
      return {
        favirite: false
      };
    },
    created () {
      this.iconClass = ['decrease', 'discount', 'invoice', 'guarantee', 'special'];
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.pictures.style.width = width + 'px';
          this.scroll2 = new BScroll(this.$refs.pictures, {
            click: true,
            scrollX: true,
            eventPassthrough: 'vertical'
          });
        } else {
          this.scroll.refresh();
          this.scroll2.refresh();
        }
      });
    },
    methods: {
      toggle (event) {
        if (!event._constructed) {
          return;
        }
        this.favirite = !this.favirite;
      }
    },
    components: {
      'star': Star,
      'split': Split,
      'shopping-cart': ShoppingCart
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller-wrapper
    width: 100%
    position: absolute
    top: 174px
    bottom: 46px
    overflow: hidden
    .title
      margin-bottom: 12px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
    .seller-header
      padding: 18px
      .header-top
        position: relative
        padding-bottom: 18px
        font-size: 0px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .name
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .star-wrapper
          margin-right: 12px
          display: inline-block
          vertical-align: top
          line-height: 18px
        .sell-count
          display: inline-block
          vertical-align: top
          line-height: 18px
          font-size: 10px
          color: rgb(77, 85, 93)
        .collection
          position: absolute
          right: 0px
          top: 0px
          width: 36px
          height: 38px
          display: flex
          flex-direction: column
          .icon-favorite
            flex: 1
            margin-bottom: 4px
            line-height: 24px
            font-size: 24px
            text-align: center
            &.favirite
              color: rgb(240, 20, 20)
          .text
            flex: 1
            line-height: 10px
            font-size: 10px
            color: rgb(77, 85, 93)
      .header-bottom
        display: flex
        padding-top: 18px
        .text
          display: block
          margin-bottom: 4px
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
          text-align: center
        .price
          display: block
          line-height: 24px
          font-size: 24px
          color: rgb(7, 17, 27)
          text-align: center
          .unit
            font-size: 10px
        .min-price
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, 0.1)
        .delivery-price
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, 0.1)
        .delivery-time
          flex: 1
    .bulletin-supports-wrapper
      padding: 18px 18px 0 18px
      .bulletin
        padding: 0 12px 16px 12px
        line-height: 24px
        font-size: 12px
        color: rgb(240, 20, 20)
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .supports
        .support-item
          padding: 16px 12px
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .icon
            vertical-align: top
            icon-image(16px, 16px, 6px, '1')
    .seller-view
      padding: 18px
      height: 116px
      .pic-wrapper
        width: 100%
        height: 116px
        overflow-x: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0

    .seller-infos
      padding: 18px 18px 0 18px
      .info
        padding: 16px 12px
        line-height: 16px
        font-size: 12px
        color: rgb(7, 17, 27)
        border-top: 1px solid rgba(7, 17, 27, 0.1)
</style>
