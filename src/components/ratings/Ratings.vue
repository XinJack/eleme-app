<template>
  <div class="ratings-wrapper"  ref="ratings">
    <div>
      <div class="rating-header">
        <div class="header-left">
          <span class="score">{{seller.score}}</span>
          <span class="desc">综合评分</span>
          <span class="rank-rate">高于周边商家{{seller.rankRate}}%</span>
        </div>
        <div class="header-right">
          <div class="service-score">
            <span class="desc">服务态度</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.serviceScore"></star>
            </div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="food-score">
            <span class="desc">商品评价</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.foodScore"></star>
            </div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-time">
            <span class="desc">送达时间</span><span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
        <div class="desc"></div>
      </div>
      <split></split>
      <rating-select :desc="desc" :ratings="ratings" @onlyContent-toggle="toggle" @selectType-select="select"></rating-select>
      <div class="ratings">
        <ul>
          <li v-for="rating in ratings" class="rating border-1px" v-show="showRating(rating)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div>
              <div class="user">{{rating.username}}</div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
              </div>
              <div class="delivery-time">{{rating.deliveryTime}}分钟送达</div>
              <p class="text">{{rating.text}}</p>
              <div class="recommand">
                <i :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down':rating.rateType!==0}"></i>
                <span v-for="(food, index) in rating.recommend" class="recommand-food" v-show="index < 3">{{food}}</span>
              </div>
            </div>
          </li>
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
  import RatingSelect from '../../components/ratingSelect/RatingSelect.vue';
  import ShoppingCart from '../shoppingCart/ShoppingCart.vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date.js';

  const ALL = 2;
  const ERR_OK = 0;
  export default {
    props: {
      seller: Object
    },
    data () {
      return {
        ratings: [],
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        },
        onlyContent: true,
        selectType: ALL,
        scroll: null,
        selectedFoods: []
      };
    },
    created () {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      });
    },
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
      showRating (rating) {
        if (this.onlyContent && !rating.text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === rating.rateType;
        }
      },
      toggle (only) {
        this.onlyContent = only;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      select (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    components: {
      'star': Star,
      'split': Split,
      'rating-select': RatingSelect,
      'shopping-cart': ShoppingCart
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .ratings-wrapper
    width: 100%
    position: absolute
    top: 174px
    bottom: 46px
    overflow: hidden
    .rating-header
      display: flex
      padding: 18px 0
      .header-left
        flex: 1
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        .score
          display: block
          margin-bottom: 6px
          width: 100%
          line-height: 28px
          font-size: 24px
          text-align: center
          color: rgb(255, 153, 0)
        .desc
          display: block
          margin-bottom: 8px
          width: 100%
          line-height: 12px
          font-size: 12px
          text-align: center
          color: #000
        .rank-rate
          display: block
          width: 100%
          margin-bottom: 6px
          line-height: 10px
          font-size: 10px
          text-align: center
          color: rgb(147, 153, 159)
      .header-right
        flex: 0 0 194px
        padding: 0 24px
        .service-score
          margin-bottom: 8px
          height: 18px
          line-height: 18px
          font-size: 0px
          .desc
            display: inline-block
            margin-right: 12px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star-wrapper
            display: inline-block
            margin-right: 12px
            vertical-align: top
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .food-score
          margin-bottom: 8px
          height: 18px
          line-height: 18px
          font-size: 0px
          .desc
            display: inline-block
            margin-right: 12px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star-wrapper
            display: inline-block
            margin-right: 12px
            vertical-align: top
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-time
          height: 18px
          line-height: 18px
          font-size: 0px
          .desc
            margin-right: 12px
            font-size: 12px
            color: #000
          .time
            font-size: 12px
            color: rgb(147, 153, 159)

    .ratings
      padding: 0 18px
      .rating
        display: flex
        padding: 18px 0px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          margin-right: 12px
          img
            border-radius: 50%
        div
          flex: 1
          postion: relative
          .user
            margin-bottom: 4px
            font-size: 10px
            line-height: 12px
            color: rgb(7, 17, 27)
          .time
            position: absolute
            top: 18px
            right: 0px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .star-wrapper
            display: inline-block
            vertical-align: top
            margin-bottom: 6px
            margin-right: 6px
          .delivery-time
            display: inline-block
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .recommand
            .icon-thumb_up, .icon-thumb_down
              display: inline-block
              vertical-align: top
              margin-right: 8px
              line-height: 16px
              font-size: 12px
            .icon-thumb_down
              color: rgb(183, 187, 191)
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .recommand-food
              display: inline-block
              vertical-align: top
              height: 16px
              margin-right: 8px
              padding: 0 12px
              line-height: 16px
              font-size: 9px
              color: rgb(147, 153, 159)
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px


</style>
