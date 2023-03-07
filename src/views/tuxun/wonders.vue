<template>
  <div   style="width: 100%; height: 100%; display: flex;flex-direction: column; ">
    <div class="back_home">
      <div v-if="!ISPHONE" class="middle-title">街景奇观</div>
      <div @click="goHome" class="left-title">
        <div >图寻</div>
        <div v-if="ISPHONE" class="desc">街景奇观</div>
      </div>
      <div class="button">
        <!--      <el-button type="primary" @click="goHome" size="mini" round>←返回首页</el-button>-->
        <el-button type="primary" @click="change" size="large" round>换一个</el-button>
        <el-button  @click="shareLink" size="large" round>分享街景</el-button>

      </div>
    </div>
    <div v-if="this.location" class="location" >
      {{this.location}}
    </div>
    <div id="map" class="container" style=""></div>
    <div v-if="!ISPHONE" class="more">
<!--      <div class="more-item">-->
<!--        反馈问题-->
<!--      </div>-->
      <div v-if="this.$store.state.user.userInfo.userId === 1" @click="deleteWonders()" class="more-item">
        删除街景
      </div>
      <div @click="toSubmitPanorama" class="more-item">
        投稿街景
      </div>
    </div>
    <el-dialog title="投稿街景" :visible.sync="submitPanoramaShow" :append-to-body="true">
      <el-form :model="form">
        <el-form-item label="街景链接:一行一条，目前只支持谷歌/百度街景 审核通过会加入到街景奇观中">
          <el-input type="textarea" :autosize="{ minRows: 4}"
                    v-model="panoramaSubmitForm.links" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideSubmitPanorama()">取 消</el-button>
        <el-button type="primary" @click="submitPanorama()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadScript } from "vue-plugin-load-script";
import * as api from '../../api/api'
import {tuxunJump, tuxunOpen} from "./common";

