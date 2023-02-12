<template>
  <div class="container">
    <div class="back_home" @click="goHome">
      <el-button type="primary" round>←返回首页</el-button>
    </div>
    <div class="main_content">
      <div class="top">
        <div class="nav">
          图寻每日挑战
        </div>
        <div class="time">
          {{this.getDate()}}
        </div>
        <div class="hint">
          每日0点更新，三种模式各5个所有人统一的题目，满分25000，使用小号会被取消每日挑战资格，不建议看过当日解析视频/讨论的用户挑战
          <p>
            固定街景为不可移动的街景，较考验技术，移动街景为可无限制移动的街景，更侧重趣味性。
          </p>
        </div>
        <div class="tab_container">
          <div class="tab">
            <div @click="type='china';init();" :class="{'normal': type!=='china', 'choose': type==='china'}">
              中国固定
            </div>
            <div @click="type='noMove';init();" :class="{'normal': type!=='noMove', 'choose': type==='noMove'}">
              全球固定
            </div>
            <div @click="type='move';init()" :class="{'normal': type!=='move', 'choose': type==='move'}">
              全球移动
            </div>
          </div>
        </div>
        <el-button v-if="!this.gameData || (this.gameData && this.gameData.status === 'ready') || this.showBegin" type="primary" size="large" @click="begin" round>开始今日挑战</el-button>
        <el-button v-if="this.gameData && this.gameData.status === 'ongoing'" type="warning" size="large" @click="again" round>继续今日挑战</el-button>
        <div class="total" v-if="this.total &&( !this.gameData ||  this.gameData.status !== 'finish')">已有 {{this.total}} 人完成挑战</div>
        <div class="score" v-if="this.gameData && this.gameData.status === 'finish'">今日得分: {{this.gameData.player.totalScore}}</div>
        <div class="score" v-if="this.gameData && this.gameData.status === 'finish' && this.dailyChallengeRank">排名: {{this.dailyChallengeRank}} / {{this.dailyChallengeTotalPlayers}}</div>
        <div class="score" v-if="this.gameData && this.gameData.status === 'finish' && this.dailyChallengePercent">超过：{{((1 - this.dailyChallengePercent) * 100).toFixed(2)}} % 选手</div>
        <div class="rank">
          今日挑战排名
        </div>
        <div class="rank_container" v-if="this.rank">
          <div @click="toUser(item.user)" v-for="(item,index) in this.rank" :key="index" class="item">
            <div class="left">
              <div class="number">
                {{index + 1}}.
              </div>
              <img style="object-fit: cover;" :src="imgOrigin+ item.user.icon + '?x-oss-process=image/resize,h_80/format,webp/quality,q_75'" alt="">
              <div class="info">
                <div class="title">{{item.user.userName}}</div>
              </div>
            </div>
            <div class="right">
              <p>总分: {{item.score}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {tuxunJump, tuxunOpen} from "./common";
import * as api from '../../api/api'

export default {
  name: "DailyChallenge",

  data() {
    return {
      challengeId: undefined,
      gameData: undefined,
      rank: undefined,
      dailyChallengeRank: null,
      dailyChallengeTotalPlayers: null,
      dailyChallengePercent: null,
      showBegin: false,
      type: 'china',
      total: null,

    }
  },

  created() {
    this.init();
  },

  methods: {
    initSelfRank() {
      api.getByPath('/api/v0/tuxun/challenge/getGameInfo', {'day': '1', type: this.type}).then(res => {
        console.log(res.data)
        if (res.success) {
          if (res.data) {
            this.gameData = res.data;
            this.challengeId = res.data.challengeId;
            this.getDailyChallengeRank()
          }
        } else {
          this.showBegin = true;
        }
      })
    },
    init() {
      this.gameData = null;
      this.showBegin = false;
      this.challengeId = null;
      this.dailyChallengeRank = null;
      this.dailyChallengePercent = null;
      this.dailyChallengeTotalPlayers = null;
      this.total = null;
      this.rank = null;

      if (this.type === 'move') {
        api.getByPath('/api/v0/tuxun/vip/check').then(res => {
          if (res.data) {
            this.initSelfRank();
          }
        })
      } else {
        this.initSelfRank();
      }

      api.getByPath('/api/v0/tuxun/challenge/getDailyChallengeId', {type: this.type}).then(res => {
        if (res.data) {
          this.challengeId = res.data;
          this.getRank();
        }
      })
    },
    getDailyChallengeRank() {
      api.getByPath('/api/v0/tuxun/challenge/getDailyChallengeRank', {'challengeId': this.challengeId, 'gameId': this.gameData ? this.gameData.id : null }).then(res=>{
        this.dailyChallengeRank = res.data.rank;
        this.dailyChallengePercent = res.data.percent;
        this.dailyChallengeTotalPlayers = res.data.total;
      })
    },
    goHome() {
      tuxunJump('/tuxun/');
    },
    beginCall() {
      api.getByPath('/api/v0/tuxun/challenge/start', {'gameId': this.gameData.id}).then(res=>{
        this.gameData= res.data;
        tuxunJump( '/tuxun/challenge?challengeId=' + this.gameData.challengeId);
      })
    },
    begin() {
      this.doLoginStatus().then(res => {
        console.log(res)
        if (res) {
          if (this.type === 'move') {
            api.getByPath('/api/v0/tuxun/vip/check').then(res=>{
              if (res.data) {
                this.beginCall();
              } else {
                this.$vip();
              }
            })
          } else {
            this.beginCall();
          }
        }
      });
      // window.location.href =
    },
    again() {
      tuxunJump( '/tuxun/challenge?challengeId=' + this.gameData.challengeId);
    },

    getRank() {
      api.getByPath('/api/v0/tuxun/challenge/rankNew', {challengeId: this.challengeId}).then(res=>{
        if (res.success) {
          this.rank = res.data.rank;
          this.total = res.data.total;
        }
      })
    },
    toUser(user) {
      tuxunJump( '/tuxun/user/' + user.userId);
    },

    getDate() {  //当前时间格式化处理
      var str = '';
      var date = new Date();
      str += date.getFullYear() + "年 "; //获取年份
      str += date.getMonth() + 1  + "月 "; //获取月份
      str += date.getDate() + "日"; //获取日
      return str;
    },
  }

}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: #090723;

  .main_content {
    height: 100%;
    width: 100%;
    justify-content: center;
    text-align: center;
    //align-items: center;

    .top {
      width: 100%;
      padding-top: 2rem;
      //display: flex;
      justify-content: center;

      .nav {
        color: white;
        font-size: 48px;
        font-weight: bold;
        padding-top: 3rem;
      }
      div {
        color: floralwhite;
      }
      .score {
        font-size: 32px;
        color: white;
      }
      .total {
        padding-top: 1rem;
      }
      .time {
        font-size: 32px;
        color: gold;
      }
      .hint {
        color: gray;
        padding-bottom: 2rem;
      }
      .rank {
        padding-top: 2rem;
        font-size: 16px;
        color: darkgray;
      }
      .tab_container {
        width: 40%;
        margin: auto;
        padding-top: 0rem;
        padding-bottom: 2rem;
        color: black;

        .tab {
          width: 100%;
          display: flex;
          .choose {
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            width: 50%;
            height: 50px;
            font-size: 24px;
            color: gold;
            background-color: #3590FF;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          .normal {
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
            height: 50px;
            width: 50%;
            font-size: 24px;
            background-color: white;
          }
        }
      }
      .rank_container {
        padding-top: 2rem;
        padding-bottom: 5rem;
        margin: auto;
        width: 40%;

        .item {
          display: flex;
          justify-content: space-between;
          padding: 5px;
          border-bottom: 1px solid #f1f1f1;
          // height: 60px;
          // box-sizing: border-box;
          overflow: hidden;

          .left {
            flex: 1;
            display: flex;

            .number {
              //position: absolute;
              text-align: end;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              font-size: 16px;
              margin-right: 8px;
            }
            img {
              flex: 0 0 40px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
              vertical-align: middle;
            }

            .title {
              font-size: 16px;
            }

            .desc {
              width: 180px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #888;
              font-size: 13px;
            }

            .info {
              display: flex;
              flex-direction: column;
              justify-content: space-around;

            }
          }

          .right {
            flex: 0 0 60px;
            // line-height: 40px;
            text-align: center;
            font-size: 12px;

            p {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
}

@media only screen and (max-width: 679px) {
  .container {
    .main_content {
      .top {
        .rank_container {
          width: 90%;
        }
        .tab_container {
          width: 90%;
        }
      }
    }
  }
}
</style>
