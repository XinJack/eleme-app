<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class="{'current': selectedIndex === index}" @click="selectMenu(index, $event)">
          <span class="text"><span v-show="item.type > -1" class="icon" :class="iconClass[item.type]"></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="item in goods">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food, $event)" class="food-item" v-for="food in item.foods">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now"><span class="icon">￥</span>{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old"><span class="icon">￥</span>{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control :food="food" @cart-add="_drop"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopping-cart ref="shopCart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selected-foods="selectedFoods"></shopping-cart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import ShoppingCart from '../shoppingCart/ShoppingCart.vue';
  import CartControl from '../cartControl/CartControl.vue';
  import Food from '../food/Food.vue';

  const ERR_OK = 0;

  export default {
    props: {
      seller: Object
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        curScrollY: 0,
        selectedFood: {}
      };
    },
    components: {
      'shopping-cart': ShoppingCart,
      'cart-control': CartControl,
      'food': Food
    },
    computed: {
      selectedIndex () {
        for (let i = 0; i < this.listHeight.length; ++i) {
          let height = this.listHeight[i];
          let nextHeight = this.listHeight[i + 1];
          if (!nextHeight || (this.curScrollY >= height && this.curScrollY < nextHeight)) {
            return i;
          }
        }
        return 0;
      },
      selectedFoods () {
        let foods = [];
        this.goods.forEach((item) => {
          item.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        this.$emit('select-foods', foods);
        return foods;
      }
    },
    created () {
      this.iconClass = ['decrease', 'discount', 'invoice', 'guarantee', 'special'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // 使得俩栏可以滚动
          this.$nextTick(() => {
            this._initScroll();
            // 计算右侧栏的高度
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      selectMenu (index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let element = foodList[index];
        this.foodsScroll.scrollToElement(element, 300);
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      _drop (target) {
        // 阻止事件冒泡
        event.stopPropagation();
        // 优化动画效果
        this.$nextTick(() => {
          this.$refs.shopCart.drop(target);
        });
      },
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        // 监听右侧栏的滚动事件
        this.foodsScroll.on('scroll', (pos) => {
          this.curScrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; ++i) {
          let foodItem = foodList[i];
          height += foodItem.clientHeight;
          this.listHeight.push(height);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .goods
    display: flex
    width: 100%
    position: absolute
    top: 174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      background: #f3f5f7
      //padding: 0 12px
      .menu-item
        display: table
        padding: 0 12px
        width: 56px
        height: 54px
        &.current
        // position: relative
          margin-top: -1px
          background-color: #fff
          font-weight: 700
          border-none()
        .text
          display: table-cell
          width: 56px
          height: 54px
          vertical-align: middle
          line-height: 14px
          font-size: 12px
          color: rgb(7, 17, 27)
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            icon-image(12px, 12px, 2px, '3')
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        border-left: 2px solid #d9dde1
        height: 26px
        background: #f3f5f7
        line-height: 26px
        font-size: 12px
        color: rgb(147, 153, 159)
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
          img
            border-radius: 2px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            margin: 8px 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .extra
            .count
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

          .cart-control-wrapper
            position: absolute
            width: 96px
            height: 36px
            right: 0px
            bottom: 0px
            // bottom: 0px
</style>
