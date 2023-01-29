<template>
  <div class="container">
    <div class="top-left">
      <el-button type="primary" @click="goHome" round>←返回首页</el-button>
    </div>
    <div style="width: 100%; text-align: center; align-items: center; padding-top: 20px">
        <div @click="toUser(userProfile)" v-if="this.userProfile" class="left">
          <img :src="imgOrigin+this.userProfile.userAO.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
          <div class="info">
            <div class="title">{{this.userProfile.userAO.userName}} (uid: {{this.userProfile.userAO.userId}})</div>
          </div>
          <div v-if="isVip">
            图寻会员 <span v-if="vipDue">｜过期时间 {{vipDue}}</span>
          </div>
        </div>
      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="logout()">退出登陆</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="$vip()">续费/开通会员</el-button>
      <div style="height: 10px"></div>
      <el-button v-if="this.userProfile && this.$store.state.user.userInfo.userId === this.userProfile.userAO.userId" @click="changeSetting()">修改用户名/头像</el-button>
    </div>
    <div v-if="this.userProfile" style="padding-left: 20px">
      <div>
        <span>分数: </span>
        <span style="color: red">{{this.userProfile.rating}}</span>
      </div>
      <div>
        <span>排名: </span>
        <span style="color: blue">{{this.userProfile.rank}}</span>
      </div>
      <div>
        <span>贡献街景: </span>
        <span>{{this.userProfile.contributes}}</span>
      </div>
      <div>
        <span>最高分: </span>
        <span>{{this.userProfile.maxRating}}</span>
      </div>
      <div>
        <span>最高排名: </span>
        <span>{{this.userProfile.maxRanking}}</span>
      </div>

      <div>
        <span>游戏次数:  </span>
        <span>{{this.userProfile.gameTimes}}</span>
      </div>

      <div>
        <span>匹配Solo目前连胜:  </span>
        <span>{{this.userProfile.winningStreak}}</span>
      </div>

      <div>
        <span>匹配Solo最长连胜:  </span>
        <span>{{this.userProfile.longestWinningStreak}}</span>
      </div>

    </div>
    <div style="padding-left: 20px; padding-top: 20px; padding-right: 20px">
      <div style="font-size: 20px">
        分数走势：
      </div>
      <v-chart class="chart" :option="option" />
    </div>
    <div style="padding-left: 20px; padding-top: 20px; padding-right: 20px">
      <div style="font-size: 20px">
        游戏活跃：
      </div>
      <calendar-heatmap :values="this.activity" :end-date="this.endDate" tooltip-unit="活动" />
    </div>
  </div>

</template>

<script>
// @ is an alias to /src

import moment from "moment";
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api'
import { CalendarHeatmap } from 'vue-calendar-heatmap'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import {tuxunJump, tuxunOpen} from "./common";


use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);


export default {
  components: {
    CalendarHeatmap,
    VChart
  },
  data(){
    return {
      userId: null,
      userProfile: null,
      endDate: null,
      activity: [],
      historys: null,
      vipDue: null,
      isVip: false,
      option: {
        xAxis: {
          type: 'time',
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  created() {
    this.userId= this.$route.path.split("/")[this.$route.path.split("/").length - 1];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.endDate = yyyy + '-' + mm + '-' + dd;
    this.getUserProfile();
    this.getUserActivity();
    this.getHistory();
    this.checkVip();
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      setTimeout(() => {
        tuxunJump('/tuxun/')
      }, 1000);
    },
    getUserProfile() {
      api.getByPath('/api/v0/tuxun/getProfile', {userId: this.userId}).then(res=>{
        this.userProfile = res.data
      })
    },
    getUserActivity() {
      api.getByPath('/api/v0/tuxun/getUserDailyActivity', {userId: this.userId}).then(res=>{
        this.activity = res.data
      })
    },
    getHistory() {
      api.getByPath('/api/v0/tuxun/getUserHistory', {userId: this.userId}).then(res=>{
        this.historys = res.data
        console.log(this.historys);
        var data = [];

        this.historys = this.historys.reverse();
        for (let i = 0; i < this.historys.length; i++) {
          var history = this.historys[i];
          data.push([history['gmt_create'], history['rating']])
        }
        this.option.series = [{
          data:data,
          type: 'line',
          smooth: false
        }];
      })

    },
    toUser(item){
      try {
        window.flutter_inappwebview.callHandler('toAppUser',{userId: item.userAO.userId+''})
      } catch (e) {
        window.open(location.origin + '/user/'+item.userAO.userId,"_blank");
      }
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    changeSetting() {
      tuxunJump('/tuxun/settings')
    },
    checkVip() {
      if (this.$store.state.user.userInfo.userId.toString() === this.userId) {
        api.getByPath('/api/v0/tuxun/vip/check').then(res=>{
          if (res.data) {
            this.isVip = true;
            this.vipDue = moment(res.data).format('YYYY年MM月DD日');
          }
        })
      } else {
        api.getByPath('/api/v0/tuxun/vip/checkIsVip', {userId: this.userId}).then(res => {
          if (res.data) {
            this.isVip = true;
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  background-color: #090723;
  div {
    color: white;
  }

  .top-left {
    padding-left: 1rem;
    padding-top: 1rem;
  }

}
.chart {
  //height: 50vh;
  height: 400px;
}
</style>
