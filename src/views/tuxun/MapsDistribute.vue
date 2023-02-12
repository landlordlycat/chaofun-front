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
import {tuxunJump, tuxunOpen} from "./common";
export default {
  name: "Replay",
  data() {
    return {
      gameId: null,
      map: null,
      mapsId: null,
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
    }).setView([38.8, 106.0], 2)
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
    this.mapsId = this.$route.query.mapsId;
    this.get();
  },
  methods: {
    get() {
      api.getByPath("/api/v0/tuxun/maps/listSimplePano", {mapsId: this.mapsId}).then(res => {
        console.log(res.data);
        if (res.success) {
          this.addMarker(res.data)
        }
      });
    },
    addMarker(data) {
      var group = [];

      for (var i in data) {
        var latlng = data[i];
        var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options))
        options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
        options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
        var marker = L.marker([latlng.lat, latlng.lng], {icon: new L.Icon(options)}).addTo(this.map);
        marker.latlng = latlng;
        marker.on("click", function (e) {
          console.log(e);
          this.toPanorama(e.target.latlng);
        }.bind(this));
        group.push([latlng.lat, latlng.lng])
      };

      this.map.fitBounds(group);
    },

    toPanorama(latlng) {
      // console.log(round);
      if (!latlng.source || !latlng.panoId ) {
        this.$toast('该街景暂不支持跳转');
        return;
      }
      if (latlng.source === 'baidu_pano') {
        tuxunOpen('https://maps.baidu.com/#panoid=' + latlng.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + latlng.panoId)
      } else {
        tuxunOpen('https://www.google.com/maps/@?api=1&map_action=pano&pano=' + latlng.panoId)
      }
    },
    goHome() {
      tuxunJump('/tuxun/')
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
