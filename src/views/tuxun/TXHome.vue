<template>
  <div>
    <el-dialog title="发送弹幕" :visible.sync="dialogVisible" :append-to-body="true">
      <el-form :model="form"  @submit.native.prevent="send" v-on:submit.prevent="send">
        <el-form-item label="弹幕:">
          <el-input id="input" v-model="form.applyModReason" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hide()">取 消</el-button>
        <el-button type="primary" @click="send()">确 定</el-button>
      </div>
    </el-dialog>

    <div id="container" :class="[{'im-view': !ISPHONE}, {'im-view-phone': ISPHONE}]">
      <div v-show="this.contentType === 'panorama'" id="viewer"  style="width: 100%; height: 100%"></div>
      <div v-if="status === 'rank'" style="z-index: 500; position: absolute; width: 100%; height: 100%; background: white; opacity: 80%; overflow:auto;">
        <div style="padding-top: 40px; font-weight: bold; font-size: 20px;">排行榜:</div>
        <div v-if="this.rank" style="padding-top: 10px; font-weight: bold; font-size: 20px">你的本场次排名:{{this.rank}}</div>
        <div v-for="item in this.ranks" class="item">
          <div class="left">
            <img :src="imgOrigin+item.userAO.icon + '?x-oss-process=image/resize,h_80/quality,q_75'" alt="">
            <div class="info">
              <div class="title">{{item.userAO.userName}}</div>
              <p v-if="item.ratingChange  && item.ratingChange > 0" class="desc">积分变化：+{{item.ratingChange}}, 积分：{{ item.rating }}</p>
              <p v-if="!item.ratingChange && item.rating" class="desc">积分无变化, 积分：{{ item.rating }}</p>
              <p v-if="!item.ratingChange && !item.rating" class="desc">积分无变化 (需要有其他人选择才计算积分)</p>
              <p v-if="item.ratingChange  && item.ratingChange < 0" class="desc">积分变化：{{item.ratingChange}}, 积分：{{ item.rating }}</p>
            </div>
          </div>
          <div class="right">距离
            <p>{{ (item.distance / 1000.0).toFixed(2) }} 千米</p>
          </div>
        </div>
      </div>
      <vue-danmaku :danmus="danmus" use-slot class="danmaku"  style="height:80%; width:100%; position: absolute; pointer-events: none" :speeds="120">
        <template slot="dm" slot-scope="{ index, danmu }" >
          <div class="danmaku-title" style="color: white; font-size: 24px;   -webkit-text-stroke: 0.5px black;">{{ danmu }}</div>
        </template>
      </vue-danmaku>
    </div>

<!--    TODO: 这里有个问题，不能在中间加 v-if 的DIV，一加在 v-if 条件触发的时候（特别是 hide）就会影响 map 的布局，原理未知，-->

    <div id="map-container" :class="[{'bm-view-container': !ISPHONE}, {'bm-view-container-phone': ISPHONE && showMap}, {'bm-view-container-phone-hidden': ISPHONE && !showMap}]"@mouseover="mapMouseOver" @mouseout="mapMouseOut">
      <div v-if="!this.isMapSmall && !ISPHONE">
        <el-button size="small" @click="mapBig" round>放大</el-button>
        <el-button size="small" @click="mapSmall" round>缩小</el-button>
        <el-button size="small" v-if="!mapPin" @click="mapPin = true" round>固定大小</el-button>
        <el-button size="small" v-if="mapPin" @click="mapPin = false" round>解除固定</el-button>
      </div>
      <div id="map" :class="[{'bm-view': !ISPHONE}, {'bm-view-phone': ISPHONE}]" ></div>
    </div>
    <div  :class="[{'confirm': !ISPHONE}, {'confirm-phone': ISPHONE}]">
      <el-button @mouseover.native="mapMouseOver" class="not_stop_hover" v-if="confirmed && distance" @click="clickDistance" round>距离 {{ distance.toFixed(2)}} 千米</el-button>
      <el-button @mouseover.native="mapMouseOver"   class="not_stop_hover" v-if="(showMap || !ISPHONE) && !confirmed && status !== 'rank'"  @click="confirm" round>确定选择</el-button>
      <el-button @mouseover.native="mapMouseOver"  class="not_stop_hover" v-else-if="!isMaps && confirmed && !distance" @click="centerChoose" round>等待答案</el-button>
      <el-button @mouseover.native="mapMouseOver"  class="not_stop_hover" v-else-if="!showMap && ISPHONE && confirmed" @click="showMapTrue" round> 打开地图</el-button>
      <el-button @mouseover.native="mapMouseOver"  class="not_stop_hover" v-else-if="!showMap && ISPHONE" @click="showMapTrue" round>选择地点</el-button>
    </div>

    <div v-if="showMap && ISPHONE" style="position: absolute; left: 20px; bottom: 20px; z-index: 1000">
      <el-button @click="showMap = false" round>隐藏地图</el-button>
    </div>

    <div v-if="!this.isMaps" :class="[{'topRight': !ISPHONE}, {'topRight-phone': ISPHONE}]">
      <div :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        在线人数：{{this.onlineNums}}
      </div>
      <div v-if="timeLeft &&( this.status === 'wait' || this.status === 'wait_result')" :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        选择倒计时: {{Math.round(timeLeft)}}
      </div>
      <div v-if="timeLeft && this.status === 'rank'" :class="[{'top-info': !ISPHONE}, {'top-info-phone': ISPHONE}]">
        下一题: {{Math.round(timeLeft)}}
      </div>
    </div>
    <div class="home">
      <el-button size="mini" @click="toHome" round> 首页 </el-button>
      <el-button v-if="!this.isMaps" size="mini"  @click="toSend" round> 发送弹幕 </el-button>
      <el-button size="mini"  @click="toReport" round> 坏题反馈 </el-button>
