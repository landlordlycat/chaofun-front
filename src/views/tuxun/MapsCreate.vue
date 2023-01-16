<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button type="primary" round>←返回首页</el-button>
    </div>
    <div v-if="!modify" class="nav">
      自建题库
    </div>
    <div v-if="modify" class="nav">
      修改题库信息
    </div>

    <div style="color: white; margin-top: 2rem">题库名字</div>
    <el-input v-model="name" id="input" placeholder="题库名字" style="max-width: 60%;" round></el-input>
    <div style="color: white; margin-top: 1rem">题库描述</div>
    <el-input v-model="desc" id="input" placeholder="题库描述" style="max-width: 60%;" round></el-input>
    <div></div>
    <el-button v-if="!modify" @click="addMap" style="margin-top: 1rem" type="primary">创建</el-button>
    <el-button v-else @click="modify" style="margin-top: 1rem" type="primary">修改</el-button>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'
import {postByPath} from "../../api/api";
export default {
  name: "MapsCreate",
  data() {
    return {
      name: '',
      desc: '',
      modify: false,
    }
  },
  mounted() {
    this.mapsId = this.$route.query.mapsId;
    if (this.mapsId) {
      this.modify = true;
      this.get();
    }
  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/')
    },
    get() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.desc = res.data.desc;
      })
    },
    addMap() {
      api.getByPath('/api/v0/tuxun/maps/add', {name: this.name, desc: this.desc}).then(res => {
        if (res.success) {
          tuxunJump('/tuxun/maps_modify?mapsId=' + res.data.id);
        } else if (res.errorCode === 'need_vip') {
          this.$vip();
        }
      })
    },
    modify() {
      api.getByPath('/api/v0/tuxun/maps/modify', {mapsId: this.mapsId, name: this.name, desc: this.desc}).then(res => {
        if (res.success) {
          tuxunJump('/tuxun/maps_modify?mapsId=' + res.data.id);
        } else if (res.errorCode === 'need_vip') {
          this.$vip();
        }
      })
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



}
</style>
