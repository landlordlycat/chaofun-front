<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button round>←首页</el-button>
    </div>
    <div v-if="!modify" class="nav">
      自建题库
    </div>
    <div v-if="modify" class="nav">
      修改题库信息
    </div>
    <div style="color: white;">设置封面(可选)<el-button v-if="cover" @click="cover=null">清空</el-button></div>
    <div>
      <el-upload
          :before-upload="beforeAvatarUpload"
          :data="filedata"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          action="/api/upload_image"
          class="avatar-uploader"
          name="file">
        <img v-if="cover" :src="imgOrigin + cover" class="avatar">
        <i style="border: 1px solid black;" v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div style="color: white; margin-top: 2rem">题库名字</div>
    <el-input v-model="name" id="input" placeholder="题库名字" style="max-width: 60%;" round></el-input>
    <div style="color: white; margin-top: 1rem">题库描述</div>
    <el-input v-model="desc" id="input" placeholder="题库描述" style="max-width: 60%;" round></el-input>
    <div></div>
    <el-button v-if="!modify" @click="addMap" style="margin-top: 1rem" type="primary">创建</el-button>
    <el-button v-else @click="modifyMap" style="margin-top: 1rem" type="primary">修改</el-button>
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
      imageUrl: '',
      filedata: {},
      cover: null,
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
        this.cover = res.data.cover;
      })
    },
    addMap() {
      api.getByPath('/api/v0/tuxun/maps/add', {name: this.name, desc: this.desc, cover: this.cover}).then(res => {
        if (res.success) {
          tuxunJump('/tuxun/maps_modify?mapsId=' + res.data.id);
        } else if (res.errorCode === 'need_vip') {
          this.$vip();
        }
      })
    },
    modifyMap() {
      api.getByPath('/api/v0/tuxun/maps/modify', {mapsId: this.mapsId, name: this.name, desc: this.desc, cover: this.cover}).then(res => {
        if (res.success) {
          tuxunJump('/tuxun/maps_modify?mapsId=' + res.data.id);
        } else if (res.errorCode === 'need_vip') {
          this.$vip();
        }
      })
    },
    handleAvatarSuccess(res) {
      if (res.success) {
        this.cover = res.data;
      } else if (res.errorCode == 'invalid_content') {
        // this.imageUrl = ''
        this.$toast(res.errorMessage)
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        return false;
      }
      this.filedata.fileName = file.name;
      return true;
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: white;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  background-color: white;

  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}

.avatar {
  width: 300px;
  height: 150px;
  object-fit: fill;
}

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