<!--      <el-button v-if="!ISPHONE && this.isMaps" size="mini"  @click="toSubmitPanorama" round> 提交街景 </el-button>-->
      <el-button v-if="ISPHONE" @click="reloadPage" size="mini" round>刷新页面</el-button>
      <el-button v-if="this.$store.state.user.userInfo.userId === 1" size="mini"  @click="deleteTuxun" round> 删除该题 </el-button>
      <el-button v-if="this.$store.state.user.userInfo.userId === 1 && this.isMaps" size="mini"  @click="removeFromMaps" round> 移除该题 </el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import BaiduMap from 'vue-baidu-map'
import { mapGetters } from 'vuex'
import * as api from '../../api/api'
import vueDanmaku from 'vue-danmaku'

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SmoothWheelZoom"

// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: 'aibVGReAhMEtxu4Bj2aHixWprh28AhrT'
// })
import {Viewer} from 'photo-sphere-viewer'
import * as THREE from 'three';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import { CompassPlugin} from 'photo-sphere-viewer/dist/plugins/compass'
import { MarkersPlugin} from 'photo-sphere-viewer/dist/plugins/markers'
import { VirtualTourPlugin } from 'photo-sphere-viewer/dist/plugins/virtual-tour'
import 'photo-sphere-viewer/dist/plugins/compass.css'
import 'photo-sphere-viewer/dist/plugins/virtual-tour.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import BMapLoader from "../../utils/bmap-jsapi-loader";
import {tuxunJump, tuxunOpen} from "./common";
import { loadScript } from "vue-plugin-load-script";

