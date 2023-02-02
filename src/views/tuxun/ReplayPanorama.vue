<template>
  <div class="container">
    <div id="viewer"  style="position: absolute; width: 100%; height: 100%"></div>
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>图寻首页</el-button>
      <el-button @click="toReport" round> 坏题反馈 </el-button>

    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import {Viewer} from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import { CompassPlugin} from 'photo-sphere-viewer/dist/plugins/compass'
import { MarkersPlugin} from 'photo-sphere-viewer/dist/plugins/markers'
import { VirtualTourPlugin } from 'photo-sphere-viewer/dist/plugins/virtual-tour'
import 'photo-sphere-viewer/dist/plugins/compass.css'
import 'photo-sphere-viewer/dist/plugins/virtual-tour.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import { loadScript } from "vue-plugin-load-script";
import {tuxunJump, tuxunOpen} from "./common";

export default {
  name: "ReplayPanorama",
  data() {
    return {
      gameId: null,
      round: null,
      gameData: null,
      image: null,
      viewer: null
    }
  },
  mounted() {
    this.gameId = this.$route.query.gameId;
    this.round = this.$route.query.round;

    this.get();
  },
  methods: {
    get() {
      api.getByPath("/api/v0/tuxun/solo/get", {gameId: this.gameId}).then(res => {
        console.log(res.data);
        if (res.success) {
          this.render(res.data.rounds[this.round-1]);
        }
      });
    },
    goHome() {
      tuxunJump('/tuxun/')
    },
    goBack() {
      window.history.back();
    },
    toReport() {
      api.getByPath('/api/v0/tuxun/game/report', {content: this.image}).then(res => {
        this.$toast("反馈成功");
      })
    },
    render(round) {
      console.log(round);
      if (!round.move) {
        if (!this.viewer) {
          var plugins = [];
          plugins.push([CompassPlugin, {
            size: '5vh',
            position: 'left bottom'
          }]);
          plugins.push([VirtualTourPlugin, {
            positionMode: VirtualTourPlugin.MODE_GPS,
            renderMode: VirtualTourPlugin.MODE_3D,
            // preload: true,
          }]);

          this.viewer = new Viewer({
            loadingImg: this.imgOrigin + 'biz/1659528755270_550cd22e10c84073a12e6f83840320bc.gif',
            navbar: null,
            container: document.querySelector('#viewer'),
            panoData: {
              poseHeading: this.heading, // 0 to 360
            },
            defaultZoomLvl: 0,
            plugins: plugins
          });
        }
        var virtualTour = this.viewer.getPlugin(VirtualTourPlugin);
        if (this.canUseWebP() && round.contentSpeedUp) {
          this.image = round.contentSpeedUp;
        } else {
          this.image = round.content;
        }
        virtualTour.setNodes([{
          panorama: 'https://i.chao-fan.com/' + this.image,
          id: round.round,
          position: [0, 0],
          links: [],
          panoData: {poseHeading: round.heading}
        }])

        this.viewer.animate({
          zoom: 0,
          speed: '1000rpm',
        }).then(() => {
        });

        var compassPlugin = this.viewer.getPlugin(CompassPlugin);
        if (compassPlugin) {
          console.log(round.heading);
          if (round.heading) {
            compassPlugin.show();
          } else {
            compassPlugin.hide();
          }
        }

        setTimeout(function () {
          THREE.Cache.clear();
        }, 1000);
      } else {
        if (!this.viewer) {
          document.head.insertAdjacentHTML("beforeend", `<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>`)
          this.sharePanoId = this.$route.query.pano;
          loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-1.js').then(() => {
            this.viewer = new google.maps.StreetViewPanorama(
                document.getElementById("viewer"), {
                  fullscreenControl: false,
                  panControl: true,
                  addressControl: false,
                  imageDateControl: false,
                  motionTracking: false,
                  motionTrackingControl: false,
                  streetViewControl: false,
                  showRoadLabels: false,
                  scaleControl: false,
                  zoomControl: false,
                  panControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                  },
                }
            );
            this.setGoogle(round.panoId);
          })
        } else {
          this.setGoogle(round.panoId);
        }
      }
    },
    setGoogle(panoId) {
      this.viewer.setPano(panoId);
      this.viewer.setVisible(true);
      setTimeout(() => {
        this.viewer.setZoom(0);
      }, 50);
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
}
</style>
