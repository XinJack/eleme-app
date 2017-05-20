<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active': selectType === 2}" @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': selectType === 0}" @click="select(0, $event)">{{desc.positive}}<span class="count">{{positiveRatings.length}}</span></span>
      <span class="block negative" :class="{'active': selectType === 1}" @click="select(1, $event)">{{desc.negative}}<span class="count">{{negativeRatings.length}}</span></span>
    </div>
    <div @click="toggle" class="switch" :class="{'on': onlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评论</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGTIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },
//      selectType: {
//        type: Number,
//        default: ALL
//      },
//      onlyContent: {
//        type: Boolean,
//        default: true
//      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    data () {
      return {
        selectType: ALL,
        onlyContent: true
      };
    },
    computed: {
      positiveRatings () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negativeRatings () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGTIVE;
        });
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return;
        }
        this.selectType = type;
        this.$emit('selectType-select', type);
      },
      toggle (event) {
        if (!event._constructed) {
          return;
        }
        this.onlyContent = !this.onlyContent;
        this.$emit('onlyContent-toggle', this.onlyContent);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .rating-select
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        font-size: 12px
        border-radius: 1px
        color: rgb(77, 85, 93)
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            color: #fff
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            color: #fff
            background: rgb(77, 85, 93)
        .count
          margin-left: 6px
          font-size: 8px
    .switch
      padding: 12px 18px
      border-bottom: 2px solid rgba(7, 17, 27, 0.1)
      line-height: 24px
      color: rgb(147, 153, 159)
      font-size: 0px
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