export default {
  components: {
    vueDanmaku,
  },
  name: "TXHome",
  data () {
    return {
      danmus: [''],
      form: {
        applyModReason: '',
      },
      panoramaSubmitForm: {
        links: '',
      },
      dialogVisible: false,
      submitPanoramaShow: false,
      panoId: null,
      viewer: null,
      center: {lng: 0, lat: 0},
      zoom: 3,
      lng: null,
      lat: null,
      targetLng: null,
      targetLat: null,
      map: null,
      BMap: null,
      confirmed: false,
      polylinePath: null,
      returnResult: true,
      distance: null,
      image: null,
      contents: undefined ,
      contentType: null,
      heading: null,
      id: null,
      showMap: false,
      url: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/v0/tuxun`,
      // url: `ws://127.0.0.1:8080/ws/v0/tuxun`,
      ws: null,
      onlineNums: 1,
      status: null,
      rank: null,
      timeLeft: null,
      mapsId: null,
      isMaps: false,
      mute: false,
      autoRotate: null,
      lastTouchTime: null,
      chooseMarker: null,
      targetMarker: null,
      targetLine: null,
      panorama: null,
      baiduPano: null,
      ranksMarker: null,
      needSmall: false,
      maxMapWidth: '40%',
      maxMapHeight: '60%',
      isMapSmall: true,
      mapPin: false,
      ranks: null,
    }
  },

  created() {
  },
  mounted() {
    THREE.Cache.enabled = false;

    this.initWS();
    this.initMap();
    document.onkeydown=function(event){
      var e = event || window.event || arguments.callee.caller.arguments[0];
      console.log(e.keyCode)
      if(e && e.keyCode===32){//空格
        this.confirm()
      }
    }.bind(this);
  },

  destroyed() {
    document.onkeydown = undefined;
    this.ws.close();
  },

  methods: {
    initMap() {
      var map = L.map('map', {
        attributionControl: true,
        worldCopyJump: true,
        coordType: 'gcj02',
        scrollWheelZoom: false, // disable original zoom function
        smoothWheelZoom: true,  // enable smooth zoom
        smoothSensitivity: 5,   // zoom speed. default is 1
        maxBoundsViscosity: 1.0, maxBounds:  [[-90,-540],   [90,540]]}).setView([38.8, 106.0], 2)
      map.scrollWheelZoom = true;
      map.attributionControl.setPosition('bottomleft');
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
      this.map.on('click', this.click);
      this.map.invalidateSize();

    },

    mapBig() {
      this.maxMapWidth = '68%';
      this.maxMapHeight = '85%';
      this.changeMapBig();
    },

    mapSmall() {
      this.maxMapWidth = '40%';
      this.maxMapHeight = '60%';
      this.changeMapBig();
    },
    changeMapBig() {
      this.isMapSmall = false
      this.needSmall = false;
      var element = document.getElementById("map-container")
      element.style.width = this.maxMapWidth;
      element.style.height = this.maxMapHeight;
      element.style.opacity = 1.0;
      this.map.invalidateSize();
      setTimeout(() => {
        this.map.invalidateSize();
      }, 5)
    },

    mapMouseOver() {
      if (!window.matchMedia("(hover: none)").matches && document.body.clientWidth > 678 && !this.mapPin) {
        this.changeMapBig();
      }
    },

    mapMouseOut() {
      if (!window.matchMedia("(hover: none)").matches && document.body.clientWidth > 678 && !this.mapPin) {
        this.needSmall = true;
        setTimeout(() => {
          if (this.needSmall) {
            this.needSmall = false;
            this.isMapSmall = true;
            var element = document.getElementById("map-container")
            element.style.width = '25%';
            element.style.height = '35%';
            element.style.opacity = 0.7;
            this.map.invalidateSize();
          }
        }, 750)
      }
    },

    initWS() {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.wsOnOpen;
      this.ws.onmessage = this.wsOnMessage;
      this.ws.onclose = this.wsOnClose;
    },

    initPanorama() {
      console.log('initPanorama');
      try {
        if (!this.viewer) {
          document.head.insertAdjacentHTML("beforeend", `<style>a[href^="http://maps.google.com/maps"]{display:none !important}a[href^="https://maps.google.com/maps"]{display:none !important}.gmnoprint a, .gmnoprint span, .gm-style-cc {display:none;}</style>`)
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
            this.setGoogle(this.panoId);
          })
        } else {
          this.setGoogle(this.panoId);
        }
      } catch (e) {
        console.log(e)
      }
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
    setGoogle(panoId) {
      this.panoId = panoId;
      // 调整视角大小的
      if (panoId.length === 27 ) {
        api.getByPath('/api/v0/tuxun/mapProxy/getPanoInfo', {pano: panoId}).then(res => {
          this.headingMap[res.data.pano] = res.data.heading;
          if (res.data.links) {
            res.data.links.forEach((item) => {
              this.headingMap[item.pano] = item.centerHeading;
            })
          }
          this.setPanoId(panoId, false);
        })
      } else {
        this.setPanoId(panoId, false);
      }
    },
    setPanoId(panoId, move) {
      this.viewer.setPano(panoId);
      if (!move) {
        this.viewer.setOptions({linksControl: false, clickToGo: false});
      } else {
        this.viewer.setOptions({linksControl: true, clickToGo: true});
      }
      this.viewer.setVisible(true);
      setTimeout(() => {
        this.viewer.setZoom(0);
      }, 50);
    },
    notShowPanorama() {
      this.viewer.hide();
    },

    initBaiduPanorama() {
      console.log("initBaiduPanorama_1");
      if (!this.panorama || this.panorama === null) {
        var panorama = new BMap.Panorama('panorama',  {navigationControl: true, linksControl:true}); //默认为显示导航控件
        this.panorama = panorama;
        console.log("initBaiduPanorama_2");
      }
      console.log("initBaiduPanorama_3");
      this.panorama.setId(this.baiduPano);
      setTimeout(function () {
        console.log("initBaiduPanorama_4");
        try {
          var element = document.getElementById('panorama');
          element.childNodes.item(3).style.display = 'none'
        } catch (e) {

        }
      }, 200);
    },

    wsOnOpen(e) {
      console.log("wsOnOpen");
      // console.log(e);

      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"enter_main_game\"}}");

      // 每3秒发送一次心跳
      setInterval(() => {
        this.sendHeartBeat();
      }, 15000);
    },

    //
    wsOnMessage(e) {
      // console.log("wsOnMessage");
      // console.log(e);
      const data = JSON.parse(e.data);
      // console.log(data);
      if (data.data.type === 'tick') {
        this.status = data.data.status;
        this.onlineNums = data.data.onlineNums;

        if (this.panoId !== data.data.panoId && data.data.panoId && data.data.panoId !== null) {
          this.showMap = false;
          this.heading = data.data.heading;
          this.panoId = data.data.panoId;

          // this.baiduPano = data.data.baiduPano;
          this.contents = data.data.contents;

          if (this.contentType !== data.data.contentType) {
            this.contentType = data.data.contentType;
          }

          if (this.contentType === "panorama") {
            setTimeout(function () {
              this.initPanorama();
            }.bind(this), 200);
          }
        }

        this.confirmed = data.data.confirmed;
        this.timeLeft = data.data.timeLeft;

        // this.$toast(this.status)

        if (data.data.status === 'wait') {
          this.confirmed = false;
          if (this.targetLat) {
            this.lat = null;
            this.lng = null;
            if (this.map) {
              this.map.setView([38.8, 106.0], 2);
            }
            this.removeChooseMarker();
          }
          this.removeTargetMarker();
          this.removeLine();
          this.clearRanksMarker();
          this.polylinePath = null;
          this.distance = null;
          this.rank = null;
          this.ranks = null;
          this.targetLat = null;
          this.targetLng = null;
        }
        if (data.data.status === 'wait_result') {
          this.lat = data.data.chooseLat;
          this.lng = data.data.chooseLng;
          this.addChooseMarker();
          this.targetLat = null;
          this.targetLng = null;
          this.removeTargetMarker();
          this.distance = null;
          this.rank = null;
          this.ranks = null;
          this.clearRanksMarker();
        }
        if (data.data.status === 'rank') {

          this.rank = data.data.rank;
          this.ranks = data.data.ranks;
          if (!this.targetLat) {
            this.lat = data.data.chooseLat;
            this.lng = data.data.chooseLng;
            this.addChooseMarker();
            this.targetLat = data.data.lat;
            this.targetLng = data.data.lng;
            this.addTargetMarker()
            this.distance = data.data.distance / 1000;

            this.showMapTrue();
            if (data.data.chooseLat && !this.polylinePath) {
              this.addLine();
              this.centerView();
            }
          }

          if (this.ranksMarker && this.ranksMarker.length === 0 && this.ranks
              &&
              (this.ranks.length >= 2 || (this.ranks.length === 1  && this.ranks[0].userAO.userId !== this.$store.state.user.userInfo.userId))
          ) {
            this.addRanksMarker();
            this.centerView();
          }

        }
      } else if (data.data.type === 'need_login') {
        this.doLoginStatus().then((res) => {

        });
      } else if (data.data.type === 'warning') {
        this.$toast(data.data.noteMessage);
      } else if (data.data.type === 'receive_bullet') {
        this.danmus.push(data.data.text);
      }
    },
    wsOnClose(e) {
      this.initWS();
      console.log("wsOnClose");
    },

    clickDistance() {
      if (this.showMap === false) {
        this.showMapTrue();
      }
    },

    centerView() {
      var group = [];
      if (this.lat) {
        group.push([this.lat, this.lng]);
      }

      if (this.targetLat) {
        group.push([this.targetLat, this.targetLng]);
      }

      if (this.ranks) {
        this.ranks.forEach(item => {
          group.push([item.latLng.lat, item.latLng.lng]);
        })
      }
      if (group.length === 1) {
        this.map.fitBounds(group, {maxZoom: 5});
      } else if (group.length > 1) {
        this.map.fitBounds(group);
      }
    },
    showMapTrue() {
      this.showMap = true;

      setTimeout(function () {
        this.map.invalidateSize();
      }.bind(this), 100);
    },

    centerChoose() {
      if (this.showMap === false) {
        this.showMap = true
      }
      this.map.setView([this.lat, this.lng], 5);
    },

    reloadPage() {
      this.$router.go(this.$router.currentRoute);
    },

    // 发送心跳
    sendHeartBeat() {
      this.wsSend(`{"scope": "heart_beat"}`);
    },

    removeChooseMarker() {
      if (this.chooseMarker) {
        this.chooseMarker.remove();
        this.chooseMarker = null;
      }
    },

    addChooseMarker() {

      if (!this.lat) {
        return;
      }
      if (this.chooseMarker) {
        this.chooseMarker.remove();
      }
      var marker = L.marker([this.lat, this.lng], {icon: new L.Icon.Default()}).bindTooltip("你选择了",
          {
            permanent: true,
            direction: 'auto'
          }).addTo(this.map);
      this.chooseMarker = marker;
    },

    addLine() {
      if (this.polylinePath) {
        this.polylinePath.remove();
        this.polylinePath = null;
      }

      if (!this.lat || !this.targetLat) {
        return;
      }

      var latlngs = [
        [this.lat, this.lng],
        [this.targetLat, this.targetLng],
      ];

      this.polylinePath = new L.Polyline(latlngs, {color: 'blue',
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1
      });
      console.log("12312");
      this.polylinePath.addTo(this.map);
    },

    removeLine() {
      if (this.polylinePath) {
        this.polylinePath.remove(this.map);
      }
      this.polylinePath = null;
    },

    removeTargetMarker() {
      if (this.targetMarker) {
        this.targetMarker.remove();
      }
      this.targetMarker = null;
    },

    addTargetMarker() {
      if (this.targetMarker) {
        this.targetMarker.remove();
      }
      var options = JSON.parse(JSON.stringify(L.Icon.Default.prototype.options))
      options.iconUrl = this.imgOrigin + 'biz/1662830770348_9499340182724556af66f2b42846135b_0.png';
      options.iconRetinaUrl = this.imgOrigin + 'biz/1662830707508_d7e5c8ce884a4fb692096396a5405f5b_0.png';
      var marker = L.marker([this.targetLat, this.targetLng], {icon: new L.Icon(options)}).bindTooltip("目标位置",
          {
            permanent: true,
            direction: 'auto'
          }).addTo(this.map);
      this.targetMarker = marker;
    },

    addRanksMarker() {
      this.ranksMarker = [];
      if (this.ranks) {
        this.ranks.forEach( item => {
          if (item.userAO.userId !== this.$store.state.user.userInfo.userId) {
            console.log(item);
            var marker = L.marker([item.latLng.lat, item.latLng.lng], {icon: new L.Icon.Default()}).bindTooltip(item.userAO.userName,
                {
                  permanent: true,
                  direction: 'auto'
                }).addTo(this.map);
            this.ranksMarker.push(marker);
          }
        });
      }

    },

    clearRanksMarker() {
      if (this.ranksMarker) {
        this.ranksMarker.forEach(item => {
          item.remove();
        });
      }
      this.ranksMarker = [];
    },

    click(e) {
      console.log(e);
      if (this.status === 'wait' || this.isMaps) {
        if (!this.confirmed) {
          this.lng = e.latlng.wrap().lng;
          this.lat = e.latlng.wrap().lat;
          this.addChooseMarker();
          this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"pin\", \"lat\": " + this.lat + ", \"lng\": " + this.lng + "}}");
        }
      } else {
        this.$toast('暂不支持选择, 请等待结果或者下一题');
      }
    },

    confirm() {
      if (!this.lng) {
        this.$toast('还未在地图上选择地点，请选择！');
        return;
      }
      if (!this.isMaps) {
        this.confirmed = true;
        this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"confirm\", \"lat\": " + this.lat + ", \"lng\": " + this.lng + "}}");
      } else {
        if (!this.lng) {
          return;
        }
        this.zoom = 20;
        this.$toast('确认成功！')
        this.confirmed = true;
        api.getByPath("/api/v0/tuxun/game/confirm", {id: this.id, lng: this.lng, lat: this.lat}).then(res => {
          this.confirmed = true;
          this.targetLng = res.data.lng;
          this.targetLat = res.data.lat;
          this.distance = res.data.distanceMeter / 1000;
          this.addTargetMarker();
          this.addLine();
          this.centerView();
        });
      }
    },

    wsSend(data) {
      console.log("wsSend: " + data);
      this.ws.send(data);
    },

    toForum(){
      try {
        window.flutter_inappwebview.callHandler('toAppForum',{forumId: 84+''})
      } catch (e) {
        window.open(location.origin + '/f/84',"_blank");
      }
    },
    toRank(){
      window.open(location.origin + '/tuxun/rank',"_blank");
    },

    toReport() {
      api.getByPath('/api/v0/tuxun/game/report', {panoId: this.panoId}).then(res=>{
        this.$toast("反馈成功");
      })
    },
    deleteTuxun() {
      api.getByPath('/api/v0/tuxun/game/delete', {panoId: this.panoId}).then(res=>{
        this.$toast("删除成功");
      })
    },
    toHome() {
      tuxunJump( '/tuxun/');
    },
    send() {
      this.dialogVisible = false;
      this.wsSend("{\"scope\": \"tuxun\", \"data\": {\"type\": \"send_bullet\", \"text\": \"" + this.form.applyModReason + "\"}}");
      this.form.applyModReason = null;
      this.$toast("发送成功");
    },
    toSend() {
      this.dialogVisible = true;
      setTimeout(function () {
        document.getElementById("input").focus();
      }, 500);
    },
    hide() {
      this.dialogVisible = false;
    },

    mapReady(e) {
      console.log("hahah");
      console.log(e)
      this.map = e;
    },

  }
}
</script>

