<template>
  <div class="container">
    <div id="map" class="maps"></div>
    <div class="back_home">
      <el-button v-if="history && history.length > 1" @click="goBack" size="small" round>←返回</el-button>
      <el-button @click="goHome" size="small" round>图寻首页</el-button>
    </div>
    <div style="z-index: 10000; position: absolute; right: 1.5rem; top: 1.5rem">注: 点击黄色针头查看街景</div>
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
      history: null,

      map: null,
    };
  },
  mounted() {
    this.history = history;
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
        var marker = L.marker([round.lat, round.lng], {icon: new L.Icon(options)}).bindTooltip("第" + round.round + "轮",
            {
              permanent: true,
              direction: 'auto'
            }).addTo(this.map);
        marker.round = round;
        marker.on("click", function (e) {
          console.log(e);
          this.toPanorama(gameData.id, e.target.round)
        }.bind(this));
        group.push([round.lat, round.lng])
      };

      var user = null;
      if (gameData != null && gameData.player != null && gameData.requestUserId === gameData.player.user.userId) {
        user = gameData.player;
      }

      if (gameData.teams && gameData.teams.length >= 1) {
        gameData.teams.forEach(team => {
          team.teamUsers.forEach(teamUser => {
            console.log(teamUser)
            if (gameData.requestUserId === teamUser.user.userId) {
              user = teamUser;
            }
          })
        });
      }

      console.log(user);

      user.guesses.forEach(guess => {
        var marker = L.marker([guess.lat, guess.lng], {icon: new L.Icon.Default()}).bindTooltip("你的选择",
            {
              permanent: true,
              direction: 'auto'
            }).addTo(this.map);

        var latlngs = [
          [guess.lat, guess.lng],
          [gameData.rounds[guess.round-1].lat, gameData.rounds[guess.round-1].lng],
        ];

        this.polylinePath = new L.Polyline(latlngs, {
          color: 'blue',
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1
        });
        this.polylinePath.addTo(this.map);

        group.push([guess.lat, guess.lng])
      })

      this.map.fitBounds(group);
    },
    toPanorama(gameId, round) {
      // console.log(round);
      if (!round.source || !round.panoId ) {
        this.$toast('该街景暂不支持跳转');
        return;
      }
      if (round.source === 'baidu_pano') {
        console.log(round.panoId)
        tuxunOpen('https://maps.baidu.com/#panoid=' + round.panoId + '&panotype=street&pitch=0&l=13&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=' + round.panoId)
      } else {
        tuxunJump('/tuxun/replay_pano?gameId=' + gameId + '&round=' + round.round)
      }
      console.log('123');
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
