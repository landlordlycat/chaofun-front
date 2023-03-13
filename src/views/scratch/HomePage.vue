<template>
  <div class="container">
    <div style="text-align: center; width: 100%; font-size: 32px;font-weight: bold; padding-top: 1rem; padding-bottom: 2rem"> 炒饭小测验
      <div v-if="totalTimes" style="font-size: 16px">做题也可以很快乐 -「炒饭社区」出品</div>
      <div v-if="totalTimes" style="font-size: 16px">交流QQ群号: <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=IuAqwN27">594837569</a></div>
      <div v-if="totalTimes" style="font-size: 16px">小测验文档: <a target="_blank" href="https://www.yuque.com/chaofun/scratch">文档地址</a> </div>
      <div v-if="totalTimes" style="font-size: 16px">总测验次数: {{totalTimes}}</div>
      <div class="top-right">
<!--        <el-button type="primary" @click="toUserHome" round>个人首页</el-button>-->
        <el-button @click="toCreate" round>创建小测验</el-button>
        <div></div>
        <el-button type="primary" @click="random" round>随机小测验</el-button>
      </div>
    </div>

    <section v-if="list" class="list_container">
      <div>
        <el-button type="warning" @click="showHotTags=!showHotTags" round>热门标签</el-button>
        <el-button type="warning" @click="gotoSearch" round>搜索</el-button>
      </div>
      <div v-if="showHotTags" style="display: flex; flex-wrap: wrap; border: 1px solid gray ">
        <div v-for="(item,index) in tags" @click="goTag(item)" style="display: block; padding-right: 10px; color: blue; font-size: 20px;">{{item}}</div>
      </div>
      <scratch-list
          :sort="sort"
          :current="current"
      ></scratch-list>
    </section>
  </div>
</template>

<script>
import * as api from '../../api/api'
import page from "../permission/page";
import ScratchList from "./scratch-list";

export default {
  name: "HomePage",
  components: {ScratchList},
  data() {
    return {
      totalTimes: null,
      sort: '1day',
      showHotTags: false,
      total: 100000,
      current: 1,
      page: 1,
      tags: [],
      list: [],
    }
  },
  created() {
    if (!location.host.includes('choa.fun') && !location.host.includes('8099')) {
      window.location.href = window.location.href.replace(location.host, 'choa.fun')
    }
    if (this.$route.query.sort) {
      this.sort = this.$route.query.sort;
    }

    console.log(this.$route.query.page)
    if (this.$route.query.page) {
      // console.log()
      this.current = parseInt(this.$route.query.page);
    }

    this.listTag();
    this.getTotalGuessTimes();
  },

  methods: {
    getTotalGuessTimes() {
      api.getByPath('/api/v0/scratch/game/getTotalStartTimes' ).then(res=>{
        this.totalTimes = res.data;
      })
    },
    listTag() {
      api.getByPath('/api/v0/scratch/tag/listHot', {size: 40} ).then(res=>{
        this.tags = res.data;
      })
    },
    goTag(item) {
      window.location.href = '/scratch/tag?tagName=' + item;
    },
    toCreate() {
      this.doLoginStatus().then((res) => {
        if (res) {
          window.location.href = '/scratch/choose-create'
        }
      });
    },
    random() {
      api.getByPath('/api/v0/scratch/game/random').then(res=>{
        window.location.href = '/scratch/guess?id=' + res.data;
      })
    },
    gotoSearch() {
      window.location.href = '/scratch/search'
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .list_container {
    max-width: 40%;
    margin: auto;
  }

}

@media only screen and (max-width: 768px) {
  .container {
    .list_container {
      max-width: 90%;
      margin: auto;
    }
    .container {
    }
  }
}

</style>