<style scoped lang="scss">
//.not_stop_hover {
//  pointer-events:none
//}
.el-button {
  touch-action: manipulation;
}

.danmaku {
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  z-index: 500;
  .danmaku-title {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
}
.im-view {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  transform-origin: center;

}
.im-view-phone {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  left: 0;
  text-align: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  transform-origin: center;
}
.bm-view-container {
  position: absolute;
  padding-right: 2rem;
  padding-bottom: 1.5rem;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 35%;
  opacity: 0.7;
  z-index: 500;

  display:flex;
  flex-flow:column nowrap;
  overflow:hidden;


  .bm-view {
    flex: 1;
  }
}

.bm-view-container-phone {
  z-index: 500;
  position: absolute;
  width: 100%;
  height: 60%;
  bottom: 0;
  right: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .bm-view-phone {
    width: 100%;
    height: 100%;
  }
}

.bm-view-container-phone-hidden {
  z-index: 500;
  position: absolute;
  width: 100%;
  height: 60%;
  bottom: 0;
  right: 0;
  visibility: hidden;
  .bm-view-phone {
    width: 100%;
    height: 100%;
  }
}

.confirm {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 300px;
  z-index: 1000;
}

.confirm-phone {
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin:auto;
  z-index: 1000;
}
.home {
  position: absolute;
  top: 5px;
  left: 20px;
  z-index: 500;
}
.topRight {
  position: absolute;
  top: 20px;
  right: 2rem;
  z-index: 100000;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

.leaflet-clickable {
  cursor: crosshair !important;
}
/* Change cursor when over entire map */
.leaflet-container {
  cursor: crosshair !important;
}

.topRight-phone {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100000;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

.top-info {
  font-size: 20px;
  font-weight: bold;
  color: white;
  -webkit-text-stroke: 0.8px black;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  z-index: 5000;
}
.top-info-phone {
  font-size: 10px;
  font-weight: bold;
  color: white;
  -webkit-text-stroke: 0.4px black;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.item{
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #f1f1f1;
  // height: 60px;
  // box-sizing: border-box;
  text-align: left;
  overflow: hidden;
  .left{
    z-index: 5000;
    flex: 1;
    display: flex;
    img{
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      vertical-align: middle;
    }
    .title{
      font-size: 16px;
      text-align: left;
    }
    .desc{
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #888;
      font-size: 13px;
    }
    .info{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .right{
    flex: 0 0 60px;
    // line-height: 40px;
    text-align: center;
    font-size: 12px;
    p{
      font-size: 14px;
    }
  }

}


//@media(any-hover:hover) {
//  .bm-view {
//    &:hover {
//      width: 40%;
//      height: 60%;
//      opacity: 1;
//    }
//  }
//}
@media  (any-hover:none) {
  .bm-view-container {
    width: 40%;
    height: 40%;
    opacity: 1;
  }
}

</style>
