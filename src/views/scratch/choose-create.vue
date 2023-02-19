<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
      <el-button @click="share" size="small"  round>分享</el-button>
      <el-button @click="random" size="small"  round>随机下一个</el-button>
      <el-button size="small"  v-if="guessInfo &&  this.$store.state.user && this.$store.state.user.userInfo  && this.$store.state.user.userInfo.userId === this.guessInfo.userId" @click="modify" round>修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChooseCreatePage"
}
</script>

<style scoped>

</style>
