<template>
<div class="container">
  <div id="viewer" style="position: absolute; width: 100%; height: 100%"></div>
  <div v-if="panos && panos.length !== 0" style="position: absolute;display: flex; z-index: 5000; width: 100%">
    <div :class="index == current ? 'choose' : 'normal'" @click="current=index; setPanoId(panos[index].panoId)" v-for="(item, index) in panos">
      <div>
        <div>
          第 {{index + 1}} 题
        </div>
        <div style="font-size: 10px">
          {{panos[index].nation}}
        </div>
      </div>
    </div>
  </div>
  <el-button @click="bindDaily" style="position: absolute; right: 1rem; bottom: 1rem; z-index: 5000">bind</el-button>
</div>
</template>

<script>
import * as api from '../../api/api'
import { loadScript } from "vue-plugin-load-script";

export default {

  name: "TuxunFilter",
  data() {
    return {
      type: null,
      exceptNations: null,
      viewer: null,
      headingMap: {},
      panos: [],
      challengeId: null,
      current: 0,
    }
  },

  mounted() {
    this.type = this.$route.query.type;
    this.exceptNations = this.$route.query.exceptNations;
    this.expectNations = this.$route.query.expectNations;
    this.create();
  },
  methods: {
    create() {
      api.getByPath('/api/v0/tuxun/challenge/adminCreate', {type: this.type, mapsId: 4, exceptNations: this.exceptNations, expectNations: this.expectNations}).then(res=>{
        if (res.data) {
          this.current = 0;
          this.panos = res.data.rounds;
          this.challengeId = res.data.id;
          this.panos.forEach(v => {
            this.headingMap[v.panoId] = v.heading;
          })
          this.initContainer();
        }
      })
    },

    initContainer() {
      setTimeout(function () {
        if (!this.viewer) {
          document.head.insertAdjacentHTML("beforeend", `<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>`)
          this.sharePanoId = this.$route.query.pano;
          loadScript('https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-test.js').then(() => {
            this.viewer = new google.maps.StreetViewPanorama(
                document.getElementById("viewer"), {
                  fullscreenControl:false,
                  panControl:true,
                  addressControl: false,
                  imageDateControl: false,
                  motionTracking: false,
                  motionTrackingControl:false,
                  streetViewControl:false,
                  showRoadLabels: false,
                  scaleControl: false,
                  zoomControl: false,
                  panControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                  },
                }
            );
            this.viewer.registerPanoProvider(this.getCustomPanorama)
            this.viewer.addListener("pano_changed", () => {
              console.log("pano_changed");
              if (this.viewer.getPano().length === 27) {
                this.getPanoInfo(this.viewer.getPano());
              }
            });
            this.setPanoId(this.panos[this.current].panoId);
          })
        } else {
          this.setPanoId(this.panos[this.current].panoId);
        }
      }.bind(this), 100);
    },
    setPanoId(panoId) {
      this.viewer.setPano(panoId);
      this.viewer.setVisible(true);
      this.viewer.setZoom(0);
    },
    getCustomPanorama(pano) {
      if (pano.length === 27) {
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
            centerHeading: this.headingMap[pano],
            getTileUrl: this.getCustomPanoramaTileUrl,
          },
        };
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
    getPanoInfo(pano) {
      api.getByPath('/api/v0/tuxun/mapProxy/getPanoInfo', {pano: pano}).then(res => {
        this.viewer.setLinks(res.data.links);
        // this.centerHeading = res.data.heading;
        this.headingMap[res.data.pano] = res.data.heading;
        if (res.data.links) {
          res.data.links.forEach((item) => {
            this.preloadImage(item.pano);
            this.headingMap[item.pano] = item.centerHeading;
          })
        }
        // console.log(this.centerHeading);
      })
    },
    preloadImage(pano) {
      var img=new Image();
      img.src='https://tuxun.fun/api/v0/tuxun/mapProxy/bd?pano=' + pano;
    },
    bindDaily() {
      console.log()
      this.getDate();
      api.getByPath('/api/v0/tuxun/challenge/bindDaily', {day: this.getDate(), type: this.type, challengeId: this.challengeId}).then(res => {
        if (res.success) {
          tuxunJump( '/tuxun/challenge?challengeId=' + res.data);
        }
      })
    },
    getDate() {
      const currentDate = new Date();

      currentDate.setDate(currentDate.getDate() + 1);

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      const dateString = `${year}${month}${day}`;
      console.log(dateString);
      return dateString
    }

  }

}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .image_container {
    position: relative;
    width: 100%;
    .image {
      width: 100%;
      object-fit: contain;
    }
  }
  .choose {
    cursor: pointer;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 60px;
    font-size: 24px;
    color: gold;
    width: 20%;
    background-color: #3590FF;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .normal {
    cursor: pointer;
    color: black ;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    align-content: center;
    border-width: 1px;
    border-color: red;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 20%;
    height: 60px;
    font-size: 24px;
    background-color: white;
  }
}
</style>
