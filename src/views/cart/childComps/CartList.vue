<template>
  <scroll ref="scroll">

      <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>

  </scroll>
</template>

<script>
  import Scroll from "../../../components/common/scroll/Scroll";
  import CartListItem from './CartListItem'

	export default {
		name: "CartList",
    components: {
		  Scroll,
        CartListItem
    },
    props: {
		  cartList: {
		    type: Array,
        default() {
		      return []
        }
      }
    },
    activated() {
		    this.$refs.scroll.refresh();

    }
    }
</script>

<style scoped>

</style>
