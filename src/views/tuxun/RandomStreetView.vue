<template>
  <div style="width: 100vw; height: 100vh;display: flex;flex-direction: column; ">
    <div class="back_home">
      <div @click="goHome" class="left-title">
        <div >图寻</div>
        <div v-if="ISPHONE" class="desc">随机街景</div>
      </div>
      <div v-if="!ISPHONE" class="middle-title">随机街景</div>
      <div class="button">
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
            panControl:true,
            addressControl: false,
            imageDateControl: true,
            motionTrackingControl:false,
            streetViewControl:true
          }
      );

      // // document.getElementsByTagName("a[href^=\"http://maps.google.com/maps\"]").style.display="none";
      // console.log('123')
      // // console.log(document.querySelectorAll('a[href^="https://maps.google.com/maps"]'))
      // console.log( document.getElementsByClassName('gmnoprint'))
      // console.log('234')
      // setTimeout(() => {
      //   document.querySelectorAll('a').forEach(v => {
      //     v.style.display="none";
      //   })
      //   var els = document.getElementsByClassName('gmnoprint');
      //   Array.prototype.forEach.call(els, function(el) {
      //       el.style.display="none";
      //   });
      // }, 3000)


      if (this.tuxunPid) {
        this.setSharePano(this.tuxunPid)
      } else {
        this.change()
      }
    },
    setSharePano(tuxunPid) {
      api.getByPath('/api/v0/tuxun/random/get', {'tuxunPid': this.tuxunPid}).then(res=>{
        this.tuxunPid = tuxunPid;
        this.setPano(this.tuxunPid,res.data.panoId);
      })
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    setPano(tuxunPid, panoId) {
      this.tuxunPid = tuxunPid;
      this.panorama.setPano(panoId);
      // this.panorama.setPov({
      //   // heading: 90,
      //   // pitch: 0,
      // });
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
          tuxunJump('/tuxun/random');
          return;
        }
        api.getByPath("/api/v0/tuxun/random", {mapsId: this.mapsId}).then(res => {
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
        input.setAttribute('value', '图寻-街景分享 「' + this.location + '」https://tuxun.fun/random?id='+ this.tuxunPid);
      } else {
        input.setAttribute('value', '图寻-街景分享 https://tuxun.fun/random?id='+ this.tuxunPid);
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
</style>


