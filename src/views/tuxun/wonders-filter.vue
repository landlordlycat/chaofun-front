<template>
  <div class="container" style="height: 100%; width: 100%; display: flex;flex-direction: column; ">
    <div class="back_home">
      <div v-if="!ISPHONE" class="middle-title">街景奇观审核</div>
      <div class="button">
        <el-button @click="goBack" size="large" round>←返回</el-button>
      </div>
      <div class="button">
        <el-button type="primary" @click="accept" size="large" round>通过</el-button>
        <el-button type="warning" @click="remove" size="large" round>废弃</el-button>
      </div>
    </div>
    <div id="map" class="map" style=""></div>

  </div>
</template>

<script>
import * as api from "../../api/api";
import { loadScript } from "vue-plugin-load-script";

export default {
  name: "wonders-filter",
  data() {
    return {
      panorama: null,
      tuxunPid: null,
      location: null,
      submitPanoramaShow: false,
      form: {
        applyModReason: "",
      },
      panoramaSubmitForm: {
        links: "",
      },
    };
  },
  created() {
    document.head.insertAdjacentHTML("beforeend", `<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>`)
    this.tuxunPid = this.$route.query.id;
    loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-test.js').then(() => {
      this.init();
    })
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
      this.change();
    },
    change() {
      api.getByPath("/api/v0/tuxun/wonders/checkSubmit").then(res => {
        if (res.success) {
          this.setPano(res.data.tuxunPid, res.data.panoId);
        }
      })
    },
    accept() {
      api.getByPath("/api/v0/tuxun/wonders/accept", {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          console.log(res.data)
          this.setPano(res.data.tuxunPid, res.data.panoId);
        }
      })
    },
    remove() {
      api.getByPath("/api/v0/tuxun/wonders/remove", {tuxunPid: this.tuxunPid}).then(res => {
        if (res.success) {
          console.log(res.data)
          console.log(res.data.tuxunPid, res.data.panoId)
          this.setPano(res.data.tuxunPid, res.data.panoId);
        }
      })
    },
    setPano(tuxunPid, panoId) {
      console.log(tuxunPid, panoId)
      this.tuxunPid = tuxunPid;
      this.panorama.setPano(panoId);
      this.panorama.setVisible(true);
      this.getLocation(panoId)
      // 调整视角大小的
      this.panorama.setZoom(0);
    },
    getLocation(panoId) {
      api.getByPath("/api/v0/tuxun/getLocation", {panoId: panoId}).then(res => {
        this.location = res.data;
      })
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
.back_home {
  background-color: #1C1C2E;
  width: 100%;
  //position: absolute;
  color: white;
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 4rem;

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
.map {
  align-items: stretch;
  flex-grow: 1;
}


</style>
