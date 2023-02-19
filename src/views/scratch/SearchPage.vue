<template>
  <div class="container">
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>首页</el-button>
    </div>
    <div class="search_container">
        <div style="width: 100%; font-size: 20px; text-align: center; align-items: center; justify-content: center; display: flex">搜索小测验</div>
      <el-input v-model="keyword" id="input" @input="input" autofocus placeholder="搜索练习赛" style="margin-top: 2rem;" round></el-input>
      <div style="display: flex; padding-bottom: 8px" v-for="(item, index) in list" @click="gotoGuess(item)">
        <img class="cover" :src="imgOrigin + item.cover + '?x-oss-process=image/resize,h_300/quality,q_75'" style="">
        </img>
        <div style="padding-left: 8px">
          <div style="font-size: 24px; font-weight: bold;">
            {{item.name}}
          </div>
          <div>
            {{item.desc}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
export default {
  name: "SearchPage",
  data() {
    return {
      keyword: '',
      list: []
    }
  },

  mounted() {
    this.input();
  },
  methods: {
    input() {
      api.getByPath('/api/v0/scratch/game/search', {keyword: this.keyword}).then(res=>{
        this.list = res.data
      })
    },
    goHome() {
      window.location.href = '/scratch';
    },
    goBack() {
      try {
        this.$router.go(-1);
      } catch (e) {
        window.location.href = '/scratch'
      }
    },
    gotoGuess(item) {
      window.open('/scratch/guess?id=' + item.id);
    },
  }
}
</script>

<style lang="scss" scoped>

.container {
  height: 100%;
  width: 100%;
  .search_container {
    max-width: 40%;
    margin: auto;
  }
  .cover {
    width: 100px; height: 100px;
    //background-color: grey;
    object-fit: cover;
  }
}

@media only screen and (max-width: 679px) {
  .container {
    .search_container {
      max-width: 90%;
      margin: auto;
    }
  }
}
</style>
