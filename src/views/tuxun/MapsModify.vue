<template>
  <div class="container">
    <el-dialog title="提交街景" :visible.sync="submitPanoramaShow" :append-to-body="true">
      <el-form :model="form">
        <el-form-item label="街景链接:一行一条，支持百度街景和Google街景">
          <a target="_blank" href="https://www.yuque.com/ucun5p/kfw26e/ttqiucknz7sifo5u">点击跳转教程</a>
          <el-input type="textarea" :autosize="{ minRows: 4}"
                    v-model="panoramaSubmitForm.links" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideSubmitPanorama()">取 消</el-button>
        <el-button type="primary" @click="submitPano()">确 定</el-button>
      </div>
    </el-dialog>

    <div class="back_home" >
      <el-button type="primary" @click="goHome" round>←返回首页</el-button>
      <el-button type="primary" @click="publish" round>发布</el-button>
    </div>

    <div v-if="name" class="nav">
      {{this.name}}
    </div>
    <div v-if="mapsData && mapsData.desc" class="describe">
      {{mapsData.desc}}
    </div>
    <el-button @click="modify" type="primary">修改基础信息</el-button>
    <div style="padding-bottom: 2rem"></div>
    <el-button @click="addPano" type="primary">增加街景</el-button>
    <div style="color: white">发布题库需要题库中有5个状态为已发布或者待发布状态的街景，当系统检测到题库中有5个Google官方街景，会自动将题库标记为「可移动」</div>
    <div class="list_container">
      <div style="margin-top: 1rem; font-size: 20px; color: white">
        街景列表
      </div>
      <div v-for="(item, index) in panos" style="display: flex;justify-content: space-between">
        <div style="display: flex; color: white">
          <div @click="toPano(item)">{{item.panoId}}</div>
          <div v-if="item.status === 'crawling'" class="status">准备中</div>
          <div v-if="item.status === 'publish'" class="status">已发布</div>
          <div v-if="item.status === 'crawler_success'" class="status">待发布</div>
          <div v-if="item.status === 'crawler_fail'" class="status">准备失败</div>
        </div>
        <div style="color: white" @click="deletePano(item.id)">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '@/api/api'

export default {
  name: "MapsCreate",
  data() {
    return {
      name: '',
      panos: [],
      mapsId: null,
      submitPanoramaShow: false,
      mapsData: null,
      form: {
        applyModReason: '',
      },
      panoramaSubmitForm: {
        links: '',
      },
    }
  },
  mounted() {
    this.mapsId = this.$route.query.mapsId;
    this.getMapsName();
    this.getPanos();

    setInterval(() => {
      this.getPanos();
    }, 10000 );
  },
  methods: {
    goHome() {
      tuxunJump('/tuxun/');
    },
    getMapsName() {
      api.getByPath('/api/v0/tuxun/maps/get', {mapsId: this.mapsId}).then(res=>{
        this.name = res.data.name;
        this.mapsData = res.data;
      })
    },
    getPanos() {
      api.getByPath('/api/v0/tuxun/maps/listPano', {mapsId: this.mapsId}).then(res=>{
        this.panos = res.data;
      })
    },
    publish() {
      api.getByPath('/api/v0/tuxun/maps/publish', {mapsId: this.mapsId}).then(res=>{
        if (res.success) {
          tuxunJump('/tuxun/my_maps');
        }
      })
    },
    addPano() {
      this.submitPanoramaShow = true;
    },
    hideSubmitPanorama() {
      this.submitPanoramaShow = false;
    },
    submitPano() {
      api.postByPath('/api/v0/tuxun/maps/userAddPanorama',
          {links: this.panoramaSubmitForm.links, mapsId: this.mapsId}).then(res=>{
        this.panoramaSubmitForm.links = '';
        this.$toast('提交成功, 谢谢你！');
        this.submitPanoramaShow = false;
        this.getPanos();
      })
    },
    deletePano(id) {
      this.$confirm('此操作将删除该街景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.getByPath('/api/v0/tuxun/maps/deletePano', {containId: id}).then(res=>{
          this.getPanos();
        })
      }).catch(() => {

      });
    },
    toPano(item) {
      if (item.source === 'baidu_pano') {
        tuxunOpen('https://maps.baidu.com/#panoid=' + item.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + item.panoId)
      } else {
        tuxunOpen('https://www.google.com/maps/@?api=1&map_action=pano&pano=' + item.panoId)
      }
    },
    toGuid() {
      tuxunOpen('https://www.yuque.com/ucun5p/kfw26e/ttqiucknz7sifo5u')
    },
    modify() {
      tuxunJump('/tuxun/maps_create?mapsId=' + this.mapsId);

    }
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

  .describe {
    color: yellow;
    font-size: 1rem;
    font-weight: 700;
  }

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
  .list_container {
    width: 60%;
    margin: 0 auto;

  }
  .status {
    padding-left: 10px;
  }
}

@media only screen and (max-width: 679px) {
  .container {
    .list_container {
      max-width: 90%;
      margin: auto;
    }
  }
}
</style>
