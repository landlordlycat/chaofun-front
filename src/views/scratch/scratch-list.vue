<template>
  <div>
    <el-radio-group v-model="innerSort" style="margin-bottom: 20px;margin-top: 20px;" @change="changeSort">
      <el-radio-button v-if="has1Day" label="1day">本日最热</el-radio-button>
      <el-radio-button label="hot">最热</el-radio-button>
      <el-radio-button label="new">最新</el-radio-button>
      <el-radio-button  v-if="hasCreate" label="mine">我创建的</el-radio-button>
    </el-radio-group>

    <el-pagination
        background
        layout="prev, pager, next"
        style="padding-bottom: 20px"
        :current-page.sync="innerCurrent"
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
import {some} from "lodash";

export default {
  name: "scratch-list",
  data() {
    return {
      total: 10000,
      list: [],
      innerSort: null,
      innerCurrent: 1,
      // sort: 'new',
      // current: 1;
    }
  },
  props: {
    sort: {
      type: String,
      default: '1day'
    },
    current: {
      type: Number,
      default: 1,
    },
    tag: String,
    userId: Number,
    hasCreate: {
      type: Boolean,
      default: true
    },
    has1Day: {
      type: Boolean,
      default: true
    }
  },
  created() {
    console.log(this.has1Day);
    console.log(this.sort);
    this.innerSort = this.sort;
    if (!this.has1Day) {
      this.innerSort = 'hot'
    }
    this.innerCurrent = this.current
    this.getList();
  },
  methods: {
    getList() {
      api.getByPath('/api/v0/scratch/game/listV1', {order: this.innerSort, pageSize: 50, pageNum: this.innerCurrent, userId: this.userId, tag: this.tag}).then(res=>{
        this.list = res.data.games;
        this.total = res.data.total;
      })
    },
    gotoGuess(item) {
      window.location.href = '/scratch/guess?id=' + item.id;
    },

    changeSort(tab, event) {
      this.list = [];
      this.innerCurrent = 1;
      this.$router.replace({query: {sort: this.innerSort, page: this.innerCurrent  }})
      this.getList();
    },

    handleCurrentChange(current) {
      this.$router.replace({query: {sort: this.innerSort, page: this.innerCurrent}})
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
