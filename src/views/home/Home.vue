<template>
    <div id="home" class="wrapper">
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <tab-control ref="tabControl1"
                     :titles="['流行', '新款', '精选']"
                     @tabClick="tabClick"
                      class="tab-control" v-show="isTabFixed"/>
        <scroll class="content"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="loadMore">
            <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
            <recommend-view :recommends="recommends"/>
            <feature-view/>
            <tab-control ref="tabControl2"
                         :titles="['流行', '新款', '精选']"
                         @tabClick="tabClick"/>
            <goods-list :goods="showGoods"/>
        </scroll>

        <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>



</template>

<script>
  import {getHomeMultidata} from "../../network/home";
  import {getHomeGoods} from "../../network/home";
  import {debounce} from "../../common/utils";

  import NavBar from "../../components/common/navbar/NavBar";



  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
   import TabControl from "../../components/content/tabControl/TabControl";
   import GoodsList from "../../components/content/goods/GoodsList";
   import Scroll from "../../components/common/scroll/Scroll";
   import BackTop from "../../components/content/backTop/BackTop";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
      data() {
          return {
              banners: [],
              recommends: [],
              goods: {
                  'pop': {page: 0, list: []},
                  'new': {page: 0, list: []},
                  'sell': {page: 0, list: []},
              },
              currentType: 'pop',
              isShowBackTop: false,
              tabOffsetTop: 0,
              isTabFixed: false,
              saveY:0

          }
      },
      computed: {
          showGoods() {
              return this.goods[this.currentType].list
          }
      },
      activated() {
        this.$refs.scroll.scrollTo(0,this.saveY)
          this.$refs.scroll.refresh()
      },
      deactivated() {
        this.saveY = this.$refs.scroll.getScrollY()

      },
      created() {
          // 1.请求多个数据
          this.getHomeMultidata()

          // 2.请求商品数据
          this.getHomeGoods('pop')
          this.getHomeGoods('new')
          this.getHomeGoods('sell')
      },
      mounted() {
        const refresh=debounce(this.$refs.scroll.refresh,50)
          this.$bus.$on('itemImageLoad',()=>{
           refresh()
          })

      },
      methods: {
          /**
           * 事件监听相关的方法
           */
          tabClick(index) {
              switch (index) {
                  case 0:
                      this.currentType = 'pop'
                      break
                  case 1:
                      this.currentType = 'new'
                      break
                  case 2:
                      this.currentType = 'sell'
                      break
              }
              this.$refs.tabControl1.currentIndex = index;
              this.$refs.tabControl2.currentIndex = index;
          },
          backClick() {
              this.$refs.scroll.scrollTo(0, 0)
          },
          contentScroll(position) {
              // 1.判断BackTop是否显示

              this.isShowBackTop = (-position.y) > 1000

              // 2.决定tabControl是否吸顶(position: fixed)
              this.isTabFixed = (-position.y) >this.tabOffsetTop

          },
          loadMore() {
              this.getHomeGoods(this.currentType)
          },
          swiperImageLoad(){
              this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;

          },
          /**
           * 网络请求相关的方法
           */
          getHomeMultidata() {
              getHomeMultidata().then(res => {
                  // this.result = res;
                  this.banners = res.data.banner.list;
                  this.recommends = res.data.recommend.list;
              })
          },
          getHomeGoods(type) {
              const page = this.goods[type].page + 1
              getHomeGoods(type, page).then(res => {
                  this.goods[type].list.push(...res.data.list)
                  this.goods[type].page += 1

                  this.$refs.scroll.finishPullUp()
              })
          }
      }
  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
      height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
   /* position: fixed;*/
   /*left: 0;*/
   /* right: 0;*/
   /* top: 0;*/
   /* z-index: 9;*/
  }
  .tab-control{
      position: relative;
      z-index: 9;
  }
  .content{
      overflow: hidden;
    position: absolute;

    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

</style>
