<template>
<swiper class="detail-swiper">
    <swiper-item v-for="item in topImages">
        <img :src="item">

    </swiper-item>
</swiper>
</template>

<script>
    import Swiper from "../../../components/common/swiper/Swiper";
    import SwiperItem from "../../../components/common/swiper/SwiperItem";
    export default {
        name: "DatailSwiper",
        components:{
            Swiper,
            SwiperItem
        },
        props:{
            topImages:{
                type:Array,
                default(){
                    return[]
                }
            }

        }

    }
</script>

<style scoped>
.detail-swiper{
    height: 300px;
    overflow: hidden;

}
</style>
