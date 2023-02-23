<template>
  <div>
    <el-radio-group v-model="sort" style="margin-bottom: 20px;margin-top: 20px;" @change="changeSort">
      <el-radio-button label="hot">最热</el-radio-button>
      <el-radio-button label="new">最新</el-radio-button>
      <el-radio-button  v-if="hasCreate" label="mine">我创建的</el-radio-button>
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
        <img class="cover" :src="imgOrigin + item.cover + '?x-oss-process=image/resize,h_300/format,jpeg/quality,q_75'" style="">
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
  </div>
</template>

<script>
import * as api from "../../api/api";

export default {
  name: "scratch-list",
  data() {
    return {
      total: 10000,
      list: [],
      // sort: 'new',
      // current: 1;
      hasCreate: true
    }
  },
  props: {
    sort: String,
    current: Number,
    tag: String,
    userId: Number,
    hasCreate: Boolean,
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      api.getByPath('/api/v0/scratch/game/listV1', {order: this.sort, pageSize: 50, pageNum: this.current, userId: this.userId, tag: this.tag}).then(res=>{
        this.list = res.data.games;
        this.total = res.data.total;
      })
    },
    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
    },

    changeSort(tab, event) {
      this.list = [];
      this.current = 1;
      this.$router.replace({query: {sort: this.sort, page: this.current  }})
      this.getList();
    },

    handleCurrentChange(current) {
      this.$router.replace({query: {sort: this.sort, page: this.current}})
      this.getList()
    },
    gotoSearch() {
      window.location.href = '/scratch/search'
    }
  }
}
</script>

<style lang="scss" scoped>
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
    object-fit: contain;
  }
}

</style>