export default {
  name: "RandomStreetView",
  data() {
    return {
      panorama: null,
      tuxunPid: null,
      location: null,
      submitPanoramaShow: false,
      form: {
        applyModReason: '',
      },
      panoramaSubmitForm: {
        links: '',
      },
    }
  },
  mounted() {
    document.head.insertAdjacentHTML("beforeend", `<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>`)
    this.tuxunPid = this.$route.query.id;
    loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-test.js').then(() => {
      this.init();
    })

    document.onkeydown=function(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if(e && e.keyCode===32){//空格
        this.change();
      }
    }.bind(this);
  },
  destroyed() {
    document.onkeydown = undefined;
  },

  methods: {
    init() {
      this.panorama = new google.maps.StreetViewPanorama(
          document.getElementById("map"), {
            fullscreenControl:false,
            panControl: false,
            addressControl: false,
            imageDateControl: false,
            motionTrackingControl:false,
            streetViewControl: false,
            scaleControl: false,
            zoomControl: false,

          }
      );

      this.panorama.registerPanoProvider(this.getCustomPanorama)

      if (this.tuxunPid) {
        this.setSharePano(this.tuxunPid)
      } else {
        this.change()
      }
    },
    getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
      zoom = zoom +=1;

      if (zoom === 1) {
        return (
            'https://tuxun.fun/api/v0/tuxun/mapProxy/bd?pano=' + pano
        );
      }
      return (
          'https://mapsv1.bdimg.com/?qt=pdata&sid=' + pano + '&pos=' + tileY + '_' + tileX + '&z=' + zoom
      );

    },
    deleteWonders() {
      api.getByPath('/api/v0/tuxun/wonders/remove', {tuxunPid: this.tuxunPid}).then(res => {
        this.$message.success('删除成功')
        this.change()
      })
    },
    getCustomPanorama(pano) {
      if (pano.indexOf('09') === 0 || pano.indexOf('01') === 0) {
        return {
          location: {
            pano: pano,
          },
          links: [],
          // The text for the copyright control.
          copyright: "Imagery (c) 2010 Google",
          // The definition of the tiles for this panorama.
          tiles: {
            tileSize: new google.maps.Size(512, 512),
            worldSize: new google.maps.Size(8192, 4096),
            // The heading in degrees at the origin of the panorama
            // tile set.
            centerHeading: 0,
            getTileUrl: this.getCustomPanoramaTileUrl,
          },
        };
      }
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    setSharePano(tuxunPid) {
      api.getByPath('/api/v0/tuxun/wonders/get', {'tuxunPid': this.tuxunPid}).then(res=>{
        this.tuxunPid = tuxunPid;
        this.setPano(this.tuxunPid,res.data.panoId);
      })
    },
    setPano(tuxunPid, panoId) {
      this.tuxunPid = tuxunPid;
      this.panorama.setPano(panoId);
      this.panorama.setVisible(true);
      this.getLocation(panoId)
      // 调整视角大小的
      this.panorama.setZoom(0);
    },
    change() {
      this.location = null;
      this.doLoginStatus().then((res) => {
      if (res) {
        if (this.$route.query.id) {
          tuxunJump('/tuxun/wonders');
          return;
        }
        api.getByPath("/api/v0/tuxun/wonders/random").then(res => {
          if (res.success) {
            this.setPano(res.data.tuxunPid, res.data.panoId);
          } else if (res.errorCode === 'need_vip') {
            this.$vip();
          }
        })
      }
      });
    },
    getLocation(panoId) {
      api.getByPath("/api/v0/tuxun/getLocation", {panoId: panoId}).then(res => {
        this.location = res.data;
      })
    },
    shareLink() {
      var input = document.createElement('input');
      if (this.location) {
        input.setAttribute('value', '图寻-街景奇观 「' + this.location + '」https://tuxun.fun/wonders?id=' + this.tuxunPid);
      } else {
        input.setAttribute('value', '图寻-街景奇观 https://tuxun.fun/wonders?id=' + this.tuxunPid);
      }
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("复制街景地址成功");
    },
    submitPanorama() {
      api.postByPath('/api/v0/tuxun/wonders/submit',
          {links: this.panoramaSubmitForm.links}).then(res=>{
        this.panoramaSubmitForm.links = '';
        this.$toast('提交成功, 谢谢你！');
        this.submitPanoramaShow = false;
      })
    },

    toSubmitPanorama() {
      this.submitPanoramaShow = true;
      setTimeout(function () {
        document.getElementById("input").focus();
      }, 500);
    },

    hideSubmitPanorama() {
      this.submitPanoramaShow = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.back_home {
  background-color: #1C1C2E;
  width: 100%;
  //position: absolute;
  color: white;
  display: flex;
  justify-content: space-between;
  position: relative;

  .left-title {
    font-size: 28px;
    font-weight: bold;
    margin: 0.5rem;
    cursor: pointer;
    .desc {
      font-weight: normal;
      font-size: 16px;
    }
    &:hover {
      transform: scale(1.03);
    }
  }
  .middle-title {
    font-size: 28px;
    font-weight: bold;
    margin: 0.5rem;
    position: absolute;
    height: 100%;
    width: 100%;
    text-align: center;
    justify-content: center;
    justify-items: center;
    pointer-events: none;
  }
  .button {
    align-items: center;
    display: flex;
    height: 100%;
    float: right;
  }
}
.container {
  align-items: stretch;
  flex-grow: 1;
}
.location {
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  bottom: 1rem;
  padding-left: 1rem;
  z-index: 500;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.more {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;

  background-color: #D8DADB;
  z-index: 500;
  .more-item {
    padding-right: 1rem;
    padding-left: 1rem;
    font-size: 10px;
    cursor: pointer;
    &:hover {
      color: -webkit-link;
      text-decoration: underline;
    }
  }
}

@media only screen and (max-width: 768px) {
  .back_home {
    .left-title {
      font-size: 24px;
      .desc {
        font-size: 12px;
      }
    }
  }
}
</style>


