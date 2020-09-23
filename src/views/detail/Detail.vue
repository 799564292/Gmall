<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @itemClick="titleClick" ref="nav" :current-index="currentIndex"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll"
             :probe-type="3">
      <datail-swiper :top-images="topImages" ref="base"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommendList" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>


  </div>
</template>

<script>
  import Scroll from "../../components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";


  import DetailNavBar from "./childComps/DetailNavBar";
  import DatailSwiper from "./childComps/DatailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import BackTop from "../../components/content/backTop/BackTop";


  import {getDetail, getRecommend, Goods,Shop,GoodsParam} from "../../network/detail";

  export default {
        name: "Detail",
      components:{
          DetailNavBar,
          DatailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,

        Scroll,
        GoodsList,
        BackTop



      },
        data() {
            return {
                iid: null,
              topImages:[],
              goods: {},
              shop:{},
              detailInfo: {},
              paramInfo: {},
              commentInfo: {},
              recommendList: [],
              themeTops: [],
              currentIndex: 0,
              isShowBackTop: false,
            }
        },


        created() {
          this.iid = this.$route.params.iid

          getDetail(this.iid).then(res =>{
            console.log(res);
            const data = res.result;
            // 1.获取轮播图的图片
            this.topImages = data.itemInfo.topImages
            // 2.获取商品信息（价格等等）
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
            // 3.获取店铺信息
            this.shop = new Shop(data.shopInfo)
            // 4.获取商品详情数据
            this.detailInfo = data.detailInfo
            // 5.获取商品参数（衣服大小尺寸）
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
            // 6.获取评论信息
            if (data.rate.list){
              this.commentInfo = data.rate.list[0]
            }


          })
                    // 获取推荐商品数据
          getRecommend().then(res =>{
            this.recommendList = res.data.list

          })


            },

            methods:{
              imageLoad(){
                this.$refs.scroll.refresh()
                this.themeTops = []
                this.themeTops.push(this.$refs.base.$el.offsetTop)
                this.themeTops.push(this.$refs.param.$el.offsetTop)
                this.themeTops.push(this.$refs.comment.$el.offsetTop)
                this.themeTops.push(this.$refs.recommend.$el.offsetTop)
                this.themeTops.push(Number.MAX_VALUE)
                console.log(this.themeTops);

              },
              titleClick(index) {
                console.log(this.themeTops[index]);
                this.$refs.scroll.scrollTo(0, -this.themeTops[index],100)
              },
                addToCart(){
                    const obj = {}
                    obj.iid= this.iid
                    obj.imgURL = this.topImages[0]
                    obj.title = this.goods.title
                    obj.desc = this.goods.desc;
                    obj.newPrice = this.goods.nowPrice;
                    this.$store.commit('addCart' ,obj)

                },

              contentScroll(position){
                this.isShowBackTop = (-position.y) > 1000
                const positionY = -position.y;
                let length = this.themeTops.length;
                for (let i = 0; i < length-1; i++){
                  if (this.currentIndex!==i && (positionY>=this.themeTops[i] && positionY<this.themeTops[i+1]))
                  {
                    this.currentIndex = i,
                           this.$refs.nav.currentIndex = this.currentIndex
                  }
                }
              },
              backClick() {
                this.$refs.scroll.scrollTo(0, 0)
              },




            }


    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;

  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;

  }
  .content{
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
</style>
