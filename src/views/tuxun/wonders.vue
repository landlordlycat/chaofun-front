<template>
  <div style="width: 100vw; height: 100vh;display: flex;flex-direction: column; ">
    <div class="back_home">
      <div @click="goHome" class="left-title">
        <div >图寻</div>
        <div v-if="ISPHONE" class="desc">街景奇观</div>
      </div>
      <div v-if="!ISPHONE" class="middle-title">街景奇观</div>
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

      // this.panorama.registerPanoProvider(this.getCustomPanorama)

      if (this.tuxunPid) {
        this.setSharePano(this.tuxunPid)
      } else {
        this.change()
      }
    },
    getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
      return (
          'https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid='+ pano + '&zoom=' + zoom + '&x=' + tileX + '&y=' + tileY
      );
    },
    getCustomPanorama(pano) {
      console.log(pano)
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
          worldSize: new google.maps.Size(2048, 1024),
          // The heading in degrees at the origin of the panorama
          // tile set.
          centerHeading: 0,
          getTileUrl: this.getCustomPanoramaTileUrl,
        },
      };
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

  .left-title {
    font-size: 28px;
    font-weight: bold;
    margin: 1rem;
    cursor: pointer;
    .desc {
      font-weight: normal;
      font-size: 16px;
    }
  }
  .middle-title {
    font-size: 28px;
    font-weight: bold;
    margin: 1rem;
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


