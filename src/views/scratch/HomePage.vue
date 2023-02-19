<template>
  <div class="container">
    <div style="text-align: center; width: 100%; font-size: 32px;font-weight: bold; padding-top: 1rem; padding-bottom: 2rem"> 炒饭小测验
      <div v-if="totalTimes" style="font-size: 16px">「炒饭社区」出品</div>
      <div v-if="totalTimes" style="font-size: 16px">交流QQ群号: <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=IuAqwN27">594837569</a></div>
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
      <el-radio-group v-model="sort" style="margin-bottom: 20px;margin-top: 20px;" @change="changeSort">
        <el-radio-button label="hot">最热</el-radio-button>
        <el-radio-button label="new">最新</el-radio-button>
        <el-radio-button label="mine">我创建的</el-radio-button>
      </el-radio-group>

      <el-pagination
          background
          layout="prev, pager, next"
          style="padding-bottom: 20px"
          :current-page.sync="current"
          :page-size="50"
          @current-change="handleCurrentChange"
          :total="total">
      </el-pagination>



      <div style="display: flex; padding-bottom: 8px" v-for="(item, index) in list" @click="gotoGuess(item)" class="item">
        <div  class="item-img">
          <img class="cover" :src="imgOrigin + item.cover + '?x-oss-process=image/resize,h_300/quality,q_75'" style="">
          </img>
        </div>

        <div  class="item-contain">
          <div style="font-size: 24px; font-weight: bold;">
            {{item.name}}
          </div>
          <div>
            {{item.desc}}
          </div>
        </div>
      </div>

      <el-pagination
          background
          layout="prev, pager, next"
          style="padding-top: 20px"
          :current-page.sync="current"
          :page-size="50"
          @current-change="handleCurrentChange"
          :total="total">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "HomePage",

  data() {
    return {
      totalTimes: null,
      sort: 'hot',
      showHotTags: false,
      total: 0,
      current: 1,
      tags: [],
      list: [],
    }
  },
  mounted() {
    this.getList(1, 50);
    this.listTag();
    this.getTotalGuessTimes();
  },

  methods: {
    getList(pageNum, pageSize) {
      api.getByPath('/api/v0/scratch/game/listV1', {order: this.sort, pageSize: pageSize, pageNum: pageNum}).then(res=>{
        this.list = res.data.games;
        this.total = res.data.total;
      })
    },

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

    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
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

    changeSort(tab, event) {
      this.list = [];
      this.getList(1, 50);
    },

    handleCurrentChange(current) {
      this.getList(current, 50)
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
  .item {
    .item-img {
      flex-shrink: 0;
      height: 100px;
      width: 100px;
    }
    .item-contain {
      padding-left: 8px;
      flex-shrink: 1;
    }
    .cover {
      width: 100%; height: 100%;
      //background-color: grey;
      object-fit: fill;
    }
  }

}

@media only screen and (max-width: 679px) {
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
