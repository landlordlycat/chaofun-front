<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>图寻首页</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api'
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SmoothWheelZoom"
import {tuxunOpen} from "./common";
export default {
  name: "Replay",
  data() {
    return {
      gameId: null,
      map: null,
    };
  },
  mounted() {
    var map = L.map('map', {
      attributionControl: true,
      worldCopyJump: true,
      coordType: 'gcj02',
      scrollWheelZoom: false, // disable original zoom function
      smoothWheelZoom: true,  // enable smooth zoom
      smoothSensitivity: 3,   // zoom speed. default is 1
      maxBoundsViscosity: 1.0,
      maxBounds: [[-90, -540], [90, 540]]
    }).setView([38.8, 106.0], 3)
    map.scrollWheelZoom = true;
    map.attributionControl.setPosition('bottomleft');
    map.zoomControl.setPosition('bottomright');
    map.attributionControl.setPrefix('华为地图');
    map.attributionControl.addAttribution('GS（2022）2885号');
    var url = 'https://map.chao-fan.com/tile/s2_z{z}_x{x}_y{y}.png';
    if(this.ISPHONE){
      url = 'https://map.chao-fan.com/tile/s1_z{z}_x{x}_y{y}.png';
    }
    L.tileLayer(url, {
      maxZoom: 18,
      minZoom: 1,
    }).addTo(map);
    this.map = map;
    this.gameId = this.$route.query.gameId;
    this.get();
  },
  methods: {
    get() {
      api.getByPath("/api/v0/tuxun/solo/get", {gameId: this.gameId}).then(res => {
        console.log(res.data);
        if (res.success) {
          this.addMarker(res.data)
        }
      });
    },
    addMarker(gameData) {
      console.log(gameData.rounds)
      var group = [];

      for (var i in gameData.rounds) {
        var round = gameData.rounds[i];
        var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options))
        options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
        options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
        var marker = L.marker([round.lat, round.lng], {icon: new L.Icon(options)}).on('click', function(e) {
          this.toPanorama(round);
        }.bind(this)).bindTooltip("第" + round.round + "轮",
            {
              permanent: true,
              direction: 'auto'
            }).addTo(this.map);
        group.push([round.lat, round.lng])
        this.map.fitBounds(group);
      };
    },
    toPanorama(round) {
      if (!round.source || !round.panoId ) {
        this.$toast('不支持跳转');
      }
      if (round.source === 'baidu_pano') {
        tuxunOpen('https://maps.baidu.com/#panoid=' + round.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + round.panoId)
      } else {
        tuxunOpen('https://www.google.com/maps/@?api=1&map_action=pano&pano=' + round.panoId)
      }

    },
    goHome() {
      window.location.href = '/scratch/home'
    },
    goBack() {
      try {
        this.$router.go(-1);
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
  height: 100%;
  .maps {
    position: absolute;
    width: 100%;
    height: 100%;
    //width: 50%;
    //height: 50%;
  }
  .back_home {
    position: fixed;
    padding-top: 1rem;
    padding-left: 1rem;
    z-index: 500;
  }
}
</style>
