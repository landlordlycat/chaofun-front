<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button v-if="history && history.length > 1" @click="goBack" round>←返回</el-button>
      <el-button v-else @click="goHome"  round>←首页</el-button>
    </div>
    <div class="nav">
      我的题库
    </div>
    <el-button type="primary" @click.stop="toMapsCreate">创建</el-button>
    <div class="game_entrance">
    <div class="grid_main" v-if="pagedata && pagedata.length >= 1">
      <div v-for="(item, index) in pagedata" :style="{'background-image': 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.6)), url('+ imgOrigin + (item.cover ?? 'biz/1659323781589_7d19c33667a54a4dabb0405ee5aec20f.jpeg') + '?x-oss-process=image/resize,h_400)','background-size':'cover'}" @click="toMapDetail(item)" class="card">
        <div class="title">
          {{item.name}}
        </div>
        <div class="players">
          人次: {{item.players}}
        </div>
        <div>
          <el-button style="background-color: unset; color: white"  type="primary" @click.stop="toMapsModify(item.id)" round>编辑</el-button>
          <el-button style="background-color: unset; color: white"  v-if="item.publish" type="warning" @click="unPublish(item.id)" round>撤回</el-button>
          <el-button style="background-color: unset; color: white"  v-if="!item.publish" type="primary" @click="publish(item.id)" round>发布</el-button>
          <el-button style="background-color: unset; color: white"  type="danger" @click="deleteMaps(item.id)" round>删除</el-button>
        </div>
      </div>
    </div>
      </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'
export default {
  name: "MyMaps",
  data() {
    return {
      pagedata: [],
      history: null,
    }
  },
  mounted() {
    this.history = history;
    this.getMapsList();
  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/')
    },
    toMapsCreate() {
      this.doLoginStatus().then(res => {
        console.log(res)
        if (res) {
          tuxunJump('/tuxun/maps_create');
        }
      });
    },
    getMapsList() {
      api.getByPath('/api/v0/tuxun/maps/listOwn').then(res=>{
        this.pagedata = res.data
      })
    },
    unPublish(id) {
      api.getByPath('/api/v0/tuxun/maps/unpublish', {mapsId: id}).then(res=>{
        this.getMapsList();
      })
    },
    publish(id) {
      api.getByPath('/api/v0/tuxun/maps/publish', {mapsId: id}).then(res=>{
        this.getMapsList();
      })
    },
    toMapDetail(item) {
      tuxunJump('/tuxun/maps_detail?mapsId=' + item.id )
    },
    deleteMaps(id) {
      this.$confirm(`是否确定删除该题库吗？`, "提示", {
        type: "warning",
        position: "top",
      }).then(() => {
            api.getByPath('/api/v0/tuxun/maps/delete', {mapsId: id}).then(res => {
              this.getMapsList();
            })
      });
    },
    toMapsModify(id) {
      tuxunJump('/tuxun/maps_modify?mapsId=' + id)
    },
    goBack() {
      try {
        window.history.back();
      } catch (e) {
        tuxunJump('/tuxun/')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color: #090723;

  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .game_entrance {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    margin-top: 3rem;
    margin-bottom: 5rem;

    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);

      .card {
        position: relative;
        border-radius: 1rem;
        background-color: rgb(25, 26, 46, 0.9);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        box-radius: 1rem;
        flex-direction: column;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 4rem 4rem 2rem 4rem;
        min-height: 110px;

        .title {
          font-size: 1.5rem;
          color: white;
          font-weight: 700;
          padding-bottom: 0.2rem;
        }

        .describe {
          color: yellow;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .players {
          color: white;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .card-top-right {
          position: absolute;
          right: 2px;
          top: 2px;
          color: white;
          font-weight: bold;
          font-size: 16px;
          padding-left: 5px;
          padding-right: 5px;
          background-color: #3590FF;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .container {
    .game_entrance {
      .grid_main {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}

</style>
